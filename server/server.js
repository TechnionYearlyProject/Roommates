const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  OK
} = require('http-status');
const {
  ObjectID
} = require('mongodb');
require('./server-config');
require('./db/mongoose');
require('./socketsServer');
const {
  useVue
} = require('./middleware/vuejs');
const {
  useCors
} = require('./middleware/cors');
const geoLocation = require('./services/geoLocation/geoLocation');
const {
  Apartment
} = require('./models/apartment');
const {
  Review
} = require('./models/review');
const {
  User
} = require('./models/user');
const {
  XAUTH
} = require('./constants');
const {
  authenticate
} = require('./middleware/authenticate');
const {
  getSupportedHobbies
} = require('./models/hobbie');
const {
  getSupportedTags
} = require('./models/tag');
const {
  getVisitStatusCodes,
  canModifyVisit,
  canAddVisit,
  getVisitStatusChangeActions
} = require('./models/visit');
const {
  NotificationsTypesEnum,
  updateNotificationByJson
} = require('./models/notification');
const {
  logInfo
} = require('./services/logger/logger');
const httpLogger = require('./services/logger/http-logger');
const {
  notifyUsers
} = require('./services/notifications-system/notifier');
const {
  convertArrayToJsonMap
} = require('./helpers/arrayFunctions');
const userVerificator = require('./services/user-verification/user-verificator');
const passwordReset = require('./services/password-reset/password-reset');
const errors = require('./errors');
const imageService = require('./services/image-service/image-service');

const app = express();

app.use(httpLogger.logResponseBodyOnError);
app.use(
  bodyParser.json({
    limit: '5mb'
  })
);
useCors(app);
useVue(app);

/**
 * Add a new apartemnt. The posting user has to be authenticated.
 * the specified center point and radius.
 *
 * @updatedBy: Alon Talmor
 * @date: 24/05/18
 * Now the route uses image-service to upload images to storage.
 *
 * @param {String} title
 * @param {Number} price
 * @param {String} address
 * @param {String} entrance date
 * @param {[String]} images
 * @param {String} description
 * @param {[Number]} tags
 * @param {Number} requiredRoommates
 * @param {Number} totalRoommates
 * @param {[Number]} numberOfRooms
 * @param {Number} floor
 * @param {Number} totalFloors
 * @param {[Number]} area
 */
app.post('/apartments', authenticate, async (req, res) => {
  try {
    const address = _.pick(req.body.address, [
      'state',
      'city',
      'street',
      'number'
    ]);
    const location = {
      address,
      geolocation: await geoLocation.getGeoLocationCoords(
        `${address.street} ${address.number} ${address.city} ${address.state}`
      )
    };
    if (!location.geolocation) {
      return res.status(BAD_REQUEST).send(errors.invalidLocation);
    }

    const apartmentData = _.pick(req.body, [
      'price',
      'entranceDate',
      'images',
      'description',
      'tags',
      'requiredRoommates',
      'totalRoommates',
      'numberOfRooms',
      'floor',
      'totalFloors',
      'area'
    ]);
    apartmentData._id = new ObjectID();
    apartmentData._createdBy = req.user._id;
    apartmentData._notificationSubscribers = [req.user._id];
    apartmentData.createdAt = Date.now();
    apartmentData.location = location;
    apartmentData.images = await imageService.uploadImages('APARTMENT_IMAGES', apartmentData._id, apartmentData.images);

    const apartment = await new Apartment(apartmentData).save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        _publishedApartments: apartment._id
      }
    }).catch(err => {
      Apartment.findByIdAndRemove(apartment._id);
      throw err;
    });

    return res.send({
      apartment
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});

/**
 * Update apartment ad. The patching user has to be authenticated and the owner of the ad.
 *
 *
 * @param {String} title
 * @param {Number} price
 * @param {String} entrance date
 * @param {[String]} images
 * @param {String} description
 * @param {[Number]} tags
 * @param {Number} requiredRoommates
 * @param {Number} totalRoommates
 * @param {[Number]} numberOfRooms
 * @param {Number} floor
 * @param {Number} totalFloors
 * @param {[Number]} area
 */
app.patch('/apartments/:id', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;

    if (!req.user.isOwner(id)) {
      return res.status(UNAUTHORIZED).send();
    }

    const apartmentData = _.pick(req.body, [
      'title',
      'price',
      'entranceDate',
      'images',
      'description',
      'tags',
      'requiredRoommates',
      'totalRoommates',
      'numberOfRooms',
      'floor',
      'totalFloors',
      'area'
    ]);

    const apartment = await Apartment.findByIdAndUpdate(
      id, {
        $set: apartmentData
      }, {
        new: true,
        runValidators: true
      }
    );

    notifyUsers(
      NotificationsTypesEnum.APARTMENT_WAS_MODIFIED,
      req.user._id,
      apartment._notificationSubscribers, [id],
      false,
      new Date().getTime()
    );

    res.send({
      apartment
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});

/**
 * Get all server supported apartment tags
 */
app.get('/apartments/tags', async (req, res) => {
  try {
    res.send({
      tags: getSupportedTags()
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Get apartment based on the given filters.
 *
 * @updatedBy: Alon Talmor
 * @date: 16/04/18
 * Changed expected query representation.
 * The new query properties are:
 * @param {String} id - apartment's id, should be a legal ObjectId
 * @param {String} createdBy - the creator of the apartment ad, should be a legal ObjectId
 * @param {String} entranceDate - a strings which can be converted into a date
 * @param {String} address - string of the full address expected
 * @param {Number} radius - number representing distance from address or geolocation
 * @param {Array of Number} price - should be an array of 2 numbers, which represents the price range
 * @param {Array of Number} roommates - should be an array of 2 numbers, which represents the [min, max] roommates required
 * @param {Array of Number} floor - should be an array of 2 numbers, which represents the [low, high] floors required
 * @param {Array of Number} tags - a list of all the tags represented by their ids
 * @param {Array of Number} geolocation - structure: [longitude, latitude]
 *
 * @returns the list of all the apartments that passed the above filter attributes.
 *
 * @updatedBy: Alon Talmor
 * @date: 24/05/18
 * Now the route uses image-service to fetch images from storage.
 */
app.get('/apartments', async (req, res) => {
  try {
    const query = _.pick(req.query, [
      'id', // String of a legal ObjectID
      'createdBy', // String of a legal ObjectID
      // 'minPrice',
      // 'maxPrice',
      'entranceDate', // A value which can be converted into Date
      // 'minEntranceDate',
      // 'latestEntranceDate',
      'address', // String of the full address
      'radius', // Number, which indicates the range from the address or geolocation
      // 'minRoommates',
      // 'maxRoommates',
      'price', // Array of 2 Numbers, which indicates the price range
      'roommates', // Array of 2 Numbers, which indicates the roommates range
      'floor', // Array of 2 Numbers, which indicates the floor range
      'tags', // Array of the tags Numbers (ids)
      'geolocation' // Array of 2 numbers: ['longitude','latitude']
      // 'longitude',
      // 'latitude'
    ]);
    const apartments = await Apartment.findByProperties(query);
    for (let i = 0; i < apartments.length; i += 1) {
      apartments[i].images = imageService.getImages('APARTMENT_IMAGES', apartments[i]._id, apartments[i].images);
    }

    res.send({
      apartments
    });
    // let tags;
    // if (body.tags && Array.isArray(body.tags)) {
    //   tags = body.tags.map(tagName => getSupportedTags().filter(t => t.name === tagName)[0]._id);
    // } Remove unsupported tags

    // const results = await Apartment.findByProperties({
    //   _id: body.id,
    //   _createdBy: body.createdBy,
    //   address: body.address,
    //   minPrice: body.minPrice,
    //   maxPrice: body.maxPrice,
    //   radius: body.radius,
    //   minRoommates: body.minRoommates,
    //   maxRoommates: body.maxRoommates,
    //   currentRoommatesNumber: body.currentRoommatesNumber,
    //   minFloor: body.minFloor,
    //   maxFloor: body.maxFloor,
    //   tags,
    //   latestEntranceDate: body.latestEntranceDate,
    //   latitude: body.latitude,
    //   longitude: body.longitude
    // });
    // res.send({ results });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Get apartment interested users sorted by matching to the logged-in user.
 *
 * @param {String} id
 */
app.get('/apartments/:id/interested', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    const _interested = await req.user.getBestMatchingUsers(
      apartment._interested
    );

    return res.send({
      _interested
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});


/**
 * @author: Omri Huller
 * @date: 05/10
 *
 * Get a group matching to the logged-in user.
 *
 * @param {String} id
 */
app.get('/apartments/:id/interested/groups/self/lazy', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const userId = req.user._id;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }
    const roommates = apartment.totalRoommates;

    const _interested = await req.user.getBestMatchingUsers(apartment._interested);
    let usersIncluded = false;

    // get the group
    const group = _interested.slice(0, roommates);
    for (let u of group) {
      if ((u._doc._id.id).equals(userId.id))
        usersIncluded = true;
    }
    if (!usersIncluded)
      group[roommates - 1] = userId;

    return res.send({
      group
    });

  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});


/**
 * Toggle the interested state of the logged-in user.
 *
 * @param {String} id
 */
app.put('/apartments/:id/interested', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    if (apartment.isUserInterested(req.user._id)) {
      await apartment.removeInterestedUser(req.user._id);
      await req.user.removeInterestInApartment(id);
    } else {
      await apartment.addInterestedUser(req.user._id);
      await req.user.addInterestInApartment(id);
      notifyUsers(
        NotificationsTypesEnum.USER_LIKED_APARTMENT,
        req.user._id,
        apartment._notificationSubscribers, [id],
        false,
        new Date().getTime()
      );
    }

    return res.status(OK).send({
      apartment
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * @author: Omri Huller
 * @date: 05/10
 *
 * Get a group matching to the logged-in user.
 *
 * @param {String} id
 */
app.get('/apartments/:id/interested/groups/self/lazy', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const userId = req.user._id;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }
    const roommates = apartment.totalRoommates;

    const _interested = await req.user.getBestMatchingUsers(apartment._interested);
    let usersIncluded = false;

    // get the group
    const group = _interested.slice(0, roommates);
    //const group = [ _interested[1], _interested[1], _interested[1]];
    //if((group.filter(user => (user._id() === userId))).length === 0)
    for (let u of group) {
      if ((u._doc._id.id).equals(userId.id))
        usersIncluded = true;
    }
    if (!usersIncluded)
      group[roommates - 1] = userId;

    return res.send({
      group
    });

  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});


/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Toggle the subscription state of the logged-in user for the given apartment.
 *
 * @param {ObjectID} apartment id that the user would like to toggle his subscription state.
 *
 * @returns {JSON} containing the updated apartment document.
 */
app.put('/apartments/:id/subscription', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    if (apartment.isUserSubscriber(req.user._id)) {
      await apartment.deleteSubscriber(req.user._id);
    } else {
      await apartment.saveSubscriber(req.user._id);
    }

    return res.status(OK).send({
      apartment
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});
/**
 * Adds a comment to a specific apartment.  The posting user has to be authenticated.
 *
 * @param {String} id
 * @param {String} text
 */
app.put('/apartments/:id/comment', authenticate, async (req, res) => {
  try {
    const body = _.pick(req.body, ['text']);
    const {
      id
    } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    await apartment.addComment(req.user._id, body.text, Date.now());

    notifyUsers(
      NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
      req.user._id,
      apartment._notificationSubscribers, [id],
      false,
      new Date().getTime()
    );

    const {
      comments
    } = apartment;

    return res.send({
      comments
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Deletes a specific apartment.  The posting user has to be the owner.
 *
 * @param {String} id
 */
app.delete('/apartments/:id', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;

    if (!req.user.isOwner(id)) {
      return res.status(UNAUTHORIZED).send();
    }

    await req.user.removeApartment(id);
    await Apartment.findByIdAndRemove(id);

    return res.status(OK).send();
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Adds a new user (registration)
 *
 * @param {String} email
 * @param {String} password
 * @param {String} firstName
 * @param {String} lastName
 * @param {Number} birthDate
 * @param {String} gender
 */
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, [
      'email',
      'password',
      'firstName',
      'lastName',
      'birthdate',
      'gender'
    ]);

    const user = new User(body);
    await user.register();
    /**
     * @updatedBy: Alon Talmor
     * @date: 13/04/18
     * Do not send verification mail!
     * If you want the verification mail to be sent, use the route:
     * POST /users/verify
     */
    //userVerificator.sendVerificationEmail(user);

    /**
     * @updatedBy: Alon Talmor
     * @date: 16/4/18
     * generate an authentication token to start a session between the 2 ends.
     */
    const token = user.generateAuthenticationToken();
    res.header(XAUTH, token).send({
      user
    });

    /**
     * @updatedBy: Alon Talmor
     * @date: 18/04/18
     * Expiration time is now a part of the authentication code instead of a separate property.

    res.header(XEXPIRATION, ticket.expiration);
    res.send({ user });
    */
  } catch (err) {
    res.status(BAD_REQUEST).send(err.message);
  }
});

/**
 * Login
 *
 * @param {String} email
 * @param {String} password
 */
app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);

    const user = await User.findByCredentials(body.email, body.password);
    /**
     * @updatedBy: Alon Talmor
     * @date: 16/04/18
     * We should generate a token even if the user is yet to be verified (verification is by mail).

     if (!user.isVerified) {
       return res.send({ user });
      }
      */
    user.removeExpiredTokens();
    const token = await user.generateAuthenticationToken();
    [user.image] = imageService.getImages('USER_IMAGES', user._id, [user.image]);
    res.header(XAUTH, token).send({
      user
    });

    /**
     * @updatedBy: Alon Talmor
     * @date: 18/04/18
     * Expiration time is now a part of the authentication code instead of a separate property.

     res.header(XEXPIRATION, ticket.expiration);
    */
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Get self user details. The user has to be the logged-in.
 *
 */
app.get('/users/self', authenticate, (req, res) => {
  [req.user.image] = imageService.getImages('USER_IMAGES', req.user._id, [req.user.image]);
  res.send({
    self: req.user
  });
});

/**
 * Get all server supported user tags
 *
 */
app.get('/users/tags', async (req, res) => {
  try {
    res.send({
      tags: getSupportedHobbies()
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 *
 * @updatedBy: Or Abramovich
 * @date: 04/18
 * Get user details for the given id - the roue supports a single id parameter or multiple values.
 * @returns {JSON} a JSON map that its properties are the ids and the value for each one is the
 * relevant user document.
 *
 * @updatedBy: Alon Talmor
 * @date: 28/04/18
 * Changed the id list to be query instead of params.
 * Moved the "if" statement to check length before converting the array to map.
 */
app.get('/users', async (req, res) => {
  try {
    const ids = _.castArray(req.query.id);
    let users = await User.find({
      _id: {
        $in: ids
      }
    });

    /**
     * @updatedBy: Alon Talmor
     * @date: 01/05/18
     * don't return an error in case some ids are missing
     * (since users might have been deleted or other causes...).
     */
    // if (users.length !== ids.length) { // if some ids were not found
    //   return res.status(BAD_REQUEST).send();
    // }

    for (let i = 0; i < users.length; i += 1) {
      [users[i].image] = imageService.getImages('USER_IMAGES', users[i]._id, [users[i].image]);
    }

    users = convertArrayToJsonMap(users, '_id');

    return res.send({
      users
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Get all the apartments the user is interested in. The user has to be the logged-in.
 *
 * @param {String} id
 */
app.get('/users/:id/interested', async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).send();
    }
    const interested = await Apartment.findAllByIds(user._interestedApartments);
    return res.send({
      interested
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Get all the apartments the user published. The user has to be the logged-in.
 *
 * @param {String} id
 */
app.get('/users/:id/published', async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).send();
    }
    const published = await Apartment.findAllByIds(user._publishedApartments);
    return res.send({
      published
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Update self details.
 *
 */
app.patch('/users/self', authenticate, async (req, res) => {
  try {
    const body = _.pick(req.body, [
      'firstName',
      'lastName',
      'birthdate',
      'gender',
      'mobilePhone',
      'about',
      'image',
      'hobbies',
      // '_publishedApartments',
      '_interestedApartments'
    ]);

    if (body.image) {
      [body.image] = await imageService.uploadImages('USER_IMAGES', req.user._id, body.image);
    }
    const user = await User.findByIdAndUpdate(
      req.user._id, {
        $set: body
      }, {
        new: true,
        runValidators: true
      }
    );
    user.image = imageService.getImages('USER_IMAGES', user._id, [user.image]);
    res.send({
      user
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * @author: Alon Talmor
 * @date: 28/3/18
 *
 * This route is used to verify new user account.
 * User should recieve a verification code by mail.
 * After clicking the link, the browser should redirect the user to a page
 * which in its turn should sent a verification request using this route.
 * By the end of this procedure, an user account status should be "verified".
 */
app.patch('/users/verify/:token', async (req, res) => {
  try {
    const user = await userVerificator.verifyUser(req.params.token);
    res.send({
      user
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * @author: Alon Talmor
 * @date: 28/3/18
 *
 * This route is used to resend user verification link to his/her mailbox.
 * To authenticated the user, one should supply its email + password)
 * in the HTTP POST request body.
 * The route first finds the user in the database. if the user is not found
 * the method should fail and "UNAUTHORIZED" HTTP respond is sent back to the client.
 * If the user is already verfied, no mail should be send and a "BAD_REQUEST" respond is returned.
 * otherwise, a verfication email containing an appropriate link is sent.
 */
app.post('/users/verify', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    //if a user is already verified do not send an email (to prevent frauds)
    if (user.isVerified) {
      return res.status(BAD_REQUEST).send();
    }
    userVerificator.sendVerificationEmail(user); //TODO: add a timeout between multiple "send email" requests!
    res.send('email was sent');
  } catch (err) {
    res.status(UNAUTHORIZED).send(err);
  }
});

/**
 * @author: Alon Talmor
 * @data: 2/4/18
 *
 * This route is used to send an email upon reset password request.
 * To perform the action we use the Password-Reset service.
 * Authentication is not required, but the designated user email
 * should be supplied via the request body.
 */
app.post('/users/reset', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    passwordReset.sendResetPasswordMail(user);
    res.send('forgot email was sent');
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * @author: Alon Talmor
 * @date: 2/4/18
 *
 * Handles the GET request which is sent to the server when a user
 * clicks on the Password-Reset URL attach to the mail sent by
 * "POST /users/reset" route.
 * This route is important because of it supplies verification. The server
 * will not display the change password page unless the "token" is valid.
 * Authentication is required.
 *
 * @updatedBy: Alon Talmor
 * @date: 19/04/18
 * !! DEPRECATED !! Please do not use.
 * The method of reset password was changed, authentication is no more required!
 */
app.get('/users/reset/:token', (req, res) => {
  try {
    passwordReset.verifyResetToken(req.user, req.params.token);
    res.send('Reset verification successful');
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * @author: Alon Talmor
 * @date: 2/4/18
 *
 * After the user chooses his/her new password, it sends it to the server in the request's body.
 * In addition, he/she must add email address - this is required for fetching the account details from the db.
 * It is assumed that the password is sent under the property "password".
 * First the token is verified, so we know that no malicious user is trying to change the
 * password without acctually recieving a token!
 * Next, the user's password is reset and is changed to the new password. It is assumed that
 * the resetPassword method performs checks on the password (on error an exception might be thrown).
 * If everything went well, updated user object is returned.
 * The user should not be authenticated afterwards (he/she is required to login in again).
 *
 * @updatedBy: Alon Talmor
 * @date: 19/04/18
 * Property email is also assumed to be sent in the request body.
 */
app.patch('/users/reset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    passwordReset.verifyResetToken(user, req.params.token);
    await user.resetPassword(req.body.password);
    [user.image] = imageService.getImages('USER_IMAGES', user._id, [user.image]);

    //TODO: disable using this same link after password change.
    res.send({
      user
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Update fields of the registered user notification.
 * Currently suppports only wasRead flag (a flag indicates whether the notified person read the notification).
 *
 * @param {ObjectID} notification id that has to be cahnged.
 *
 * @returns {JSON} containing the updated user document.
 *
 * @updatedBy: Or Abramovich
 * @date: 05/18
 * Changed the id list to be query instead of params.
 */

app.patch('/users/notifications', authenticate, async (req, res) => {
  try {
    const ids = _.castArray(req.query.id);
    const notificationData = _.pick(req.body, ['wasRead']);

    const objectIds = [];
    const newNotificationsData = [];

    ids.forEach((id) => {
      const curNotification = JSON.parse(
        JSON.stringify(req.user.getNotificationById(id))
      );
      const newNotification = updateNotificationByJson(
        curNotification,
        notificationData
      );

      objectIds.push(new ObjectID(id));
      newNotificationsData.push(newNotification);
    });


    const user = await req.user.saveUpdatedNotifications(objectIds, newNotificationsData);

    res.send({
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});

/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * Deletes the conversation data in the logged-in user document.
 *
 * @param {array of ObjectID} the participants of the conversation to be deleted.
 *
 * @returns {JSON} containing the updated user document.
 */
app.delete('/users/conversation', authenticate, async (req, res) => {
  try {
    const _participants = _.castArray(req.query.id);

    for (var i = 0; i < _participants.length; i++) {
      _participants[i] = new ObjectID(_participants[i]);
    }

    const user = await req.user.removeConversation(_participants);
    res.send({
      user
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});
/**
 * Add a new review. The posting user has to be authenticated.
 *
 * @param {String} Pros
 * @param {String} Cons
 * @param {[Number]} ratedCharacteristics
 * @param {String} street
 * @param {String} city
 * @param {String} state
 */

app.post('/reviews', authenticate, async (req, res) => {
  try {
    const reviewData = _.pick(req.body, [
      'street',
      'city',
      'state',
      'ratedCharacteristics',
      'Pros',
      'Cons'
    ]);
    reviewData.geolocation = await geoLocation.getGeoLocationCoords(
      `${reviewData.street} ${reviewData.city} ${reviewData.state}`
    );
    reviewData._createdBy = req.user._id;
    reviewData.createdAt = Date.now();

    const reviewsInRange = await Review.findInRange(
      reviewData.geolocation[0],
      reviewData.geolocation[1],
      1
    );
    if (reviewsInRange.some(review => review._createdBy.equals(reviewData._createdBy))) {
      return res.status(BAD_REQUEST).send(errors.multiRating);
    }

    const review = await new Review(reviewData).save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        _givenReviews: review._id
      }
    }).catch(err => {
      Review.findByIdAndRemove(review._id);
      throw err;
    });
    return res.send({
      review
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});

/**
 * Get calculated aggregated review of vacinity of given coordinadets.
 */
app.get('/reviews/aggregated/:long/:lat', async (req, res) => {
  try {
    const r = {
      ratedCharacteristics: {
        parking: 0,
        publicTransport: 0,
        noise: 0,
        commercialServices: 0,
        upkeep: 0,
        generalRating: 0
      },
      Pros: [],
      Cons: [],
      numberOfRaters: 0
    };

    //clean up protocol is here:
    //check all reviews in the vacinty before calculation
    //this has to happen before the calculation so we use the "await"
    await Review.findInRange(req.params.long, req.params.lat, 1).then(async result => {
      for (let index = 0; index < result.length; index++) {
        var element = result[index];
        element.updateRelevency();
        var years = Math.round((Date.now() - element.activatedAt) / (1000 * 60 * 60 * 24 * 365));
        if (years >= 2) {
          Review.findByIdAndRemove(element._id);
        }
      }
    });
    let num = 0; //actual number of reviews
    let count = 0; //relevent review is worth 1 and old review is worth only half
    let p = 0; //how much is the current review worth
    Review.findInRange(req.params.long, req.params.lat, 1).then(result => {
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        if (element.relevent) {
          p = 1;
        } else {
          p = 0.5;
        }
        count += p;
        num++;
        r.ratedCharacteristics.parking += (element.ratedCharacteristics.parking * p);
        r.ratedCharacteristics.publicTransport +=
          (element.ratedCharacteristics.publicTransport * p);
        r.ratedCharacteristics.noise += (element.ratedCharacteristics.noise * p);
        r.ratedCharacteristics.commercialServices +=
          (element.ratedCharacteristics.commercialServices * p);
        r.ratedCharacteristics.upkeep += (element.ratedCharacteristics.upkeep * p);
        r.ratedCharacteristics.generalRating +=
          (element.ratedCharacteristics.generalRating * p);
        r.Pros.push(element.Pros);
        r.Cons.push(element.Cons);
      }
      if (count == 0) {
        return res.send({
          r
        });
      }
      //basicly calculating a sort of avarge where 2/3 of the power goes to relevent reviews
      // and a third goes to the old reviews
      r.ratedCharacteristics.parking /= count;
      r.ratedCharacteristics.publicTransport /= count;
      r.ratedCharacteristics.noise /= count;
      r.ratedCharacteristics.commercialServices /= count;
      r.ratedCharacteristics.upkeep /= count;
      r.ratedCharacteristics.generalRating /= count;
      r.numberOfRaters = num;
      return res.send({
        r
      });
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});
/**
 *
 * @author: Or Abramovich
 * @date: 06/18
 *
 * Gets all reviews near the given coordinates
 *
 * Parameters of the route:
 *
 * @param {Number} long: the longitude param of the coordinate.
 * @param {Number} lat: the latitude param of the coordinate.
 *
 */
app.get('/reviews/:long/:lat', async (req, res) => {
  try {
    var reviews = [];
    Review.findInRange(req.params.long, req.params.lat, 1).then(result => {
      for (let index = 0; index < result.length; index++) {
        reviews.push(result[index]);
      }
      return res.send({reviews});
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});
/**
 * Update review. The patching user has to be authenticated and the giver of the review.
 *
 *
 * @param {String} Pros
 * @param {String} Cons
 * @param {[Number]} ratedCharacteristics
 * @param {String} street
 * @param {String} city
 * @param {String} state
 */

app.patch('/reviews/:id', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    if (!req.user.isReviewOwner(id)) {
      return res.status(UNAUTHORIZED).send();
    }
    const reviewData = _.pick(req.body, [
      'ratedCharacteristics',
      'Pros',
      'Cons'
    ]);
    reviewData.relevent = true;
    reviewData.activatedAt = Date.now();
    const review = await Review.findByIdAndUpdate(
      id, {
        $set: reviewData
      }, {
        new: true,
        runValidators: true
      }
    );

    res.send({
      review
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});

/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns the entire list of supported visit statuses
 *
 */
app.get('/apartments/visit/statuses', async (req, res) => {
  try {
    res.send({
      statuses: getVisitStatusCodes()
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns the entire list of supported visit status changes based on the business logic.
 * i.e. the returened JSON describes the possible "movements" of the visit status.
 *
 */
app.get('/apartments/visit/actions', async (req, res) => {
  try {
    res.send({
      statuses: getVisitStatusChangeActions()
    });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Modifies an existing visit with the given ID in the given apartment.
 * The user who request the modification must be authenticated.
 *
 * Parameters of the route:
 *
 * @param {Number} schedTo: the requested time for the visit.
 * @param {Number} status: the new status of the visit.
 *
 */
app.patch('/apartments/:id/visit/:visitId', authenticate, async (req, res) => {
  try {
    const body = _.pick(req.body, ['schedTo', 'status']);
    const {
      id,
      visitId
    } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    const visitData = apartment.getVisitDataById(visitId);

    if (!canModifyVisit(apartment._createdBy, visitData._askedBy, req.user._id)) {
      return res.status(UNAUTHORIZED).send();
    }

    await apartment.updateVisit(
      visitId,
      req.user._id,
      body.status,
      body.schedTo
    );

    return res.send({
      apartment
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Adds a new visit to the given apartment.
 * The user who request it must be authenticated.
 *
 * Parameters of the route:
 *
 * @param {Number} schedTo: the requested time for the visit.
 *
 */
app.put('/apartments/:id/visit/', authenticate, async (req, res) => {
  try {
    const body = _.pick(req.body, ['schedTo']);
    const {
      id
    } = req.params;
    const visitId = body.visitId;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    if (!canAddVisit(apartment.isOwner(req.user._id))) {
      return res.status(UNAUTHORIZED).send();
    }

    await apartment.addNewVisit(req.user._id, body.schedTo);

    return res.send({
      apartment
    });
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Deletes a specific review.  The removing user has to be the giver of the review.
 *
 * @param {String} id
 */
app.delete('/reviews/:id', authenticate, async (req, res) => {
  try {
    const {
      id
    } = req.params;

    if (!req.user.isReviewOwner(id)) {
      return res.status(UNAUTHORIZED).send();
    }

    await req.user.removeReview(id);
    await Review.findByIdAndRemove(id);

    return res.status(OK).send();
  } catch (err) {
    return res.status(BAD_REQUEST).send(err);
  }
});

/**
 * @author: Alon Talmor
 * @date: 30/5/18
 *
 * Get apartment's suggested groups by apartment-id
 */
app.get('/apartments/:id/groups', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    const { groups } = apartment;
    res.send({ groups });
  } catch (error) {
    res.status(BAD_REQUEST).send(errors.apartmentNotFound);
  }
});

/**
 * @author: Alon Talmor
 * @date: 6/5/18
 *
 * Create a new group.
 * The request should include:
 * - String id (which should be a valid ObjectId).
 * or
 * - list of String ids (which should be valid ObjectId's)
 * The route will return the updated apartment (with the added group).
 * The route might fail if creating the new group failed.
 */
app.post('/apartments/:id/groups', authenticate, async (req, res) => {
  try {
    const body = _.pick(req.body, ['id']);

    // check that we receive only valid ids
    const isValidId = await User.isValidId(body.id);
    if (!isValidId) {
      return res.status(BAD_REQUEST).send(errors.userNotFound);
    }
    // now we know that all ids are valid so we can try to add this group
    let apartment = await Apartment.findById(req.params.id);
    apartment = await apartment.createGroup(body.id);
    return res.send({ apartment });
  } catch (error) {
    return res.status(BAD_REQUEST).send(error);
  }
});
/**
 * @author: Alon Talmor
 * @date: 28/3/18
 *
 * This is considered as the "default route".
 * Note that this route MUST be the latest route defined
 * in order for it to catch ONLY undefined routes!
 * Nothing special here, it only returns an 404 HTTP respond.
 *
 * TODO: Add a test that routes to an undefined route (such as "/undefined/:-)").
 * Expect to receive 404 respond.
 */
app.get('*', (req, res) => {
  res.status(NOT_FOUND).send('404');
});

app.listen(process.env.PORT, () => {
  logInfo(`Server is up on port ${process.env.PORT}.`);
});

module.exports = {
  app
};
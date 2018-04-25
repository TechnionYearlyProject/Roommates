const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {
  BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, OK
} = require('http-status');
require('./server-config');
require('./db/mongoose');
const { useVue } = require('./middleware/vuejs');
const { useCors } = require('./middleware/cors');
const geoLocation = require('./services/geoLocation/geoLocation');
const { Apartment } = require('./models/apartment');
const { User } = require('./models/user');
const { XAUTH, XEXPIRATION } = require('./constants');
const { authenticate } = require('./middleware/authenticate');
const { getSupportedHobbies } = require('./models/hobbie');
const { getSupportedTags } = require('./models/tag');
const { NotificationsTypesEnum, updateNotificationByJson } = require('./models/notification');
const { logInfo } = require('./services/logger/logger');
const { ObjectID } = require('mongodb');
const httpLogger = require('./services/logger/http-logger');
const { notifyUsers } = require('./services/notifications-system/notifier');
const userVerificator = require('./services/user-verification/user-verificator');
const passwordReset = require('./services/password-reset/password-reset');
const errors = require('./errors');


const app = express();

app.use(httpLogger.logResponseBodyOnError);
app.use(bodyParser.json({ limit: '5mb' }));
useCors(app);
useVue(app);


/**
 * Add a new apartemnt. The posting user has to be authenticated.
 * the specified center point and radius.
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
    const address = _.pick(req.body.address, ['state', 'city', 'street', 'number']);
    const location = {
      address,
      geolocation: await geoLocation.getGeoLocationCoords(`${address.street} ${address.number} ${address.city} ${address.state}`)
    };
    if (!location.geolocation) {
      return res.status(BAD_REQUEST).send(errors.invalidLocation);
    }

    const apartmentData = _.pick(req.body,
      [
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
	  console.log(apartmentData);
    apartmentData._createdBy = req.user._id;
    apartmentData._notificationSubscribers = [req.user._id];
    apartmentData.createdAt = Date.now();
    apartmentData.location = location;

    const apartment = await new Apartment(apartmentData).save();
    await User.findByIdAndUpdate(req.user._id, { $push: { _publishedApartments: apartment._id } })
      .catch((err) => {
        Apartment.findByIdAndRemove(apartment._id);
        throw err;
      });
    return res.send({ apartment });
  } catch (err) {
	  console.log(err);
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
    const { id } = req.params;

    if (!(req.user.isOwner(id))) {
      return res.status(UNAUTHORIZED).send();
    }

    const apartmentData = _.pick(req.body,
      [
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

    const apartment = await Apartment.findByIdAndUpdate(id, { $set: apartmentData }, { new: true, runValidators: true });

    notifyUsers(NotificationsTypesEnum.APARTMENT_WAS_MODIFIED, req.user._id, apartment._notificationSubscribers, [id]);

    res.send({ apartment });
  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
  }
});

/**
 * Get all server supported apartment tags
 */
app.get('/apartments/tags', async (req, res) => {
  try {
    res.send({ tags: getSupportedTags() });
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
 */
app.get('/apartments', async (req, res) => {
  try {
    const query = _.pick(req.query,
      [
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
    res.send({ apartments });
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
    const { id } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    const _interested = await req.user.getBestMatchingUsers(apartment._interested);

    return res.send({ _interested });
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
    const { id } = req.params;

    const apartment = await Apartment.findById(id);
    console.log(apartment);
    console.log(req.user);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    if (apartment.isUserInterested(req.user._id)) {
      await apartment.removeInterestedUser(req.user._id);
      await req.user.removeInterestInApartment(id);
    } else {
      await apartment.addInterestedUser(req.user._id);
      await req.user.addInterestInApartment(id);
      notifyUsers(NotificationsTypesEnum.USER_LIKED_APARTMENT, req.user._id, apartment._notificationSubscribers, [id]);
    }

    return res.status(OK).send({ apartment });
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
    const { id } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    if (apartment.isUserSubscriber(req.user._id)) {
      await apartment.deleteSubscriber(req.user._id);
    } else {
      await apartment.saveSubscriber(req.user._id);
    }

    return res.status(OK).send({ apartment });
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
    const { id } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    await apartment.addComment(req.user._id, body.text, Date.now());

    notifyUsers(NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT, req.user._id, apartment._notificationSubscribers, [id]);

    const { comments } = apartment;

    return res.send({ comments });
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
    const { id } = req.params;

    if (!(req.user.isOwner(id))) {
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
    const body = _.pick(req.body,
      [
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
    res.header(XAUTH, token).send({ user });

    /**
     * @updatedBy: Alon Talmor
     * @date: 18/04/18
     * Expiration time is now a part of the authentication code instead of a separate property.
      
    res.header(XEXPIRATION, ticket.expiration);
    res.send({ user });
    */
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
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
    res.header(XAUTH, token).send({ user });

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
  res.send({ self: req.user });
});

/**
 * Get all server supported user tags
 *
 */
app.get('/users/tags', async (req, res) => {
  try {
    res.send({ tags: getSupportedHobbies() });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
  }
});

/**
 * Get user details for the given id
 *
 * @param {String} id
 */
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).send();
    }
    return res.send({ user });
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
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).send();
    }
    const interested = await Apartment.findAllByIds(user._interestedApartments);
    return res.send({ interested });
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
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).send();
    }
    const published = await Apartment.findAllByIds(user._publishedApartments);
    return res.send({ published });
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
    const body = _.pick(req.body,
      [
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

    const user = await User.findByIdAndUpdate(req.user._id, { $set: body }, { new: true, runValidators: true });
    res.send({ user });
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
    res.send({ user });
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
    const user = await User.findOne({ email: req.body.email });
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
	console.log(req.body);
	const user = await User.findOne({ email: req.body.email });
	console.log(user);
    passwordReset.verifyResetToken(user, req.params.token);
	console.log("3");
    await user.resetPassword(req.body.password);
		console.log("5");

    //TODO: disable using this same link after password change.
    res.send({ user });
  } catch (err) {
	  console.log(err);
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
 */

app.patch('/users/notifications/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const notificationData = _.pick(req.body,
      [
        'wasRead'
      ]);

    const curNotification = JSON.parse(JSON.stringify(req.user.getNotificationById(id)));
    const newNotification = updateNotificationByJson(curNotification, notificationData);

    const user = await req.user.saveUpdatedNotification(id, newNotification);

    res.send({ user });

  } catch (err) {
    return res.status(BAD_REQUEST).send(errors.unknownError);
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
 * Expect to recieve 404 respond.
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
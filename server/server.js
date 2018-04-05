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
const { logInfo } = require('./services/logger/logger');
const httpLogger = require('./services/logger/http-logger');
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
 * @param {Number} requiredNumberOfRoommates
 * @param {Number} currentlyNumberOfRoommates
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
        'title',
        'price',
        'address',
        'enteranceDate',
        'images',
        'description',
        'tags',
        'requiredNumberOfRoommates',
        'currentlyNumberOfRoommates',
        'numberOfRooms',
        'floor',
        'totalFloors',
        'area'
      ]);
    apartmentData._createdBy = req.user._id;
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
 * @param {Number} requiredNumberOfRoommates
 * @param {Number} currentlyNumberOfRoommates
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
	        'enteranceDate',
	        'images',
	        'description',
	        'tags',
	        'requiredNumberOfRoommates',
	        'currentlyNumberOfRoommates',
	        'numberOfRooms',
	        'floor',
	        'totalFloors',
	        'area'
	      ]);

	    const apartment = await Apartment.findByIdAndUpdate(id, { $set: apartmentData }, { new: true, runValidators: true });
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
 * @param {String} id
 * @param {Number} createdBy
 * @param {Number} minPrice
 * @param {Number} maxPrice
 * @param {Number} minEntranceDate
 * @param {Number} latestEntranceDate
 * @param {String} address
 * @param {Number} radius
 * @param {Number} minRoommates
 * @param {Number} maxRoommates
 * @param {Number} currentRoommatesNumber
 * @param {Number} minFloor
 * @param {Number} maxFloor
 * @param {[Number]} tags
 * @param {Number} latitude
 * @param {Number} longitude
 */
app.get('/apartments', async (req, res) => {
  try {
    const body = _.pick(req.query,
      [
        'id',
        'createdBy',
        'minPrice',
        'maxPrice',
        'minEntranceDate',
        'latestEntranceDate',
        'address',
        'radius',
        'minRoommates',
        'maxRoommates',
        'currentRoommatesNumber',
        'minFloor',
        'maxFloor',
        'tags',
        'latitude',
        'longitude'
      ]);

    let tags;
    if (body.tags && Array.isArray(body.tags)) {
      tags = body.tags.map(tagName => getSupportedTags().filter(t => t.name === tagName)[0]._id);
    }

    const results = await Apartment.findByProperties({
      _id: body.id,
      _createdBy: body.createdBy,
      address: body.address,
      minPrice: body.minPrice,
      maxPrice: body.maxPrice,
      radius: body.radius,
      minRoommates: body.minRoommates,
      maxRoommates: body.maxRoommates,
      currentRoommatesNumber: body.currentRoommatesNumber,
      minFloor: body.minFloor,
      maxFloor: body.maxFloor,
      tags,
      latestEntranceDate: body.latestEntranceDate,
      latitude: body.latitude,
      longitude: body.longitude
    });
    res.send({ results });
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
    if (!apartment) {
      return res.status(NOT_FOUND).send();
    }

    if (apartment.isUserInterested(req.user._id)) {
      await apartment.removeInterestedUser(req.user._id);
      await req.user.removeInterestInApartment(id);
    } else {
      await apartment.addInterestedUser(req.user._id);
      await req.user.addInterestInApartment(id);
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
    userVerificator.sendVerificationEmail(user);

    /**
     * @updatedBy: Alon Talmor
     * @date: 28/3/18
     * Do not generate an authentication token because the user must verify himself/herself
     * first by using the link that has been sent to his/her mailbox.
     * This means that the registration will NOT allow immediate login afterwards.
     */
    res.send({ user });

    // res.header(XAUTH, ticket.token);
    // res.header(XEXPIRATION, ticket.expiration).send({ user });
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
     * @date: 28/3/18
     * We should not generate a token if the user is yet to be verified (verification is by mail).
     */
    if (!user.isVerified) {
      return res.send({ user });
    }
    user.removeExpiredTokens();
    const ticket = await user.generateAuthenticationToken();
    res.header(XAUTH, ticket.token);
    res.header(XEXPIRATION, ticket.expiration).send({ user });
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
        '_publishedApartments',
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
    await userVerificator.verifyUser(req.params.token);
    res.send('verification successful');
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
 * Authentication is first required for security enhancement.
 */
app.post('/users/forgot-password', authenticate, (req, res) => {
  try {
    passwordReset.sendResetPasswordMail(req.user);
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
 * "/users/forgot-password" route.
 * This route is important because of it supplies verification. The server
 * will not display the change password page unless the "token" is valid.
 * Authentication is required.
 */
app.get('/users/reset-password/:token', authenticate, (req, res) => {
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
 * After the user chooses his/her new password, it send to the server in the request's body.
 * It is assumed that the password is sent under the property "password".
 * First the token is revarified, so we know that no malicious user is trying to change the
 * password without acctually recieving a token!
 * Next, the user's password is reset and is changed to the new password. It is assumed that
 * the resetPassword method performs checks on the password (on error an exception might be thrown).
 * If everything went well, updated user object is returned.
 * The user should not be authenticated afterwards (he/she is required to login in again).
 */
app.patch('/users/reset-password/:token', authenticate, async (req,res) => {
  try {
    passwordReset.verifyResetToken(req.user, req.params.token);
    const user = await req.user.resetPassword(req.body.password);
    //TODO: disable using this same link after password change.
    res.send({ user });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
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
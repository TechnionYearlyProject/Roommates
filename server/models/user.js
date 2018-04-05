const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { isSupportedHobbieId } = require('./hobbie');
const { getMatchScore } = require('../logic/matcher');
const arrayFunctions = require('../helpers/arrayFunctions');
const { XAUTH } = require('../constants');
const ticket = require('./ticket');
const { invalidCradentials, emailInUse, PasswordResetFailure } = require('../errors');


const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  birthdate: {
    type: Number,
    min: new Date('1900-01-01').getTime(),
    validate: {
      validator: (value) => value <= Date.now() - (15 * 365 * 24 * 60 * 60 * 1000),
      message: 'birthdate: {VALUE} is more than maximum allowed value'
    },
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    lowercase: true,
    required: true
  },
  mobilePhone: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => validator.isMobilePhone(value, 'he-IL') || value === '',
      message: '{VALUE} is not a valid mobile phone number'
    },
    default: ''
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => validator.isURL(value) || value === '',
      message: '{VALUE} is not a valid URL'
    },
    default: '' //TODO:put url to some anonymous image
  },
  about: {
    type: String,
    default: ''
  },
  hobbies: [{
    type: Number,
    validate: {
      validator: (value) => isSupportedHobbieId(value),
      message: '{VALUE} is not a supported hobbie'
    }
  }],
  _publishedApartments: [{
    type: String
  }],
  _interestedApartments: [{
    type: String
  }],
  email: {
    type: String,
    minlength: 5,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} is not a valid email'
    },
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    expiration: {
      type: Number,
      required: true
    }
  }]
});

/**
 * a middleware function for user.
 * this function is doing some operations before the save function is called
 * on user.
 * before saving a user the function:
 * encrypts the user password, if it was modified.
 */
UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (errr, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * find a user with the specified credentials.
 *
 * @param {String} email
 * @param {String} password
 * @returns Promise object.
 */
UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(invalidCradentials);
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject(invalidCradentials);
        }
      });
    });
  });
};

/**
 * find a user with the specified auth token string.
 *
 * @param {String} token
 * @returns Promise Object.
 */
UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': XAUTH
  });
};

/**
 * we don't want all of a user properties to be exposed.
 * dues we make sure that the toJSON operation returns only some of
 * its properties.
 *
 * @param {User Object} user
 * @returns Object with the public properties of the user
 */
UserSchema.statics.toJSON = function (user) {
  return _.pick(user,
    [
      '_id',
      'email',
      'isVerified',
      'firstName',
      'lastName',
      'birthdate',
      'gender',
      'mobilePhone',
      'image',
      'about',
      'hobbies',
      '_publishedApartments',
      '_interestedApartments'
    ]);
};

/**
 * express uses this function when sending an object over HTTP requests.
 *
 * we don't want all of a user properties to be exposed.
 * dues we make sure that the toJSON operation returns only some of
 * its properties.
 *
 * @returns Object with the public properties of the user
 */
UserSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  return User.toJSON(userObject);
};

/**
 *
 * @param {String} token
 * @returns the ticket with the specified token. if not ticket found return null.
 */
UserSchema.methods.getTicket = function (token) {
  const user = this;

  return user.tokens.find(t => t.token === token);
};

/**
 * remove expired tokens from the user's tokens list.
 *
 * @returns Promsie object with the user.
 */
UserSchema.methods.removeExpiredTokens = function () {
  const user = this;

  const tokens = user.tokens.filter(t => Date.now() < t.expiration);
  user.tokens = tokens;
  return user.save();
};

/**
 *
 * @param {String} token
 * @returns Promise object with the new expiration time.
 */
UserSchema.methods.updateTokenTime = function (token) {
  const user = this;

  const newExpiration = ticket.generateNewExpiration();
  user.getTicket(token).expiration = newExpiration;
  return user.save().then(() => newExpiration);
};

/**
 * generate a new auth token to the user.
 *
 * @returns Promise object with the ticket.
 */
UserSchema.methods.generateAuthenticationToken = function () {
  const user = this;

  const access = XAUTH;
  const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
  const t = ticket.create(access, token);
  user.tokens.push(t);

  return user.save()
    .then(() => t);
};

/**
 * register a new user.
 * the registration includes:
 * validation to the data provided
 * encryption of the password
 * saving the user to the db.
 *
 * the registration will fail if:
 * the data provided in not a legal user data (see schema for more details)
 * the email is already in use by other user
 * the encryption of the password has failed.
 *
 * The function returns the saved user (wrapped inside a Promise) on success.
 *
 * @returns Promise object.
 */
UserSchema.methods.register = function () {
  const user = this;

  return user.save()
    .catch(() => { throw emailInUse; });
};

/**
 * calculate the matching score of the two users.
 * the matching is based on common hobbies.
 * each hobbie has a predefined score.
 * every common hobbie adds up to the total matching score.
 *
 * @param {User Object} userToGetMatchingWith
 * @returns matching score of the users.
 */
UserSchema.methods.getMatchingResult = function (userToGetMatchingWith) {
  const user = this;

  return getMatchScore(user.hobbies, userToGetMatchingWith.hobbies);
};

/**
 * sort the users in the array by their matching score comparing to
 * the current user.
 * the matching score is the sum of the scores of the common hobbies.
 *
 * @param {Array} userIds
 * @returns sorted list in ascending order of the users.
 */
UserSchema.methods.getBestMatchingUsers = function (userIds) {
  const user = this;

  return User.find({
    _id: { $in: userIds }
  }).then((users) =>
    arrayFunctions.sortArrayASC(users, (curUser) => -1 * user.getMatchingResult(curUser))
  );
};

/**
 *
 * @param {any} apartmentId
 * @returns true if the user is the owner of the specified apartment, otherwise false.
 */
UserSchema.methods.isOwner = function (apartmentId) {
  const user = this;

  return arrayFunctions.getIndexOfValue(user._publishedApartments, apartmentId) > -1;
};

/**
 * remove an apartment from the user's published apartments.
 *
 * @param {String} apartmentId
 * @returns Promise object.
 */
UserSchema.methods.removeApartment = function (apartmentId) {
  const user = this;

  const indexOfVal = arrayFunctions.getIndexOfValue(user._publishedApartments, apartmentId);
  if (indexOfVal > -1) {
    user._publishedApartments.splice(indexOfVal, 1);
  }

  return user.save();
};

/**
 * add a new apartment to the interested apartments list of the user.
 *
 * @param {String} _apartmentID
 * @returns Promise object.
 */
UserSchema.methods.addInterestInApartment = function (_apartmentID) {
  const user = this;

  user._interestedApartments.push(_apartmentID);

  return user.save();
};

/**
 * check if the apartment is being interested by the user.
 *
 * @param {String} _apartmentID
 * @returns true if the user interested, otherwise false.
 */
UserSchema.methods.isInterestedInApartment = function (_apartmentID) {
  const user = this;

  const interestedIDIndex = arrayFunctions.getIndexOfValue(user._interestedApartments, _apartmentID);
  return (interestedIDIndex > -1);
};

/**
 * remove an apartment from the user's interested list.
 *
 * @param {String} _apartmentID
 * @returns Promise object.
 */
UserSchema.methods.removeInterestInApartment = function (_apartmentID) {
  const user = this;

  const interestedIDIndex = arrayFunctions.getIndexOfValue(user._interestedApartments, _apartmentID);
  if (interestedIDIndex > -1) {
    user._interestedApartments.splice(interestedIDIndex, 1);
  }

  return user.save();
};

/**
 * @author: Alon Talmor
 * @date: 2/4/18
 *
 * Changing password is not an everyday process. Here, we take extra care when
 * handling with sensitive information.
 * Starting with hashing the new to-be password and comparing it with the old password.
 * If the passwords (old and new) match it means that a user is trying to change his/her password
 * to a password he already has! This is a behaviour which I decided does not make sence.
 * It situation such as, a PasswordResetFailure error is thrown.
 * Otherwise, change the user password to the new one. In Addition, clear the tokens list. This means
 * that after reseting a password the user does not have any open auth relation with the server.
 * It is assumed that the "save" function encrypts the password before saving it in the database.
 * @returns Promise object which includes the user.
 */
UserSchema.methods.resetPassword = function (newPassword) {
  const user = this;
  return bcrypt.compare(newPassword, user.password)
    .then((passwordsEqual) => {
      if (passwordsEqual) {
        throw PasswordResetFailure;
      }
      user.password = newPassword;
      user.tokens = []; // Clear all previous generated tokens list (because password has changed)
      return user.save(); // It is important to use the "save" function here for password encryption
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
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
    max: Date.now() - (15 * 365 * 24 * 60 * 60 * 1000),
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

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

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

UserSchema.statics.toJSON = function (user) {
  return _.pick(user,
    [
      '_id',
      'email',
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

UserSchema.methods.getToken = function (token) {
  const user = this;

  return user.tokens.find(t => t.token === token);
};

UserSchema.methods.removeExpiredTokens = function () {
  const user = this;

  const tokens = user.tokens.filter(t => Date.now() < t.expiration);
  user.tokens = tokens;
  return user.save();
};

UserSchema.methods.updateTokenTime = function (token) {
  const user = this;

  const newExpiration = ticket.generateNewExpiration();
  user.getToken(token).expiration = newExpiration;
  return user.save().then(() => newExpiration);
};

UserSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  return User.toJSON(userObject);
};

UserSchema.methods.generateAuthenticationToken = function () {
  const user = this;

  const access = XAUTH;
  const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
  const t = ticket.create(access, token);
  user.tokens.push(t);

  return user.save()
    .then(() => t);
};

UserSchema.methods.register = function () {
  const user = this;

  return user.save()
    .then(() => user.generateAuthenticationToken());
};

UserSchema.methods.getMatchingResult = function (userToGetMatchingWith) {
  const user = this;

  return getMatchScore(user.hobbies, userToGetMatchingWith.hobbies);
};

UserSchema.methods.getBestMatchingUsers = function (userIds) {
  const user = this;

  return User.find({
    _id: { $in: userIds }
  }).then((users) =>
    arrayFunctions.sortArrayASC(users, (curUser) => -1 * user.getMatchingResult(curUser))
  );
};

UserSchema.methods.isOwner = function (apartmentId) {
  const user = this;

  return arrayFunctions.getIndexOfValue(user._publishedApartments, apartmentId) > -1;
};

UserSchema.methods.removeApartment = function (apartmentId) {
  const user = this;

  const indexOfVal = arrayFunctions.getIndexOfValue(user._publishedApartments, apartmentId);
  if (indexOfVal > -1) {
    user._publishedApartments.splice(indexOfVal, 1);
  }

  return user.save();
};

UserSchema.methods.addInterestInApartment = function (_apartmentID) {
  const user = this;

  user._interestedApartments.push(_apartmentID);

  return user.save();
};

UserSchema.methods.isInterestedInApartment = function (_apartmentID) {
  const user = this;

  const interestedIDIndex = arrayFunctions.getIndexOfValue(user._interestedApartments, _apartmentID);
  return (interestedIDIndex > -1);
};


UserSchema.methods.removeInterestInApartment = function (_apartmentID) {
  const user = this;

  const interestedIDIndex = arrayFunctions.getIndexOfValue(user._interestedApartments, _apartmentID);
  if (interestedIDIndex > -1) {
    user._interestedApartments.splice(interestedIDIndex, 1);
  }

  return user.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
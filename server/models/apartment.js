const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');

const { EARTH_RADIUS_IN_KM } = require('../constants');
const geoLocation = require('../services/geoLocation/geoLocation')
const { User } = require('./user');
const array_functions = require('../helpers/array_functions');

const apartmentSchema = new mongoose.Schema({
  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  _interested: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  enteranceDate: {
    type: Date,
    min: Date('2017-01-01'),
    required: true
  },
  location: {
    address: {
      state: {
        type: String,
        minlength: 2,
        maxlength: 30,
        lowercase: true,
        trim: true,
        required: true
      },
      city: {
        type: String,
        minlength: 2,
        maxlength: 30,
        lowercase: true,
        trim: true,
        required: true
      },
      street: {
        type: String,
        minlength: 2,
        maxlength: 30,
        lowercase: true,
        trim: true,
        required: true
      },
      number: {
        type: Number,
        min: 1,
        max: 10000,
        required: true
      },
      apartmentNumber: {
        type: Number,
        min: 1,
        max: 1000
      }
    },
    geolocation: {
      type: [Number],
      index: '2dsphere',
      default: [0, 0]
    }
  },
  numberOfRooms: {
    type: Number,
    min: 0,
    max: 20
  },
  floor: {
    type: Number,
    min: -2,
    max: 300
  },
  totalFloors: {
    type: Number,
    min: 0,
    max: 300
  },
  area: {
    type: Number,
    min: 0,
    max: 1000
  },
  images: [{
    type: String,
    default: ''
  }],
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    uppercase: true,
    // TODO: add enum list of all TAGS, maybe in a different file?
  }],
  requiredNumberOfRoommates: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  currentlyNumberOfRoomates: {
    type: Number,
    min: 0,
    max: 10
  },
  comments: [{
    _createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    createdAt: {
      type: Date,
      min: Date('2017-01-01'),
      required: true
    },
    text: {
      type: String,
      minlength: 10,
      maxlength: 1000,
      required: true
    }
  }]
});

getGeoWithinObj = (coords, radius) => {
  const kmToRadians = radius / EARTH_RADIUS_IN_KM;
  return {
    $geoWithin: {
      $centerSphere: [
        coords,
        kmToRadians
      ]
    }
  };
};

apartmentSchema.statics.findInRange = function (centerLong, centerLat, radius) {
  const Apartment = this;

  return Apartment.find({
    'location.geolocation': getGeoWithinObj([centerLong, centerLat], radius)
  });
};

//TODO: add the rest of properties
apartmentSchema.statics.findByProperties = async function (_id, _createdBy, fromPrice, toPrice, enterancedate, address, radius, currentlyNumberOfRoomates) {
  const Apartment = this;

  var price = undefined;
  if(fromPrice || toPrice) {
    price = _.pickBy({ $gte: fromPrice, $lte: toPrice }, _.identity);
  }

  var enteranceDate = undefined;
  if(enterancedate && validator.toDate(enterancedate)) {
    enteranceDate = { $lte: enterancedate };
  }
  var geolocation = undefined;
  if (address) {
    geolocation = await geoLocation.getGeoLocationCoords(address);
    if(!geolocation) {
      return new Promise((resolve, reject) => resolve([]));
    }
    geolocation = radius ? getGeoWithinObj(geolocation, radius) : geolocation;
  }

  const properties = _.pickBy({
    _id,
    _createdBy,
    price,
    enteranceDate,
    'location.geolocation': geolocation,
    currentlyNumberOfRoomates
  }, _.identity);
  return Apartment.find(properties);
};

apartmentSchema.methods.getAddressString = function () {
  const address = this.location.address;
  return address.number + " " + address.street + " " + address.city + " " + address.state;
};

apartmentSchema.methods.getInterestedUsersSortedByMatching = function (user) {
    const currentApartment = this;
    return User.find({
    '_id': { $in: currentApartment._interested}
    }).then( (users) => {
        return array_functions.sortArrayASC(users, function(currentUser) {
            return -1 * user.getMatchingResult(currentUser);
        });
    });
};

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = {
  Apartment
};
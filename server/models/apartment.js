const mongoose = require('mongoose');

const { EARTH_RADIUS_IN_KM } = require('../constants');
const geoLocation = require('../services/geoLocation/geoLocation');
const { removeFalsyProps } = require('../helpers/removeFalsyProps');
const { isSupportedTagId } = require('./tag');
const { getIndexOfValue } = require('../helpers/arrayFunctions');
const { ObjectID } = require('mongodb');

const ApartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 4,
    max: 35,
    required: true
  },
  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  _interested: [{
    type: String,
    ref: 'User'
  }],
  enteranceDate: {
    type: Number,
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
    min: 1,
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
    type: Number,
    validate: {
      validator: (value) => isSupportedTagId(value),
      message: '{VALUE} is not a supported tag'
    }
  }],
  requiredNumberOfRoommates: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  currentlyNumberOfRoommates: {
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
      type: Number,
      required: true
    },
    text: {
      type: String,
      minlength: 10,
      maxlength: 1000,
      required: true
    }
  }],
  _notificationSubscribers:{
      type: [mongoose.Schema.Types.ObjectId],
  },
});

/**
 * the coords array is an array of 2 values:
 * the first one is the longitude and the second is the latitude.
 * radius is the max distance from the coords in units of km.
 *
 * @param {Array} coords
 * @param {Number} radius
 * @returns a mongoose format object for finding apartment in radius
 */
const getGeoWithinObj = (coords, radius) => {
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

/**
 * find all the apartments in the geo-circle, which is defined by
 * the specified center point and radius.
 *
 * @param {Number} centerLong
 * @param {Number} centerLat
 * @param {Number} radius
 * @returns Promise object.
 */
ApartmentSchema.statics.findInRange = function (centerLong, centerLat, radius) {
  const Apartment = this;

  return Apartment.find({
    'location.geolocation': getGeoWithinObj([centerLong, centerLat], radius)
  });
};

/**
 * find all the apartments with the listed ids.
 *
 * @param {Array} listIds
 * @returns Promise object.
 */
ApartmentSchema.statics.findAllByIds = function (listIds) {
  const Apartment = this;

  return Apartment.find({ _id: { $in: listIds } });
};

/**
 * TODO: add the rest of properties
 *
 * find all the apartments with the specified properties.
 * properties currently supported:
 * _id
 * _createdBy
 * minPrice
 * maxPrice
 * latestEntranceDate
 * minRoommates
 * maxRoommates
 * latitude, logitude
 * address
 * minFloor
 * maxFloor
 * tags
 *
 * properties need to add:
 * minRoommates
 * maxRoommates
 *
 * @param {Object} p
 * @returns Promise object.
 */
ApartmentSchema.statics.findByProperties = async function (p) {
  const Apartment = this;

  let price;
  if (p.minPrice || p.maxPrice) {
    price = removeFalsyProps({ $gte: p.minPrice, $lte: p.maxPrice });
  }

  let entranceDate;
  if (p.latestEntranceDate) {
    entranceDate = removeFalsyProps({ $lte: p.latestEntranceDate });
  }

  let roommates;
  if (p.minRoommates || p.maxRoommates) {
    roommates = removeFalsyProps({ $gte: p.minRoommates, $lte: p.maxRoommates });
  }

  let geolocation;
  let SearchRadius = 5; //km
  if (p.radius) {
    SearchRadius = p.radius;
  }
  if (p.latitude && p.longitude) {
    const coords = [p.longitude, p.latitude];
    geolocation = getGeoWithinObj(coords, SearchRadius);
  } else if (p.address) {
    geolocation = await geoLocation.getGeoLocationCoords(p.address);
    if (!geolocation) {
      return new Promise((resolve) => resolve([]));
    }
    geolocation = getGeoWithinObj(geolocation, SearchRadius);
  }

  let floor;
  if (p.minFloor || p.maxFloor) {
    floor = removeFalsyProps({ $gte: p.minFloor, $lte: p.maxFloor });
  }

  let tags;
  if (p.tags) {
    tags = { $all: p.tags };
  }

  if ((p._id && !ObjectID.isValid(p._id)) || (p._createdBy && !ObjectID.isValid(p._createdBy))) {
    return Promise.reject();
  }

  const properties = removeFalsyProps({
    _id: p._id,
    _createdBy: p._createdBy,
    price,
    enteranceDate: entranceDate,
    'location.geolocation': geolocation,
    requiredNumberOfRoommates: roommates,
    currentlyNumberOfRoommates: p.currentRoommatesNumber,
    tags,
    floor
  });

  return Apartment.find(properties);
};

/**
 *
 * @returns string the apartment location as a string.
 */
ApartmentSchema.methods.getAddressString = function () {
  const apartment = this;

  const { address } = apartment.location;
  return `${address.number} ${address.street} ${address.city} ${address.state}`;
};

/**
 * add a new comment to an apartment.
 *
 * @param {ObjectId} _createdBy
 * @param {String} text
 * @param {Number} createdAt
 * @returns Promise object.
 */
ApartmentSchema.methods.addComment = function (_createdBy, text, createdAt) {
  const apartment = this;

  apartment.comments.push({
    _createdBy,
    createdAt,
    text
  });

  return apartment.save();
};


/**
 * add an interested user to the apartment's interested list.
 *
 * @param {ObjectId} _interestedID
 * @returns Promise object.
 */
ApartmentSchema.methods.addInterestedUser = function (_interestedID) {
  const apartment = this;

  apartment._interested.push(_interestedID);

  return apartment.save();
};


/**
 * remove the interested user from the apartment's interested list.
 *
 * @param {ObjectId} _interestedID
 * @returns Promise object.
 */
ApartmentSchema.methods.removeInterestedUser = function (_interestedID) {
  const apartment = this;

  const interestedIDIndex = getIndexOfValue(apartment._interested, _interestedID);
  if (interestedIDIndex > -1) {
    apartment._interested.splice(interestedIDIndex, 1);
  }

  return apartment.save();
};


/**
 * check if the user is interested in the apartment.
 *
 * @param {any} _interestedID
 * @returns true if the user is interested, otherwise false.
 */
ApartmentSchema.methods.isUserInterested = function (_interestedID) {
  const apartment = this;

  const interestedIDIndex = getIndexOfValue(apartment._interested, _interestedID);

  return (interestedIDIndex > -1);
};

const Apartment = mongoose.model('Apartment', ApartmentSchema);

module.exports = {
  Apartment
};
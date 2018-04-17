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
  entranceDate: {
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
  requiredRoommates: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  totalRoommates: {
    type: Number,
    min: 0,
    max: 11
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
  _notificationSubscribers: {
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
 * @updatedBy: Alon Talmor
 * @date: 17/04/18
 *
 * The function now supports the new schema by which is should fetch all relevant apartments.
 * receives an object which contains all the properties to filter by.
 * properties are:
 * @prop: id - should be a String of a legal ObjectID
 * @prop: createdBy, - should be a String of a legal ObjectID
 * @prop: entranceDate - A value which can be converted into Date
 * @prop: address - String of the full address
 * @prop: radius - Number, which indicates the range from the address or geolocation
 * @prop: price -  Array of 2 Numbers, which indicates the price range
 * @prop: roommates - Array of 2 Numbers, which indicates the roommates range
 * @prop: floor - Array of 2 Numbers, which indicates the floor range
 * @prop: tags - Array of the tags Numbers (ids)
 * @prop: geolocation - Array of 2 numbers: ['longitude','latitude']
 * @returns Promise Object with a list of all relevant apartments.
 */
ApartmentSchema.statics.findByProperties = async function (p) {
  const Apartment = this;

  const query = {};
  if (p.id && ObjectID.isValid(p.id)) { // id
    query._id = p.id;
  }
  if (p.createdBy && ObjectID.isValid(p.createdBy)) { // createdBy
    query._createdBy = p.createdBy;
  }
  if (p.entranceDate) { // entranceDate
    query.entranceDate = { $lte: new Date(p.entranceDate).getTime() };
  }
  const radius = +p.radius || 5; //km //address + geolocation + radius
  if (p.geolocation) { // find by geolocation first
    query['location.geolocation'] = getGeoWithinObj(p.geolocation, radius);
  } else if (p.address) { // find by address if geolocation is not defined
    const geolocation = await geoLocation.getGeoLocationCoords(p.address);
    if (!geolocation) {
      return new Promise((resolve) => resolve([]));
    }
    query['location.geolocation'] = getGeoWithinObj(geolocation, radius);
  }
  if (p.price && Array.isArray(p.price)) { // price
    query.price = removeFalsyProps({ $gte: p.price[0], $lte: p.price[1] });
  }
  if (p.roommates && Array.isArray(p.roommates)) { // roommates
    query.totalRoommates = removeFalsyProps({ $gte: p.roommates[0], $lte: p.roommates[1] });
  }
  if (p.floor && Array.isArray(p.floor)) { // floor
    query.floor = removeFalsyProps({ $gte: p.floor[0], $lte: p.floor[1] });
  }
  if (p.tags && Array.isArray(p.tags)) { // tags
    query.tags = { $all: p.tags };
  }

  return Apartment.find(query);
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
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns the index of the subscriber id inside the inner data structure
 *
 * @param {objectID} _userID: the id of the user to get his index.
 *
 * @returns {Number} indicating the index of the user or -1 if not found
 */
ApartmentSchema.methods.getIndexOfSubscriberUser = function (_subscriberID) {
  const apartment = this;

  var index = -1;

  for (var i = 0; i < apartment._notificationSubscribers.length; i++) {
    if (apartment._notificationSubscribers[i].equals(_subscriberID))
      index = i;
  }

  return index;
}
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * check if the given user is a subscriber of the apartment ad i.e. he is notified about changes in the apartment ad.
 *
 * @param {objectID} _userID: the id of the user to check.
 *
 * @returns {Boolean} indicating whether the given user is a subscriber of the ad or not.
 */
ApartmentSchema.methods.isUserSubscriber = function (_userID) {
  const apartment = this;

  return apartment.getIndexOfSubscriberUser(_userID) > -1;
};
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Adds the given user as a subscriber of the apartment ad i.e. he will be notified about changes in the apartment ad.
 *
 * @param {objectID} _userID: the id of the user to add.
 *
 * @returns {Promise} that resolved once the apartment document is updated in DB with the new subscriber.
 */
ApartmentSchema.methods.saveSubscriber = function (_subscriberID) {
  const apartment = this;

  if (!apartment.isUserSubscriber(_subscriberID)) {
    apartment._notificationSubscribers.push(_subscriberID);
  }

  return apartment.save();
};
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Removes the given user from the subscriber of the apartment ad i.e. he will not be notified about changes in the apartment ad anymore.
 *
 * @param {objectID} _userID: the id of the user to remove.
 *
 * @returns {Promise} that resolved once the apartment document is updated in DB withot the deleted subscriber.
 */
ApartmentSchema.methods.deleteSubscriber = function (_subscriberID) {
  const apartment = this;

  const subscriberIndex = apartment.getIndexOfSubscriberUser(_subscriberID);

  if (subscriberIndex > -1) {
    apartment._notificationSubscribers.splice(subscriberIndex, 1);
  }

  return apartment.save();
};

const Apartment = mongoose.model('Apartment', ApartmentSchema);

module.exports = {
  Apartment
};
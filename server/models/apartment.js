const mongoose = require('mongoose');
const _ = require('lodash');

const { EARTH_RADIUS_IN_KM } = require('../constants');
const geoLocation = require('../services/geoLocation/geoLocation');
const { removeFalsyProps } = require('../helpers/removeFalsyProps');
const { isSupportedTagId } = require('./tag');

const ApartmentSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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
      type: Number,
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

ApartmentSchema.statics.findInRange = function (centerLong, centerLat, radius) {
  const Apartment = this;

  return Apartment.find({
    'location.geolocation': getGeoWithinObj([centerLong, centerLat], radius)
  });
};

//TODO: add the rest of properties
//_id, _createdBy, fromPrice, toPrice, enteranceDate, address, radius, currentlyNumberOfRoomates
ApartmentSchema.statics.findByProperties = async function (p) {
  const Apartment = this;

  let price;
  if (p.fromPrice || p.toPrice) {
    price = removeFalsyProps({ $gte: p.fromPrice, $lte: p.toPrice });
  }

  let enteranceDate;
  if (p.enteranceDate) {
    enteranceDate = { $lte: p.enteranceDate };
  }

  let geolocation;
  if (p.address) {
    geolocation = await geoLocation.getGeoLocationCoords(p.address);
    if (!geolocation) {
      return new Promise((resolve) => resolve([]));
    }
    geolocation = p.radius ? getGeoWithinObj(geolocation, p.radius) : geolocation;
  }

  const properties = removeFalsyProps({
    _id: p._id,
    _createdBy: p._createdBy,
    price,
    enteranceDate,
    'location.geolocation': geolocation,
    currentlyNumberOfRoomates: p.currentlyNumberOfRoomates
  });

  return Apartment.find(properties);
};

ApartmentSchema.methods.getAddressString = function () {
  const apartment = this;

  const { address } = apartment.location;
  return `${address.number} ${address.street} ${address.city} ${address.state}`;
};

const Apartment = mongoose.model('Apartment', ApartmentSchema);

module.exports = {
  Apartment
};
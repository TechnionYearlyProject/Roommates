const mongoose = require('mongoose');

const {EARTH_RADIUS_IN_KM} = require('../constants');

const apartmentAdScema = new mongoose.Schema({
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
    }],
    enteranceDate: {
        type: Date,
        min: Date('2017-01-01'),
        required: true
    },
    location : {
        address : {
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
    comments : [{
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


apartmentAdScema.statics.findInRange = function(centerLong, centerLat, radius) {
    const kmToRadians = radius / EARTH_RADIUS_IN_KM;
    return this.find({
    'location.geolocation': {
        $geoWithin: {
            $centerSphere: [
            [centerLong, centerLat],
            kmToRadians
            ]
        }
    }});
};

const ApartmentAd = mongoose.model('ApartmentAd', apartmentAdScema);

module.exports = {
    ApartmentAd
};
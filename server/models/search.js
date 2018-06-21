
const mongoose = require('mongoose');
const _ = require('lodash');


const {Apartment} = require('../../server/models/apartment');
const {EARTH_RADIUS_IN_KM} = require('../constants');
const geoLocation = require('../services/geoLocation/geoLocation');
const {removeFalsyProps} = require('../helpers/removeFalsyProps');
const {getIndexOfValue, getIndexOfFirstElementMatchKey} = require('../helpers/arrayFunctions');
const {ObjectID} = require('mongodb'); 

const SearchSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    price: [{
        type: Number,
        min: 0,
    }],
    entranceDate: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        minlength: 2,
        maxlength: 100,
        lowercase: true,
        trim: true,
    },
    geolocation: {
        type: [Number],
        index: '2dsphere',
        default: [0, 0]
    },
    radius:{
        type: Number
    },
    floor: [{
        type: Number,
    }],
    tags: [{
        type: Number,
    }],
    roommates: [{
        type: Number,
    }]
});

/**
 * @author Chanan Ben-Tal
 * 
 * main function of this model
 * go through all new apartments and check if any new searchs would have found them
 * then notify the users who made the searchs
 */
SearchSchema.methods.checkNewApartments = async function() {
    const day = 1000*60*60*24 //1000 ms * 60 secs * 60 min * 24 hours
    const query = {};
    query.createdAt = {
        $gte: (Date.now()-day)
      };

    const newApartments = await Apartment.find(query);
    const toBeNotified = [];

    const searchs = await Search.find({});

    var result;

    searchs.forEach(element => {    //get rid of old searchs, old == over 2 days
        if(Date.now() - element.createdAt>(2*day)){
            Search.findByIdAndRemove(element._id);
        }
    });
    await searchs.forEach(async (search) => {
        if(Date.now() - search.createdAt>(2*day)){
            return;
        }
        newApartments.forEach(apartment => {

            if(search.price[0]<=apartment.price && search.price[1]>=apartment.price){
                if(search.roommates[0]<=apartment.totalRoommates && search.roommates[1]>=apartment.totalRoommates){
                    if(search.floor[0]<=apartment.floor && search.floor[1]>=apartment.floor){   //floor
                        if(search.entranceDate <= apartment.entranceDate){   //
                            toBeNotified.forEach(id => {

                                if(id.equals(search.createdBy)){
                                    result++;
                                }
                            })
                            if(!result){
                                toBeNotified.push(search.createdBy);
                            }
                            result = 0;
                        }
                    }
                }
            }
        });
    });
    return toBeNotified;
};

const Search = mongoose.model('Search', SearchSchema);

module.exports = {
  Search
};

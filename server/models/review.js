const mongoose = require('mongoose');

const { EARTH_RADIUS_IN_KM } = require('../constants');
const geoLocation = require('../services/geoLocation/geoLocation');
const { getIndexOfValue } = require('../helpers/arrayFunctions');
const { ObjectID } = require('mongodb');
const { User } = require('./user');

const ReviewSchema = new mongoose.Schema({
    _createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    activatedAt: {
        type: Number,
    },
    street: {
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
    state: {
        type: String,
        minlength: 2,
        maxlength: 30,
        lowercase: true,
        trim: true,
        required: true
    },
    geolocation: {
        type: [Number],
        index: '2dsphere',
        default: [0, 0]
    },
    ratedCharacteristics:{
        parking: {
            type: Number,
            min: 0,
            max:5
        },
        publicTransport:  {
            type: Number,
            min: 0,
            max:5
        },
        noise:  {
            type: Number,
            min: 0,
            max:5
        },
        commercialServices:  {
            type: Number,
            min: 0,
            max:5
        },
        upkeep:  {
            type: Number,
            min: 0,
            max:5
        },
        generalRating:  {
            type: Number,
            min: 0,
            max:5
        }
    },
    Pros: {
        type: String,
        minlength: 10,
        maxlength: 1000,
        required: true
    },
    Cons: {
        type: String,
        minlength: 10,
        maxlength: 1000,
        required: true
    },
    relevent:{
        type: Boolean,
        default: true
    }
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
 * find all the reviews in the geo-circle, which is defined by
 * the specified center point and radius.
 *
 * @param {Number} centerLong
 * @param {Number} centerLat
 * @param {Number} radius
 * @returns Promise object.
 */

ReviewSchema.statics.findInRange = function (centerLong, centerLat) {
  const review = this;

  return review.find({
    'geolocation': getGeoWithinObj([centerLong, centerLat], 1)
  });
};


/**
 * how many years have passed since last activated
 * used to determain how relevent is a review
 * 
 * @returns number of years since activated
 */

ReviewSchema.methods.updateRelevency = async function () {
    var review = this;
    var years = Math.round((Date.now()-review.activatedAt)/(1000*60*60*24*365));
    // console.log(review);
    // console.log(years);
    if(years == 0){
        // console.log("no need to update");
        return;
    }
    if(years == 1){
        // console.log("review is a year old");
        if(review.relevent){
            // console.log("need to update");
            review.relevent = false; 
            return review.save();      
        }
        return;
    }
    // console.log("review is over 2 years old");
    // console.log("need to remove review");
    await Review.findByIdAndRemove(review._id);User.findById(review._createdBy).then(result =>{
        result.removeReview(review._id);
    });
  };
  

// /**
//  * check if the user is interested in the apartment.
//  *
//  * @param {any} reviewerID
//  * @returns true if the user is interested, otherwise false.
//  */
// ReviewSchema.methods.didUserReview = function (reviewerID) {
//   const review = this;

//   const interestedIDIndex = getIndexOfValue(review.voters, reviewerID);

//   return (interestedIDIndex > -1);
// };




const Review = mongoose.model('Review', ReviewSchema);

module.exports = {
  Review
};
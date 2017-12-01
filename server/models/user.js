const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 2,
        trim: true
    },
    birthDate: {
        type: Date,
        min: Date('1900-01-01'),
        max: +new Date() - 15*365*24*60*60*1000,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        lowercase: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => validator.isURL(value),
            message: '{VALUE} is not a valid URL'
        }
    },
    about: {
        type: String,
    },
    hobbies: [{
        name: {
            type: String,
            trim: true,
            uppercase: true,
            // TODO: add enum list of all hobbies, should be in a different file!
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }],
    _publishedApartments: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    _interestedApartments: [{
        type: mongoose.Schema.Types.ObjectId
    }],   
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
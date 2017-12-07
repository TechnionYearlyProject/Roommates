const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const { XAUTH } = require('../constants');

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
        type: Date,
        min: new Date('1900-01-01'),
        max: +new Date() - 15*365*24*60*60*1000,
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
        require: true
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

UserSchema.pre('save', function(next) {
    let user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }                
            });
        });
    });
};

UserSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject();

    return _.pick(userObject, ['email', 'firstName', 'lastName', 'birthdate', 'gender']);
};

UserSchema.methods.generateAuthenticationToken = function () {
    const user = this;

    const access = XAUTH;
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    return user.save()
    .then(() => token);
};

UserSchema.methods.register = function () {
    const user = this;

    return user.save()
    .then((user) => user.generateAuthenticationToken());
}

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
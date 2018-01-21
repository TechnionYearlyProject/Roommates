const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {
    BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, OK
} = require('http-status');
const httpRequestLogger = require('morgan');

require('./server-config');
require('./db/mongoose');
const { useVue } = require('./middleware/vuejs');
const { useCors } = require('./middleware/cors');
const geoLocation = require('./services/geoLocation/geoLocation');
const { Apartment } = require('./models/apartment');
const { User } = require('./models/user');
const { XAUTH, XEXPIRATION } = require('./constants');
const { authenticate } = require('./middleware/authenticate');
const { getSupportedHobbies } = require('./models/hobbie');
const { getSupportedTags } = require('./models/tag');
const { logInfo } = require('./services/logger/logger');
const httpLogger = require('./services/logger/http-logger');
const errors = require('./errors');


const app = express();

app.use(httpLogger.logResponseBodyOnError);
app.use(bodyParser.json({ limit: '5mb' }));
useCors(app);
useVue(app);

app.post('/apartments', authenticate, async (req, res) => {
    try {
        const address = _.pick(req.body.address, ['state', 'city', 'street', 'number']);
        const location = {
            address,
            geolocation: await geoLocation.getGeoLocationCoords(`${address.street} ${address.number} ${address.city} ${address.state}`)
        };
        if (!location.geolocation) {
            return res.status(BAD_REQUEST).send(errors.invalidLocation);
        }

        const apartmentData = _.pick(req.body,
            [
                'title',
                'price',
                'address',
                'enteranceDate',
                'images',
                'description',
                'tags',
                'requiredNumberOfRoommates',
                'currentlyNumberOfRoommates',
                'numberOfRooms',
                'floor',
                'totalFloors',
                'area'
            ]);
        apartmentData._createdBy = req.user._id;
        apartmentData.createdAt = Date.now();
        apartmentData.location = location;

        const apartment = await new Apartment(apartmentData).save();
        await User.findByIdAndUpdate(req.user._id, { $push: { _publishedApartments: apartment._id } })
            .catch((err) => {
                Apartment.findByIdAndRemove(apartment._id);
                throw err;
            });
        return res.send({ apartment });
    } catch (err) {
        return res.status(BAD_REQUEST).send(errors.unknownError);
    }
});

app.get('/apartments/tags', async (req, res) => {
    try {
        res.send({ tags: getSupportedTags() });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.get('/apartments', async (req, res) => {
    try {
        const body = _.pick(req.query,
            [
                'id',
                'createdBy',
                'minPrice',
                'maxPrice',
                'minEntranceDate',
                'latestEntranceDate',
                'address',
                'radius',
                'minRoommates',
                'maxRoommates',
                'currentRoommatesNumber',
                'minFloor',
                'maxFloor',
                'tags',
                'latitude',
                'longitude'
            ]);

        let tags;
        if (body.tags && Array.isArray(body.tags)) {
            tags = body.tags.map(tagName => getSupportedTags().filter(t => t.name === tagName)[0]._id);
        }

        const results = await Apartment.findByProperties({
            _id: body.id,
            _createdBy: body.createdBy,
            address: body.address,
            minPrice: body.minPrice,
            maxPrice: body.maxPrice,
            radius: body.radius,
            minRoommates: body.minRoommates,
            maxRoommates: body.maxRoommates,
            currentRoommatesNumber: body.currentRoommatesNumber,
            minFloor: body.minFloor,
            maxFloor: body.maxFloor,
            tags,
            latestEntranceDate: body.latestEntranceDate,
            latitude: body.latitude,
            longitude: body.longitude
        });
        res.send({ results });
    } catch (err) {
        console.error(err);
        res.status(BAD_REQUEST).send(err);
    }
});

app.put('/apartments/:id/interested', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const apartment = await Apartment.findById(id);
        if (!apartment) {
            return res.status(NOT_FOUND).send();
        }

        if (apartment.isUserInterested(req.user._id)) {
            await apartment.removeInterestedUser(req.user._id);
            await req.user.removeInterestInApartment(id);
        } else {
            await apartment.addInterestedUser(req.user._id);
            await req.user.addInterestInApartment(id);
        }

        return res.status(OK).send();
    } catch (err) {
        return res.status(BAD_REQUEST).send(err);
    }
});
app.put('/apartments/:id/comment', authenticate, async (req, res) => {
    try {
        const body = _.pick(req.body, ['text']);
        const { id } = req.params;

        const apartment = await Apartment.findById(id);
        if (!apartment) {
            return res.status(NOT_FOUND).send();
        }

        await apartment.addComment(req.user._id, body.text, Date.now());

        const { comments } = apartment;

        return res.send({ comments });
    } catch (err) {
        return res.status(BAD_REQUEST).send(err);
    }
});

app.delete('/apartments/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        if (!(req.user.isOwner(id))) {
            return res.status(UNAUTHORIZED).send();
        }

        await req.user.removeApartment(id);
        await Apartment.findByIdAndRemove(id);

        return res.status(OK).send();
    } catch (err) {
        return res.status(BAD_REQUEST).send(err);
    }
});

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body,
            [
                'email',
                'password',
                'firstName',
                'lastName',
                'birthdate',
                'gender'
            ]);

        const user = new User(body);
        const ticket = await user.register();

        res.header(XAUTH, ticket.token);
        res.header(XEXPIRATION, ticket.expiration).send({ user });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);

        const user = await User.findByCredentials(body.email, body.password);
        user.removeExpiredTokens();
        const ticket = await user.generateAuthenticationToken();
        res.header(XAUTH, ticket.token);
        res.header(XEXPIRATION, ticket.expiration).send({ user });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.get('/users/self', authenticate, (req, res) => {
    res.send({ self: req.user });
});


app.get('/users/tags', async (req, res) => {
    try {
        res.send({ tags: getSupportedHobbies() });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(NOT_FOUND).send();
        }
        return res.send({ user });
    } catch (err) {
        return res.status(BAD_REQUEST).send(err);
    }
});

app.get('/users/:id/interested', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(NOT_FOUND).send();
        }
        const interested = await Apartment.findAllByIds(user._interestedApartments);
        return res.send({ interested });
    } catch (err) {
        return res.status(BAD_REQUEST).send(err);
    }
});

app.get('/users/:id/published', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(NOT_FOUND).send();
        }
        const published = await Apartment.findAllByIds(user._publishedApartments);
        return res.send({ published });
    } catch (err) {
        return res.status(BAD_REQUEST).send(err);
    }
});

app.patch('/users/self', authenticate, async (req, res) => {
    try {
        const body = _.pick(req.body,
            [
                'firstName',
                'lastName',
                'birthdate',
                'gender',
                'mobilePhone',
                'about',
                'image',
                'hobbies',
                '_publishedApartments',
                '_interestedApartments'
            ]);

        const user = await User.findByIdAndUpdate(req.user._id, { $set: body }, { new: true, runValidators: true });
        res.send({ user });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});


app.listen(process.env.PORT, () => {
    logInfo(`Server is up on port ${process.env.PORT}.`);
});

module.exports = {
    app
};
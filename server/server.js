const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { OK, BAD_REQUEST } = require('http-status');

const serverConfig = require('./server-config');
const geoLoc = require('./services/geoLocation/geoLocation');
const { mongoose } = require('./db/mongoose');
const { Apartment } = require('./models/apartment');
const { User } = require('./models/user');
const { XAUTH } = require('./constants');
const { authenticate } = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

//app.use(express.static(__dirname + '/public')); //register middleware

app.get('/', (req, res) => {
    res.send('<h1>Roommates..</h1><p>you can send me your credit card number if you want :)</p>');
});

app.post('/apartments', authenticate, async (req, res) => {
    try {
        const address = _.pick(req.body, 'address').address;
        const locations = await geoLoc.getGeoLocation(`${address.street} ${address.number} ${address.city} ${address.state}`);
        if (locations.length === 0) {
            return res.status(BAD_REQUEST).send();
        }
        const geolocation = [locations[0].longitude, locations[0].latitude];
        const location = { address, geolocation };

        const apartmentData = _.pick(req.body, [
            'price',
            'enteranceDate',
            'images',
            'description',
            'tags',
            'requiredNumberOfRoommates',
            'currentlyNumberOfRoomates',
            'numberOfRooms',
            'floor',
            'totalFloors',
            'area'
        ]);
        apartmentData._createdBy = req.user._id;
        apartmentData.createdAt = new Date();
        apartmentData.location = location;
        const apartment = new Apartment(apartmentData);
        await apartment.save();
        res.send({ apartment });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.get('/apartments', async (req, res) => {
    try {
        const body = _.pick(req.query, ['id', 'createdBy', 'fromPrice', 'toPrice', 'untilEnteranceDate', 'address', 'radius', 'roommatesNumber', 'tags']);

        const results = await Apartment.findByProperties(body.id, body.createdBy, body.fromPrice, body.toPrice, body.untilEnteranceDate, body.address, body.radius, body.roommatesNumber);
        res.send({ results });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, [
            'email',
            'password',
            'firstName',
            'lastName',
            'birthdate',
            'gender'
        ]);

        const user = new User(body);
        const token = await user.register();
        res.header(XAUTH, token).send({ user });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);

        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthenticationToken();
        res.header(XAUTH, token).send({ user });
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}.`);
});

module.exports = {
    app
};
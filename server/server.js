const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, OK } = require('http-status');
const cors = require('cors');

require('./server-config');
require('./db/mongoose');
const { useVue } = require('./middleware/vuejs');
const geoLocation = require('./services/geoLocation/geoLocation');
const { Apartment } = require('./models/apartment');
const { User } = require('./models/user');
const { XAUTH } = require('./constants');
const { authenticate } = require('./middleware/authenticate');
const { getSupportedHobbies } = require('./models/hobbie');
const { getSupportedTags } = require('./models/tag');

const app = express();

app.use(bodyParser.json());
app.use(cors(process.env.CORS));
useVue(app);

app.post('/apartments', authenticate, async (req, res) => {
  try {
    const address = _.pick(req.body.address, ['state', 'city', 'street', 'number']);
    const location = {
      address,
      geolocation: await geoLocation.getGeoLocationCoords(`${address.street} ${address.number} ${address.city} ${address.state}`)
    };
    if (!location.geolocation) {
      return res.status(BAD_REQUEST).send();
    }

    const apartmentData = _.pick(req.body,
      [
        'price',
        'address',
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
    return res.status(BAD_REQUEST).send(err);
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
        'fromPrice',
        'toPrice',
        'untilEnteranceDate',
        'address',
        'radius',
        'roommatesNumber',
        'tags'
      ]);

    const results = await Apartment.findByProperties({
      _id: body.id,
      _createdBy: body.createdBy,
      fromPrice: body.fromPrice,
      toPrice: body.toPrice,
      enteranceDate: body.untilEnteranceDate,
      address: body.address,
      radius: body.radius,
      currentlyNumberOfRoomates: body.roommatesNumber
    });
    res.send({ results });
  } catch (err) {
    res.status(BAD_REQUEST).send(err);
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

    const comments = apartment.comments;

    res.send({ comments });

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

    res.status(OK).send();

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
        'hobbies'
      ]);

    const user = await User.findByIdAndUpdate(req.user._id, { $set: body }, { new: true, runValidators: true });
    res.send({ user });
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
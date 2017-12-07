const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { OK, BAD_REQUEST } = require('http-status');

const serverConfig = require('./server-config');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { XAUTH } = require('./constants');

const app = express();

app.use(bodyParser.json());

//app.use(express.static(__dirname + '/public')); //register middleware

app.get('/', (req, res) => {
    res.send('<h1>Roommates..</h1><p>you can send me your credit card number if you want :)</p>');
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
        res.status(OK).header(XAUTH, token).send(user);
    } catch (err) {
        res.status(BAD_REQUEST).send(err);
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);

        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.status(OK).header(XAUTH, token).send(user);
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
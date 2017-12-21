const { UNAUTHORIZED } = require('http-status');

const { User } = require('../models/user');
const { XAUTH } = require('../constants');

const authenticate = (req, res, next) => {
  const token = req.header(XAUTH);
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      return next();
    })
    .catch((err) => res.status(UNAUTHORIZED).send(err));
};

module.exports = { authenticate };
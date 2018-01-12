const { UNAUTHORIZED } = require('http-status');

const { User } = require('../models/user');
const { XAUTH, XEXPIRATION } = require('../constants');

const authenticate = (req, res, next) => {
  const token = req.header(XAUTH);

  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      if (Date.now() > user.getToken(token).expiration) {
        return user.removeExpiredTokens()
          .then(() => Promise.reject());
      }
      return user.updateTokenTime(token)
        .then((expiration) => {
          req.user = user;
          req.token = token;
          console.log(expiration);
          res.header(XEXPIRATION, expiration);
          return next();
        });
    })
    .catch((err) => res.status(UNAUTHORIZED).send(err));
};

module.exports = { authenticate };
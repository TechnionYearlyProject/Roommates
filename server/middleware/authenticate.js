const { UNAUTHORIZED } = require('http-status');

const { User } = require('../models/user');
const { XAUTH, XEXPIRATION } = require('../constants');

/**
 * @author: Alon Talmor
 * @date: previous simester
 *
 * a middleware function.
 * check that the header auth token is a valid token.
 * if the token is valid update the token expiration value and call next.
 *
 * @param {Request Object} req
 * @param {Response Object} res
 * @param {Function} next
 * @returns a Promise object.
 */
const authenticate = (req, res, next) => {
  const token = req.header(XAUTH);

  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      if (Date.now() > user.getTicket(token).expiration) {
        return user.removeExpiredTokens()
          .then(() => Promise.reject());
      }

      return user.updateTokenTime(token)
        .then((expiration) => {
          res.header(XEXPIRATION, expiration);
          req.user = user;
          req.token = token;
          return next();
        });
    })
    .catch((err) => res.status(UNAUTHORIZED).send(err));
};

module.exports = { authenticate };
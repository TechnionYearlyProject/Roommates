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
const authenticate = async (req, res, next) => {
  const token = req.header(XAUTH);
  try {
    const user = await User.findByToken(token);
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    res.status(UNAUTHORIZED).send(error);
  }
};

module.exports = { authenticate };
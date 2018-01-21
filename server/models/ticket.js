const { XAUTH_EXPIRATION_TIME } = require('../constants');

/**
 * time is returned in milliseconds since Jan 1 1970.
 *
 * @returns a new expiration time ending auth expiration time
 * after this function was called.
 */
const generateNewExpiration = () => Date.now() + XAUTH_EXPIRATION_TIME;

const create = (access, token) => ({
  access,
  token,
  expiration: generateNewExpiration()
});

module.exports = {
  generateNewExpiration,
  create
};
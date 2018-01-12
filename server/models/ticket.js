const { XAUTH_EXPIRATION_TIME } = require('../constants');

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
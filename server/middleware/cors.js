const cors = require('cors');

const { XAUTH, XEXPIRATION } = require('../constants');

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', XAUTH, XEXPIRATION],
  exposedHeaders: ['Content-Type', XAUTH, XEXPIRATION],
  optionsSuccessStatus: 200
};

/**
 * a middleware function.
 * set the HTTP configuration.
 *
 * @param {Express Object} app
 */
const useCors = (app) =>
  app.use(cors(corsOptions));


module.exports = {
  useCors
};
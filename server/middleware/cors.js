const cors = require('cors');

const { XAUTH, XEXPIRATION } = require('../constants');

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', XAUTH, XEXPIRATION],
  exposedHeaders: ['Content-Type', XAUTH, XEXPIRATION],
  optionsSuccessStatus: 200
};
const useCors = (app) =>
  app.use(cors(corsOptions));


module.exports = {
  useCors
};
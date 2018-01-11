const cors = require('cors');

const { XAUTH } = require('../constants');

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', XAUTH],
  exposedHeaders: ['Content-Type', XAUTH],
  optionsSuccessStatus: 200
};
const useCors = (app) =>
  app.use(cors(corsOptions));


module.exports = {
  useCors
};
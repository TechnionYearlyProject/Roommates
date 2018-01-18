const mongoose = require('mongoose');
const {logInfo, logError} = require('../services/logger/logger');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
  .then(() =>
    logInfo('Mongoose connection success.')
  ).catch((err) =>
    logError(`Mongoose connection error!\n${err}`)
  );

module.exports = {
  mongoose
};
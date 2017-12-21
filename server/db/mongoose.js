const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
  .then(() =>
    console.log('Mongoose connection success.')
  ).catch((err) =>
    console.error(`Mongoose connection error!\n${err}`)
  );

module.exports = {
  mongoose
};
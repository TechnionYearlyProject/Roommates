const _ = require('lodash');

const removeFalsyProps = (obj) =>
  _.pickBy(obj, _.identity);


module.exports = {
  removeFalsyProps
};
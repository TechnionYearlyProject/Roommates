const _ = require('lodash');

/**
 * remove properties with falsy value.
 *
 * @param {Object} obj
 * @returns a new object without the falsy properties.
 */
const removeFalsyProps = (obj) =>
  _.pickBy(obj, _.identity);


module.exports = {
  removeFalsyProps
};
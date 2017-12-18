const _ = require('lodash');

const removeFalsyProps = (obj) => {
  return _.pickBy(obj, _.identity);
}

module.exports = {
  removeFalsyProps
}
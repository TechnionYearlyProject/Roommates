const { getHobbiesScore } = require('../models/hobbie');
const array_functions = require('../helpers/array_functions');

const getMatchScore = (hobbiesSetA, hobbiesSetB) => {
  var matchedHobbies = array_functions.findMatchingValuesInArrays(hobbiesSetA, hobbiesSetB);
  return getHobbiesScore(matchedHobbies);
};

module.exports = {
  getMatchScore
}; 
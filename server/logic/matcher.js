const { getHobbiesScore } = require('../models/hobbie');
const arrayFunctions = require('../helpers/arrayFunctions');

const getMatchScore = (hobbiesSetA, hobbiesSetB) => {
  const matchedHobbies = arrayFunctions.findMatchingValuesInArrays(hobbiesSetA, hobbiesSetB);
  return getHobbiesScore(matchedHobbies);
};

module.exports = {
  getMatchScore
};
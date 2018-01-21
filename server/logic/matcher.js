const { getHobbiesScore } = require('../models/hobbie');
const arrayFunctions = require('../helpers/arrayFunctions');

/**
 * each common hobby increases the matching score.
 *
 * @param {Array} hobbiesSetA
 * @param {Array} hobbiesSetB
 * @returns the matching score of 2 hobby array.
 */
const getMatchScore = (hobbiesSetA, hobbiesSetB) => {
  const matchedHobbies = arrayFunctions.findMatchingValuesInArrays(hobbiesSetA, hobbiesSetB);
  return getHobbiesScore(matchedHobbies);
};

module.exports = {
  getMatchScore
};
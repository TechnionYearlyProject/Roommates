const arrayFunctions = require('../helpers/arrayFunctions');

const supportedHobbies = [
  {
    _id: 1,
    name: 'VEGAN',
    score: 1
  },
  {
    _id: 2,
    name: 'NON-SMOKING',
    score: 1
  },
  {
    _id: 3,
    name: 'QUIET',
    score: 1
  },
  {
    _id: 4,
    name: 'OUTGOING',
    score: 1
  },
  {
    _id: 5,
    name: 'NIGHT PERSON',
    score: 1
  },
  {
    _id: 6,
    name: 'DAILY PERSON',
    score: 1
  },
  {
    _id: 7,
    name: 'RELEGIOUS',
    score: 1
  },
  {
    _id: 8,
    name: 'INTERESTED IN SPORT',
    score: 1
  },
  {
    _id: 9,
    name: 'INTERESTED IN CULINARY',
    score: 1
  },
  {
    _id: 10,
    name: 'INTERESTED IN POLITICS',
    score: 1
  },
  {
    _id: 11,
    name: 'INTERESTED IN MUSIC',
    score: 1
  },
  {
    _id: 12,
    name: 'INTERESTED IN HISTORY',
    score: 1
  },
  {
    _id: 13,
    name: 'INTERESTED IN ARTS',
    score: 1
  },
  {
    _id: 14,
    name: 'KOSHER KEEPER',
    score: 1
  }
];

/**
 *
 * @returns the list of all hobbies.
 */
const getSupportedHobbies = () => supportedHobbies;


/**
 * check if a hobby has a property with the specified value.
 *
 * @param {String} key
 * @param {Number} value
 * @returns true if hobby found, otherwise false.
 */
const isSupportedHobbie = (key, value) =>
  arrayFunctions.containsElementWithProperty(supportedHobbies, key, value);

/**
 * checks if the id is a valid hobby id.
 *
 * @param {Number} hobbieId
 * @returns true if id is valid, otherwise false.
 */
const isSupportedHobbieId = (hobbieId) => isSupportedHobbie('_id', hobbieId);

/**
 * checks if the name is a valid hobby name.
 *
 * @param {String} hobbieName
 * @returns true if name is valid, otherwise false.
 */
const isSupportedHobbieName = (hobbieName) => isSupportedHobbie('name', hobbieName.toUpperCase());

/**
 *
 * @param {Number} hobbieId
 * @returns score of the hobby with the specified id or 0 if id is invalid.
 */
const getHobbieScore = (hobbieId) => {
  const hobbie = supportedHobbies.find((h) => h._id === hobbieId);
  if (!hobbie) {
    return 0;
  }
  return hobbie.score;
};

/**
 *
 * @param {Array} hobbiesIdArr
 * @returns sum of the hobbies' score in the array.
 */
const getHobbiesScore = (hobbiesIdArr) => {
  let sum = 0;
  hobbiesIdArr.forEach((hobbieId) => {
    sum += getHobbieScore(hobbieId);
  });
  return sum;
};


module.exports = {
  getSupportedHobbies,
  isSupportedHobbieId,
  isSupportedHobbieName,
  getHobbiesScore
};
const array_functions = require('../helpers/array_functions');

const supportedHobbies = [
  {
    _id: 1,
    name: "VEGAN",
    score: 1
  },
  {
    _id: 2,
    name: "NON-SMOKING",
    score: 1
  },
  {
    _id: 3,
    name: "QUIET",
    score: 1
  },
  {
    _id: 4,
    name: "VEGAN",
    score: 1
  },
  {
    _id: 5,
    name: "NIGHT PERSON",
    score: 1
  },
  {
    _id: 6,
    name: "DAILY PERSON",
    score: 1
  },
  {
    _id: 7,
    name: "RELEGIOUS",
    score: 1
  },
  {
    _id: 8,
    name: "INTERESTED IN SPORT",
    score: 1
  },
  {
    _id: 9,
    name: "INTERESTED IN CULINARY",
    score: 1
  },
  {
    _id: 10,
    name: "INTERESTED IN POLITICS",
    score: 1
  },
  {
    _id: 11,
    name: "INTERESTED IN MUSIC",
    score: 1
  },
  {
    _id: 12,
    name: "INTERESTED IN HISTORY",
    score: 1
  },
  {
    _id: 13,
    name: "INTERESTED IN ARTS",
    score: 1
  }
];

const getSupportedHobbies = () => {
  return supportedHobbies;
};

const isSupportedHobbieId = (hobbieId) => {
  return isSupportedHobbie('_id', hobbieId);
};

const isSupportedHobbieName = (hobbieName) => {
  return isSupportedHobbie('name', hobbieName.toUpperCase());
};

const isSupportedHobbie = (key, value) => {
  return array_functions.containsElementWithProperty(supportedHobbies, key, value);
};

const getHobbieScore = (hobbieId) => {
  if (isSupportedHobbieId(hobbieId)) {
    for (let i = 0; i < supportedHobbies.length; i++) {
      if (supportedHobbies[i]._id === hobbieId) {
        return supportedHobbies[i].score;
      }
    }
  }
  return 0;
};

const getHobbiesScore = (hobbiesIdArr) => {
  var sum = 0;
  hobbiesIdArr.forEach(function (hobbieId) {
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
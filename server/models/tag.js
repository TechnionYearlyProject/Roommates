const array_functions = require('../helpers/arrayFunctions');

const supportedTags = [
  {
    _id: 1,
    name: "AC"
  },
  {
    _id: 2,
    name: "PETS"
  },
  {
    _id: 3,
    name: "ELEVATOR"
  },
  {
    _id: 4,
    name: "TERRACE"
  },
  {
    _id: 5,
    name: "PARKING"
  },
  {
    _id: 6,
    name: "STORAGE"
  }
];

const getSupportedTags = () => {
  return supportedTags;
};

const isSupportedTagId = (tagID) => {
  return isSupportedTag('_id', tagID);
};

const isSupportedTagName = (tagName) => {
  return isSupportedTag('name', tagName.toUpperCase());
};

const isSupportedTag = (key, value) => {
  return array_functions.containsElementWithProperty(supportedTags, key, value);
};

module.exports = {
  getSupportedTags,
  isSupportedTagId,
  isSupportedTagName
}; 
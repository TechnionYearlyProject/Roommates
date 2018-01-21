const arrayFunctions = require('../helpers/arrayFunctions');

const supportedTags = [
  {
    _id: 1,
    name: 'AC'
  },
  {
    _id: 2,
    name: 'PETS'
  },
  {
    _id: 3,
    name: 'ELEVATOR'
  },
  {
    _id: 4,
    name: 'TERRACE'
  },
  {
    _id: 5,
    name: 'PARKING'
  },
  {
    _id: 6,
    name: 'STORAGE'
  },
  {
    _id: 7,
    name: 'KOSHER KITCHEN'
  },
  {
    _id: 8,
    name: 'FURNISHED'
  },
];

/**
 *
 * @returns a list of all tags.
 */
const getSupportedTags = () => supportedTags;

/**
 * check if a tag has a property with the specified value.
 *
 * @param {Number} key
 * @param {String} value
 * @returns
 */
const isSupportedTag = (key, value) => arrayFunctions.containsElementWithProperty(supportedTags, key, value);

/**
 * check if the id is a valid tag's id.
 *
 * @param {Number} tagID
 * @returns true if the id is valid, otherwise false.
 */
const isSupportedTagId = (tagID) => isSupportedTag('_id', tagID);

/**
 * check if the name is a valid tag's name.
 *
 * @param {any} tagName
 * @returns true if the name is valid, otherwise false.
 */
const isSupportedTagName = (tagName) => isSupportedTag('name', tagName.toUpperCase());


module.exports = {
  getSupportedTags,
  isSupportedTagId,
  isSupportedTagName
};
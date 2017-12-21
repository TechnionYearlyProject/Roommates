const _ = require('lodash');

const findMatchingValuesInArrays = (arrayA, arrayB) =>
  _.intersection(arrayA, arrayB);


const containsElementWithProperty = (array, key, value) =>
  _.some(array, (currentTopic) => currentTopic[key] === value);

const sortArrayASC = (array, elementValueCalculatorFunction) =>
  _.sortBy(array, elementValueCalculatorFunction);


module.exports = {
  findMatchingValuesInArrays,
  containsElementWithProperty,
  sortArrayASC
};
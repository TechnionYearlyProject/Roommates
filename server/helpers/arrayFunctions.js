const _ = require('lodash');

/**
 * return an array containing the intersecting arrays values.
 *
 * @param {Array} arrayA
 * @param {Array} arrayB
 */
const findMatchingValuesInArrays = (arrayA, arrayB) =>
  _.intersection(arrayA, arrayB);

/**
 * return true if the array contains an object
 * with a property with the specified value.
 *
 * @param {Array} array
 * @param {any} key
 * @param {any} value
 */
const containsElementWithProperty = (array, key, value) =>
  _.some(array, (currentTopic) => currentTopic[key] === value);

/**
 * sort an array in an ascending order.
 *
 * @param {Array} array
 * @param {Fuction} elementValueCalculatorFunction
 */
const sortArrayASC = (array, elementValueCalculatorFunction) =>
  _.sortBy(array, elementValueCalculatorFunction);

/**
 * get the index in the array of the specified value.
 *
 * @param {Array} array
 * @param {any} value
 * @returns the index or -1 if not found.
 */
const getIndexOfValue = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == value) {
      return i;
    }
  }
  return -1;
};

module.exports = {
  findMatchingValuesInArrays,
  containsElementWithProperty,
  sortArrayASC,
  getIndexOfValue
};
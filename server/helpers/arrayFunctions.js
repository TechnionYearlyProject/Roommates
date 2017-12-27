const _ = require('lodash');

const findMatchingValuesInArrays = (arrayA, arrayB) =>
  _.intersection(arrayA, arrayB);


const containsElementWithProperty = (array, key, value) =>
  _.some(array, (currentTopic) => currentTopic[key] === value);

const sortArrayASC = (array, elementValueCalculatorFunction) =>
  _.sortBy(array, elementValueCalculatorFunction);

const getIndexOfValue = (array, value) => {
 for(i=0;i<array.length;i++){
    if(array[i] == value)
      return i;
  }
  return -1;
};



module.exports = {
  findMatchingValuesInArrays,
  containsElementWithProperty,
  sortArrayASC,
  getIndexOfValue
};
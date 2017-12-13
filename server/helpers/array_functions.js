const _ = require('underscore');

const findMatchingValuesInArrays = (arrayA, arrayB) => {
	return _.intersection(arrayA, arrayB);
};

const containsElementWithProperty = (array, key, value) => {
	return _.some(array, function(currentTopic) {return currentTopic[key] === value;});
};

const sortArrayASC = (array, elementValueCalculatorFunction) => {
	return _.sortBy(array, elementValueCalculatorFunction);
};

module.exports = {
    findMatchingValuesInArrays,
    containsElementWithProperty,
    sortArrayASC
};
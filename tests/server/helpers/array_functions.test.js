const array_functions = require('../../../server/helpers/array_functions');
const expect = require('expect');

describe('Array Functions Tests', () => {

    describe('#findMatchingValuesInArrays', () => {
    	const array1  = [1,2,3];
		const array2  = [4,5,6];
		const array3  = [1,2,3,4];

    	it('should return no match', (done) => {
    		var res = array_functions.findMatchingValuesInArrays(array1, array2);
    		expect(res.length).toBe(0);
    		done();
    	});

    	it('should return one match', (done) => {
    		var res = array_functions.findMatchingValuesInArrays(array2, array3);
            expect(res.length).toBe(1);
            expect(res[0]).toBe(4);
    		done();
    	});

    	it('should return three matchs', (done) => {
    		var res = array_functions.findMatchingValuesInArrays(array1, array3);
            expect(res.length).toBe(3);
    		done();
    	});
    });

    describe('#sortArrayASC', () => {
        const array = [4,3,1,2];
        const arrayWithSameValues = [2,1,2,1];

        it('should sort unique values array ASC - no special function', (done) => {
            var res = array_functions.sortArrayASC(array, (num) => {
                return num;
            });
            expect(res.length).toBe(4);
            expect(res[0]).toBe(1);
            expect(res[1]).toBe(2);
            expect(res[2]).toBe(3);
            expect(res[3]).toBe(4);
            done();
        });

        it('should sort same values array ASC - no special function', (done) => {
            var res = array_functions.sortArrayASC(arrayWithSameValues, (num) => {
                return num;
            });
            expect(res.length).toBe(4);
            expect(res[0]).toBe(1);
            expect(res[1]).toBe(1);
            expect(res[2]).toBe(2);
            expect(res[3]).toBe(2);
            done();
        });

        it('should sort array DESC - special function', (done) => {
            var res = array_functions.sortArrayASC(array, (num) => {
                return -1 * num;
            });
            expect(res.length).toBe(4);
            expect(res[0]).toBe(4);
            expect(res[1]).toBe(3);
            expect(res[2]).toBe(2);
            expect(res[3]).toBe(1);
            done();
        });
    });
    

    describe('#containsElementWithProperty', () => {
        const array = [
        {
            id: 1,
            name: "Test 1"
        },
        {
            id: 2,
            name: "Test 2"
        }];

        it('should return true - contains element with the given parameter (int type)', (done) => {
            var res = array_functions.containsElementWithProperty(array, 'id', 1);
            expect(res).toBe(true);
            done();
        });

        it('should return true - contains element with the given parameter (string type)', (done) => {
            var res = array_functions.containsElementWithProperty(array, 'name', 'Test 1');
            expect(res).toBe(true);
            done();
        });

        it('should return false - doesnt contain element with the given parameter', (done) => {
            var res = array_functions.containsElementWithProperty(array, 'id', 3);
            expect(res).toBe(false);
            done();
        });

        it('should return false - doesnt contain element with the given key', (done) => {
            var res = array_functions.containsElementWithProperty(array, 'idx', 1);
            expect(res).toBe(false);
            done();
        });
    });
});
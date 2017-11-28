const server = require('../server');

it('should succeed', () => {
    if(1 !== 1) {
        throw new Error('it should not happen');
    }
});

it('should fail', () => {
     throw new Error('it should fail');
 });
const expect = require('expect');

const { populateUsers, populatedUsers } = require('../../seed/seed');
const { User } = require('../../../server/models/user');
const {getMatchScore} = require('../../../server/logic/matcher');

describe('User Tests', () => {

    beforeEach(populateUsers);
    describe('#getMatchingResult', () => {
        it('should return 0 - hobbies defined but no match', (done) => {
        	expect(populatedUsers[0].getMatchingResult(populatedUsers[1])).toBe(getMatchScore(populatedUsers[0].hobbies, populatedUsers[1].hobbies));
        	done();
        });

        it('should return 0 - hobbies are not defined for both users', (done) => {
        	expect(populatedUsers[4].getMatchingResult(populatedUsers[5])).toBe(getMatchScore(populatedUsers[4].hobbies, populatedUsers[5].hobbies));
        	done();
        });

        it('should return 0 - hobbies are not defined for one user (caller)', (done) => {
        	expect(populatedUsers[4].getMatchingResult(populatedUsers[0])).toBe(getMatchScore(populatedUsers[0].hobbies, populatedUsers[4].hobbies));
        	done();
        });

        it('should return 0 - hobbies are not defined for one user (callee)', (done) => {
        	expect(populatedUsers[0].getMatchingResult(populatedUsers[4])).toBe(getMatchScore(populatedUsers[0].hobbies, populatedUsers[1].hobbies));
        	done();
        });

        it('should return 1 - single match', (done) => {
        	expect(populatedUsers[2].getMatchingResult(populatedUsers[3])).toBe(getMatchScore(populatedUsers[2].hobbies, populatedUsers[3].hobbies));
        	done();
        });

        it('should return 2 - multiple match', (done) => {
        	expect(populatedUsers[1].getMatchingResult(populatedUsers[3])).toBe(getMatchScore(populatedUsers[3].hobbies, populatedUsers[1].hobbies));
        	done();
        });

    });
});
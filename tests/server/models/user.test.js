const expect = require('expect');

const { populateUsers, users, apartments } = require('../../seed/seed');
const { User } = require('../../../server/models/user');
const { getMatchScore } = require('../../../server/logic/matcher');

describe('User Tests', () => {
  beforeEach(populateUsers);
  describe('#getMatchingResult', () => {
    it('should return 0 - hobbies defined but no match', (done) => {
      const user = new User(users[0]);
      expect(user.getMatchingResult(users[1])).toBe(getMatchScore(users[0].hobbies, users[1].hobbies));
      done();
    });

    it('should return 0 - hobbies are not defined for both users', (done) => {
      const user = new User(users[4]);
      expect(user.getMatchingResult(users[5])).toBe(getMatchScore(users[4].hobbies, users[5].hobbies));
      done();
    });

    it('should return 0 - hobbies are not defined for one user (caller)', (done) => {
      const user = new User(users[4]);
      expect(user.getMatchingResult(users[0])).toBe(getMatchScore(users[0].hobbies, users[4].hobbies));
      done();
    });

    it('should return 0 - hobbies are not defined for one user (callee)', (done) => {
      const user = new User(users[0]);
      expect(user.getMatchingResult(users[4])).toBe(getMatchScore(users[0].hobbies, users[1].hobbies));
      done();
    });

    it('should return 1 - single match', (done) => {
      const user = new User(users[2]);
      expect(user.getMatchingResult(users[3])).toBe(getMatchScore(users[2].hobbies, users[3].hobbies));
      done();
    });

    it('should return 2 - multiple match', (done) => {
      const user = new User(users[1]);
      expect(user.getMatchingResult(users[3])).toBe(getMatchScore(users[3].hobbies, users[1].hobbies));
      done();
    });
  });

  describe('#getBestMatchingUsers', () => {
    it('should return users in order: 2,3,1 - different score for each user', (done) => {
      const user = new User(users[3]);
      user.getBestMatchingUsers([users[0]._id, users[1]._id, users[2]._id])
        .then((res) => {
          expect(res.length).toBe(3);
          expect(res[0].email).toBe(users[1].email);
          expect(res[1].email).toBe(users[2].email);
          expect(res[2].email).toBe(users[0].email);
          done();
        }).catch(done);
    });

    it('should return no users - no one is interested', (done) => {
      const user = new User(users[3]);
      user.getBestMatchingUsers([])
        .then((res) => {
          expect(res.length).toBe(0);
          done();
        }).catch(done);
    });
  });

  describe('#isOwner', () => {
    it('should return true', (done) => {
      const user = new User(users[1]);
      expect(user.isOwner(apartments[0]._id)).toBe(true);
      done();
    });

    it('should return false', (done) => {
      const user = new User(users[3]);
      expect(user.isOwner(apartments[0]._id)).toBe(false);
      done();
    });
  });
});
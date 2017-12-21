const expect = require('expect');

const matcher = require('../../../server/logic/matcher');
const hobbie = require('../../../server/models/hobbie');

const supportedHobbies = hobbie.getSupportedHobbies();

describe('Matcher Tests', () => {
  describe('#getMatchScore', () => {
    it('should return 0 - not supported hobbies match', (done) => {
      expect(matcher.getMatchScore([-1, -2], [-1, -2])).toBe(0);
      done();
    });

    it('should return 0 - no matching hobbies', (done) => {
      expect(matcher.getMatchScore([1, 2, 3], [4, 5, 6])).toBe(0);
      done();
    });

    it('should return 1 - single value array that matches', (done) => {
      expect(matcher.getMatchScore([supportedHobbies[0]._id], [supportedHobbies[0]._id])).toBe(supportedHobbies[0].score);
      done();
    });

    it('should return 2 - part of the hobbies match', (done) => {
      expect(matcher.getMatchScore([supportedHobbies[0]._id, supportedHobbies[supportedHobbies.length - 1]._id],
        [supportedHobbies[0]._id, supportedHobbies[1]._id, supportedHobbies[supportedHobbies.length - 1]._id]))
        .toBe(supportedHobbies[0].score + supportedHobbies[supportedHobbies.length - 1].score);
      done();
    });

    it('should return 3 - all hobbies match', (done) => {
      expect(matcher.getMatchScore([supportedHobbies[0]._id, supportedHobbies[1]._id, supportedHobbies[supportedHobbies.length - 1]._id],
        [supportedHobbies[0]._id, supportedHobbies[1]._id, supportedHobbies[supportedHobbies.length - 1]._id]))
        .toBe(supportedHobbies[0].score + supportedHobbies[1].score + supportedHobbies[supportedHobbies.length - 1].score);
      done();
    });
  });
});
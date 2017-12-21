const expect = require('expect');

const hobbie = require('../../../server/models/hobbie');

const supportedHobbies = hobbie.getSupportedHobbies();

describe('Hobbie Tests', () => {
  describe('#isSupportedHobbieId', () => {
    it('should return false - not supported hobbie id', (done) => {
      expect(hobbie.isSupportedHobbieId(0)).toBe(false);
      done();
    });

    it('should return true - first hobbie id', (done) => {
      expect(hobbie.isSupportedHobbieId(supportedHobbies[0]._id)).toBe(true);
      done();
    });

    it('should return true - last hobbie id', (done) => {
      expect(hobbie.isSupportedHobbieId(supportedHobbies[supportedHobbies.length - 1]._id)).toBe(true);
      done();
    });
  });

  describe('#isSupportedHobbieName', () => {
    it('should return false - not supported hobbie name', (done) => {
      expect(hobbie.isSupportedHobbieName('test')).toBe(false);
      done();
    });

    it('should return true - first supported hobbie name', (done) => {
      expect(hobbie.isSupportedHobbieName(supportedHobbies[0].name)).toBe(true);
      done();
    });

    it('should return true - last supported hobbie name', (done) => {
      expect(hobbie.isSupportedHobbieName(supportedHobbies[supportedHobbies.length - 1].name)).toBe(true);
      done();
    });

    it('should return true - case insensetive', (done) => {
      expect(hobbie.isSupportedHobbieName(supportedHobbies[supportedHobbies.length - 1].name.toLowerCase())).toBe(true);
      done();
    });
  });

  describe('#getHobbiesScore', () => {
    it('should return 0 - empty array', (done) => {
      expect(hobbie.getHobbiesScore([])).toBe(0);
      done();
    });

    it('should return 0 - not supported hobbies', (done) => {
      expect(hobbie.getHobbiesScore([-1, -2, 0])).toBe(0);
      done();
    });

    it('should return 1 - single hobbie', (done) => {
      expect(hobbie.getHobbiesScore([supportedHobbies[supportedHobbies.length - 1]._id])).toBe(supportedHobbies[supportedHobbies.length - 1].score);
      done();
    });

    it('should return 3 - multiple hobbies', (done) => {
      expect(hobbie.getHobbiesScore([supportedHobbies[supportedHobbies.length - 1]._id, supportedHobbies[0]._id]))
        .toBe(supportedHobbies[supportedHobbies.length - 1].score + supportedHobbies[0].score);
      done();
    });
  });
});
const expect = require('expect');
const geolib = require('geolib');
const { ObjectID } = require('mongodb');

const { Apartment } = require('../../../server/models/apartment');
const {
  coords,
  populateApartments,
  populateUsers,
  apartments,
  users
} = require('../../seed/seed');

describe('Apartment Tests', () => {
  beforeEach(populateUsers);
  beforeEach(populateApartments);

  describe('#addComment Tests', () => {
    it('should add a new comment (only to the relevant one)', (done) => {
      var apartment = apartments[0];
      const userID = users[0]._id;
      const commentText = "Test comment";
      const creationTime = new Date('1-1-2018').getTime();
      apartment.addComment(userID, commentText, creationTime)
      .then((result) => {
          expect(apartment.comments.length).toBe(1);
          expect(apartment.comments[0]._createdBy).toBe(userID);
          expect(apartment.comments[0].createdAt).toBe(creationTime);
          expect(apartment.comments[0].text).toBe(commentText);
          expect(apartments[1].comments.length).toBe(0);
          done();
      }).catch(done);
    });
   });

  describe('#findInRange Tests', () => {
    it('should return no apartments', (done) => {
      Apartment.findInRange(coords.andalusiaSpain[0], coords.andalusiaSpain[1], 10)
        .then((result) => {
          expect(result.length).toBe(0);
          done();
        }).catch(done);
    });

    it('should return apartments near technion', (done) => {
      Apartment.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 1)
        .then((result) => {
          expect(result.length).toBe(1);
          result.forEach((apartment) => {
            expect(geolib.getDistance(
              {
                longitude: apartment.location.geolocation[0],
                latitude: apartment.location.geolocation[1]
              },
              {
                longitude: coords.technionIsrael[0],
                latitude: coords.technionIsrael[1]
              }
            )).toBeLessThanOrEqual(1000);
          });
          done();
        }).catch(done);
    });

    it('should return all apartments', (done) => {
      Apartment.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 150)
        .then((result) => {
          expect(result.length).toBe(2);
          done();
        }).catch(done);
    });

  });
});


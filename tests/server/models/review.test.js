const expect = require('expect');
const geolib = require('geolib');
const { ObjectID } = require('mongodb');

const { Review } = require('../../../server/models/review');
const {
    reviews,
    coords,
    populateApartments,
    populateUsers,
    populateReviews,
    apartments,
    users
} = require('../../seed/seed');

describe('Review Tests', () => {
  beforeEach(populateUsers);
  beforeEach(populateApartments);
  beforeEach(populateReviews);

  describe('#findInRange Tests', () => {
    it('should return no review', (done) => {
      Review.findInRange(coords.andalusiaSpain[0], coords.andalusiaSpain[1], 10)
        .then((result) => {
          expect(result.length).toBe(0);
          done();
        }).catch(done);
    });

    it('should return apartments near technion', (done) => {
        Review.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 1)
        .then((result) => {
          expect(result.length).toBe(2);
          result.forEach((review) => {
            expect(geolib.getDistance(
              {
                longitude: review.geolocation[0],
                latitude: review.geolocation[1]
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

    it('should return all reviews', (done) => {
      Review.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 150)
        .then((result) => {
          expect(result.length).toBe(2);
          done();
        }).catch(done);
    });

  });
});


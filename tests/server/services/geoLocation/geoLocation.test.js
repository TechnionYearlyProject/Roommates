const expect = require('expect');
const geolib = require('geolib');
const sleep = require('system-sleep');

const geoLocation = require('../../../../server/services/geoLocation/geoLocation');
const { apartments, coords } = require('../../../seed/seed');


describe('geoLocation Tests', () => {
  describe('#locateLocation', () => {
    it('should return correct geo-location for the given address', (done) => {
      geoLocation.getGeoLocation(apartments[0].getAddressString())
        .then((result) => {
          expect(result.length).toBe(1);
          expect(geolib.getDistance(
            {
              longitude: apartments[0].location.geolocation[0],
              latitude: apartments[0].location.geolocation[1]
            },
            {
              longitude: result[0].longitude,
              latitude: result[0].latitude
            }
          )).toBeLessThanOrEqual(150);
          done();
        }).catch(done);
    }).timeout(5000);

    it('should return correct geo-location for a given place', (done) => {
      geoLocation.getGeoLocation('Technion Israel')
        .then((result) => {
          expect(result.length).toBe(1);
          expect(geolib.getDistance(
            {
              longitude: coords.technionIsrael[0],
              latitude: coords.technionIsrael[1]
            },
            {
              longitude: result[0].longitude,
              latitude: result[0].latitude
            })).toBeLessThanOrEqual(500);
          done();
        }).catch(done);
    }).timeout(5000);
  });
});


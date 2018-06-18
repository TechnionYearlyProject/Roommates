const expect = require('expect');
const geolib = require('geolib');

const { Apartment } = require('../../../server/models/apartment');
const { memberStatus, groupStatus } = require('../../../server/models/group');
const {
  coords,
  populateApartments,
  populateUsers,
  apartments
} = require('../../seed/seed');

describe('Apartment Tests', () => {
  beforeEach(populateUsers);
  beforeEach(populateApartments);

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
          expect(result.length).toBe(3);
          done();
        }).catch(done);
    });
  });

  describe('#updateMemberStatus Tests', () => {
    it('should keep group declined invariant', async () => {
      let apartment = await Apartment.findById(apartments[2]._id);
      apartment = await apartment.updateMemberStatus(apartments[2].groups[1]._id, apartments[2].groups[1].members[0].id, memberStatus.DECLINED);
      expect(apartment.groups[1].status).toBe(groupStatus.DECLINED);
    });
    it('should keep group accepted invariant', async () => {
      let apartment = await Apartment.findById(apartments[2]._id);
      apartment = await apartment.updateMemberStatus(apartments[2].groups[0]._id, apartments[2].groups[0].members[0].id, memberStatus.ACCEPTED);
      expect(apartment.groups[0].status).toBe(groupStatus.ACCEPTED);
    });
    it('should not change group status to accepted when some members have not accepted', async () => {
      let apartment = await Apartment.findById(apartments[2]._id);
      apartment = await apartment.updateMemberStatus(apartments[2].groups[1]._id, apartments[2].groups[1].members[0].id, memberStatus.ACCEPTED);
      expect(apartment.groups[1].status).toBe(groupStatus.PENDING);
    });
  });
});


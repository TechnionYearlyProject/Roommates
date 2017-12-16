const expect = require('expect');
const geolib = require('geolib');

const {coords, populateApartments, populateUsers, populatedUsers, apartments} = require('../../seed/seed');
const {Apartment} = require('../../../server/models/apartment');

beforeEach(populateApartments);

describe('Apartment Tests', () => {

	beforeEach(populateUsers);
	beforeEach(populateApartments);

	describe('#findInRange Tests', () => {
		it('should return no apartments', (done) => {
			Apartment.findInRange(coords.andalusiaSpain[0], coords.andalusiaSpain[1], 10)
			.then( (result) => {
				expect(result.length).toBe(0);
				done();
			}).catch(done);
		});

		it('should return apartments near technion', (done) => {
			
			Apartment.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 1)
			.then( (result) => {
				expect(result.length).toBe(1);
				result.forEach( (apartment) => {
					expect(geolib.getDistance({
							longitude: apartment.location.geolocation[0],
							latitude: apartment.location.geolocation[1]
						}, {
							longitude: coords.technionIsrael[0],
							latitude: coords.technionIsrael[1]
						})).toBeLessThanOrEqual(1000);
				});
				done();
			}).catch(done);
		});

		it('should return all apartments', (done) => {	
			Apartment.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 150)
			.then( (result) => {
				expect(result.length).toBe(2);
				done();
			}).catch(done);
		});
	});

	describe('#getInterestedUsersSortedssByMatching', () => {
		it('should return users in order: 2,3,1 - different score for each user', (done) => {
			var currUser = populatedUsers[3];
			var curApartment = apartments[0];
			curApartment.getInterestedUsersSortedByMatching(currUser).then( (res)=>{
				expect(res.length).toBe(3);
				expect(res[0].email).toBe(populatedUsers[1].email);
				expect(res[1].email).toBe(populatedUsers[2].email);
				expect(res[2].email).toBe(populatedUsers[0].email);
				done();
			});		
		});

		it('should return no users - no one is interested', (done) => {
			var currUser = populatedUsers[3];
			var curApartment = apartments[1];
			curApartment.getInterestedUsersSortedByMatching(currUser).then( (res)=>{
				expect(res.length).toBe(0);
				done();
			});
			
		});
	});


});


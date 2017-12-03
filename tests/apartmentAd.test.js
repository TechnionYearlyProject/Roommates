const expect = require('expect');
const geolib = require('geolib');

const {apartments, coords, populateApartments} = require('./utils/utils');
const {ApartmentAd} = require('../server/models/apartmentAd');


describe ('ApartmentAd Tests', () => {

	beforeEach(populateApartments);

	describe('#findInRange Tests', () => {
		it('should return no apartments', (done) => {
			ApartmentAd.findInRange(coords.andalusiaSpain[0], coords.andalusiaSpain[1], 10)
			.then( (result) => {
				expect(result.length).toBe(0);
				done();
			}).catch(done);
		});

		it('should return apartments near technion', (done) => {
			
			ApartmentAd.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 1)
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
			ApartmentAd.findInRange(coords.technionIsrael[0], coords.technionIsrael[1], 150)
			.then( (result) => {
				expect(result.length).toBe(2);
				done();
			}).catch(done);
		});
	});


});


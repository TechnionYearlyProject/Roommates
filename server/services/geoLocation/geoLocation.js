const NodeGeocoder = require('node-geocoder');
var geoLocationConfig = require('./geoLocation-config.json');

const geoService = NodeGeocoder(geoLocationConfig['GEO_LOCATION_PROVIDER']);

//Get geo-location data for the given address (e.g '13 gilboa haifa israel'), returns a promise.
const getGeoLocation = (location) => {
	return geoService.geocode(location);
};

const getGeoLocationCoords = (location) => {
	return getGeoLocation(location)
		.then((res) => {
			if (res.length !== 0) {
				return [res[0].longitude, res[0].latitude];
			} else {
				return undefined;
			}
		});
}

module.exports = {
	getGeoLocation,
	getGeoLocationCoords
};

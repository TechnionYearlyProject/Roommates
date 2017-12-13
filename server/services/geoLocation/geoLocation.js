const NodeGeocoder = require('node-geocoder');

const geoService = NodeGeocoder(process.env.GEO_LOCATION_PROVIDER_CONFIG);

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
				return [-148.000000, -76.300003];
			}
		});
}

module.exports = {
	getGeoLocation,
	getGeoLocationCoords
};

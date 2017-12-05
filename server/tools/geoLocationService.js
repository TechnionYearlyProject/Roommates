const NodeGeocoder = require('node-geocoder');
 
const geoService = NodeGeocoder(process.env.GEO_LOCATION_PROVIDER_CONFIG);

//Get geo-location data for the given address (e.g '13 gilboa haifa israel'), returns a promise.
var getGeoLocation = (location) => {
	return geoService.geocode(location);
};

module.exports = {
	getGeoLocation
};

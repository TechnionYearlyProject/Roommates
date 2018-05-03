const NodeGeocoder = require('node-geocoder');
const geoLocationConfig = require('./geoLocation-config.json');

const geoService = NodeGeocoder(geoLocationConfig['GEO_LOCATION_PROVIDER']);

//Get geo-location data for the given address (e.g '13 gilboa haifa israel'), returns a promise.
const getGeoLocation = location => geoService.geocode(location);

const getGeoLocationCoords = location =>
  getGeoLocation(location).then(res => {
    if (res.length === 0) {
      return undefined;
    }
    return [res[0].longitude, res[0].latitude];
  });

module.exports = {
  getGeoLocation,
  getGeoLocationCoords
};

/* eslint-disable */
/**
 * @author: Alon Talmor
 * @date: 21/10/18
 *
 * Sets up Google Maps API.
 */
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

const key = 'AIzaSyDYgHuU7KBZPGMvBZi7lMVtVnPdWYeGwLk';
const libraries = 'places';
const language = 'en';

export default {
  install(Vue, options) {

    Vue.use(VueGoogleMaps, {
      load: {
        key,
        libraries,
        language,
      },
    });

    /**
     * @author: Alon Talmor
     * @date: 21/10/18
     *
     * Set an input element a Google Maps Autocomplete.
     *
     * @param {DOM Object} ref - this needs to be the DOM element we want to set autocomplete to
     * @param {Array of String} types - the type of the input (geocode, address, (cities), (region))
     * @param {String or Array of String} countries - the country we want to look in
     */
    Vue.prototype.$setAutocomplete = function (ref, types, countries) {
      VueGoogleMaps.loaded.then(() => {
        if (!ref) {
          return;
        }
        const input = ref.$refs.input;
        ref.autocomplete =
          new google.maps.places.Autocomplete(input, {
            types: types || ['geocode'],
            componentRestrictions: {
              country: countries || 'IL'
            }
          });
        input.setAttribute('placeholder', ''); //remove the the default google maps placeholder

        ref.autocomplete.addListener('place_changed', () => {
          const place = ref.autocomplete.getPlace();

          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            ref.$emit('no-results-found', place);
            return;
          }
          const addressComponents = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name',
          };

          const returnData = {};
          if (place.address_components !== undefined) {
            // Get each component of the address from the place details
            for (let i = 0; i < place.address_components.length; i += 1) {
              const addressType = place.address_components[i].types[0];

              if (addressComponents[addressType]) {
                const val = place.address_components[i][addressComponents[addressType]];
                returnData[addressType] = val;
              }
            }

            returnData.latitude = place.geometry.location.lat();
            returnData.longitude = place.geometry.location.lng();
            returnData.full_name = `${(place.name && place.name !== returnData.route)? `${place.name} ` : ''}${returnData.route || ''}${returnData.street_number ? ` ${returnData.street_number}` : ''}`+
                                   `${returnData.locality? ` ${returnData.locality}` : ''}${returnData.country? `, ${returnData.country}` : ''}`;
            // update autocompleteText then emit change event
            ref.autocompleteText = returnData.full_name;

            // return returnData object and PlaceResult object
            ref.$emit('placechanged', returnData, place);
          }
        });
      });
    };
  }
}
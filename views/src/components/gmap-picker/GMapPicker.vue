<template>
    <b-form @submit.prevent>
        <gmap-map ref="map"
                  :center="location"
                  :zoom="15"
                  class="map">
            <div slot="visible" class="map-input">
                <gmap-autocomplete ref="input"
                                   class="form-control box" :value="value.name"
                                   placeholder="Enter Location..."
                                   @place_changed="onPlaceChange"
                />
            </div>

            <gmap-marker :visible="true"
                         :position="location" />
        </gmap-map>
    </b-form>
</template>

<script>
    import Vue from 'vue'
    import * as VueGoogleMaps from 'vue2-google-maps'

    import bForm from 'bootstrap-vue/es/components/form/form'

    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyDYgHuU7KBZPGMvBZi7lMVtVnPdWYeGwLk',
            libraries: 'places'
        }
    });

    export default {
        name: "g-map-picker",
        components: {
            bForm
        },
        props: ['value'],
        data() {
            return {
                place: null,
                defaultLocation: {
                    lat: this.value.lat,
                    lng: this.value.lng
                }
            }
        },
        computed: {
            location() {
                if (!this.place) {
                    return this.defaultLocation;
                }

                if (this.place.geometry.viewport) {
                    this.$refs.map.fitBounds(this.place.geometry.viewport);
                }

                return {
                    lat: this.place.geometry.location.lat(),
                    lng: this.place.geometry.location.lng()
                };
            }
        },
        methods: {
            onPlaceChange(place) {
                this.place = place;

                this.$emit('input', {
                    name: place.name,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
            }
        }
    }
</script>

<style scoped>
    .map {
        width: 100%;
        height: 400px;
    }

    .map-input {
        position: absolute;
        z-index: 5;
        top: 10px;
        left: 0;
        right: 0;
        text-align: center;
    }

    .form-control {
        width: 45%;
        display: inline-block;
        border-radius: 1px;
        font-size: 11px;
        padding: 5px;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    }
</style>
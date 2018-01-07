<template>
    <div>
        <gmap-map :center="{lat: 10.0, lng: 10.0}"
                  :zoom="7"
                  class="map">
        </gmap-map>
    </div>
</template>

<script>
    import * as VueGoogleMaps from 'vue2-google-maps'
    import Vue from 'vue'

    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyDYgHuU7KBZPGMvBZi7lMVtVnPdWYeGwLk',
            libraries: 'places'
        }
    });

    export default {
        name: "g-map-picker"
    }
</script>

<style scoped>
    .map {
        width: 100%;
        height: 400px;
    }
</style>
<template>
  <div>
    <v-layout row justify-center>
      <!-- <v-btn color="primary" dark @click.stop="value = true">Open Dialog</v-btn> -->
      <v-dialog v-model="value" :max-width="maxWidth" transition="slide-x-transition">
        <v-card>
          <v-card-title class="py-0">
            <div v-if="allowSearch">
              <v-text-field class="pt-4" ref="search" placeholder='Search a location' prepend-icon="place" @placechanged="setCenter" single-line/>
              <v-btn color="primary" @click="setPlace">Search
                <v-icon right>search</v-icon>
              </v-btn>
            </div>
            <v-spacer />
            <v-btn icon slot="activator" @click.stop="closeDialog" class="text-xs-right">
              <v-icon>close</v-icon>
            </v-btn>

          </v-card-title>
          <v-card-actions>
            <gmap-map :center="mid" :zoom="zoom" map-type-id="roadmap" :style="{width: '100%', height: height}">

              <GmapMarker :position="mainMarker" />
              <GmapMarker v-for="(marker, i) in markers" :key="`marker-${i}`" :position="marker.position" :clickable="marker.clickable" :draggable="marker.draggable" @click="setCenter(marker.position)" />
            </gmap-map>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    props: {
      maxWidth: {
        type: String,
        default: '1000px'
      },
      height: {
        type: String,
        default: '500px'
      },
      center: {
        type: Object,
        default: () => {
          return {
            lat: 32.7825085,
            lng: 35.0157237
          };
        }
      },
      zoom: {
        type: Number,
        default: 15
      },
      markers: {
        type: Array,
        default: () => []
      },
      allowSearch: {
        type: Boolean,
        default: true
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        mid: null,
        mainMarker: null
      };
    },
    methods: {
      setCenter(position) {
        this.mid = position;
        this.mainMarker = position;
      },
      setPlace(data) {
        console.log(data);
        this.setCenter({
          lng: data.longitude,
          lat: data.latitude
        });
        this.$emit('placeUpdated', data);
      },
      search() {
        this.setPlace(this.value);
        this.closeDialog();
      },
      closeDialog() {
        this.$emit('placeUpdated', false);
      }
    },
    created() {
      this.setCenter(this.center);
    },
    mounted() {
      this.$setAutocomplete(this.$refs.search);
    }
  };
</script>

<style>

</style>

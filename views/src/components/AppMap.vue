<template>
    <div>
        <v-layout row justify-center>
            <v-dialog :value="value" @input="closeDialog" :max-width="maxWidth" transition="slide-x-transition">
                <v-card>
                    <v-card-title class="py-0">
                        <template v-if="allowSearch">
                            <v-text-field class="pt-4" v-model="address" ref="search" :placeholder="'Search a location'" prepend-icon="place" @placechanged="setPlace" single-line/>
                            <v-btn color="primary" @click="emitSearch">Search
                                <v-icon right>search</v-icon>
                            </v-btn>
                        </template>
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
        input: {
          type: String,
          default: null
        },
        center: {
          type: Object
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
          default: false
        },
        value: {
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          mid: null,
          mainMarker: null,
          defaultCenter: {
            latitude: 32.7825085,
            longitude: 35.0157237
          },
          address: null
        };
      },
      methods: {
        setCenter(data) {
          this.mid = {
            lng: data.longitude,
            lat: data.latitude
          };
          this.mainMarker = this.mid;
        },
        setPlace(data) {
          this.setCenter(data);
          this.address = data.full_name;
        },
        closeDialog() {
          this.$emit('input', false);
        },
        emitSearch() {
          this.$emit('placeUpdated', {
            full_name: this.address,
            longitude: this.mid.lng,
            latitude: this.mid.lat
          });
          this.closeDialog();
        }
      },
      created() {
        this.setCenter(this.center || this.defaultCenter);
        this.address = this.input;
      },
      mounted() {
        this.$setAutocomplete(this.$refs.search);
      }
    };
</script>

<style>

</style>

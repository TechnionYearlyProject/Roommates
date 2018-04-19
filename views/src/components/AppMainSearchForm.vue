// not in use atm
<template>
  <v-card flat color="grey lighten-4" class="mb-5 elevation-1">
    <v-toolbar flat dark extended :extension-height="5">
      <v-container pa-0 fill-height fluid>
        <v-layout flex align-center justify-center>
          <v-container fill-height>
            <v-text-field v-model="payload.address" label="Search" :prepend-icon="'place'" :prepend-icon-cb="openMap" :append-icon="'search'" :append-icon-cb="search"  color="secondary" single-line hide-details>
            </v-text-field>
            <!-- <v-speed-dial v-model="settings" class="ma-0">
        <v-btn slot="activator" v-model="settings" fab icon @click.native="extendSearch = !extendSearch">
          <v-icon color="secondary">settings</v-icon>
          <v-icon color="secondary">settings</v-icon>
        </v-btn>
      </v-speed-dial> -->
          </v-container>
        </v-layout>
      </v-container>
      <!-- <v-flex>
        <v-btn color="secondary" dark big absolute bottom right fab>
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex> -->
    </v-toolbar>
    <!-- <v-slide-y-transition>
      <v-card-text v-show="extendSearch">
        <v-layout wrap row mt-3>
          <v-flex xs12 sm4>
            <app-calendar-form @dateUpdated="payload.latestEntranceDate = $event" label="Enterance Date"></app-calendar-form>
          </v-flex>
          <v-flex xs12 sm4 v-for="(slider,i) in sliders" :key="`slider-${i}`">
            <v-slider :label="slider.label" v-model="payload[slider.ref]" thumb-label :step="slider.interval" :min="slider.value.min" :max="slider.value.max" ticks></v-slider>
          </v-flex>
        </v-layout>

      </v-card-text>
    </v-slide-y-transition> -->
  </v-card>
</template>

<script>
  import AppCalendarForm from './AppCalendarForm';

  export default {
    data() {
      return {
        payload: {
          address: null,
          price: 1500,
          radius: 10,
          maxRoommates: 3,
          maxFloor: 3,
          latestEntranceDate: null
        },
        settings: false,
        extendSearch: false,
        sliders: [
          {
            label: 'Price (₪)',
            interval: 100,
            value: {
              min: 0,
              max: 1000
            },
            ref: 'price'
          },
          {
            label: 'Max Distance (km)',
            interval: 2,
            value: {
              min: 1,
              max: 200
            },
            ref: 'radius'
          },
          {
            label: 'Roommates',
            interval: 1,
            value: {
              min: 1,
              max: 11
            },
            ref: 'maxRoommates'
          },
          {
            label: 'Floor',
            interval: 1,
            value: {
              min: -10,
              max: 100
            },
            ref: 'maxFloor'
          }
        ],
        gradient: `${this.$vuetify.theme.primary}, #fafafa`
      };
    },
    methods: {
      openMap() {
        // eslint-disable-next-line
        alert('open map');
      },
      search() {
        // eslint-disable-next-line
        alert('search');
      }
    },
    components: {
      AppCalendarForm
    }
  };
</script>

<style scoped>

</style>

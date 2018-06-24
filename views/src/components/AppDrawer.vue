<template>
  <v-navigation-drawer fixed clipped class="grey lighten-4" app v-model="drawer">
    <v-text-field v-model="payload.address" ref="search" label='Search by address' autofocus :prepend-icon="placeIcon" :append-icon="searchIcon" :prepend-icon-cb="openMap" :append-icon-cb="search" @keyup.enter="search" @placechanged="setAddress"></v-text-field>
    <app-map v-model="showMap" :input="payload.address" :center="center" @placeUpdated="setAddress($event);search()" allow-search></app-map>
    <v-list dense>
      <v-subheader>
        Filters
      </v-subheader>

      <v-layout row wrap>
        <v-flex xs12>
          <v-list-tile>
            <v-list-tile-action>
              Entrance date
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                <div class="text-xs-right">{{ formatedDate || 'not selected' }}</div>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-flex>
        <v-flex offset-xs1 xs12>
          <v-menu ref="menu" lazy v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="date">
            <v-btn small outline color="secondary" slot="activator" style="width:85%">
              <v-icon>event</v-icon>
            </v-btn>
            <v-date-picker color="secondary" type="month" v-model="payload.entranceDate" no-title>
            </v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>

      <div v-for="(slider,i) in sliders" :key="`slider-${i}`">
        <v-layout row wrap>
          <v-flex xs12>

            <v-list-tile>
              <v-list-tile-action>
                <div>
                  <span style="float: left; margin-top: 5px; margin-right: 20px;">
                    {{ slider.label }}
                  </span>
                    <div style="float: left">
                      <v-switch v-if="slider.label === 'Floor'" v-model="floorEnabled"></v-switch>
                    </div>
                </div>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="grey--text">
                  <div class="text-xs-right">{{ formatedValue(payload[slider.ref]) }}</div>
                </v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
          </v-flex>
          <v-flex offset-xs1 xs10>
            <!-- <v-slider class="pa-0" hide-details color="secondary" v-model="payload[slider.ref]" :step="slider.interval" :min="slider.value.min" :max="slider.value.max" ticks thumb-label></v-slider> -->
            <vue-slider :disabled="slider.label === 'Floor' && !floorEnabled" :processStyle="{backgroundColor: $vuetify.theme.secondary}" :tooltipStyle="{backgroundColor: $vuetify.theme.primary, borderColor: $vuetify.theme.primary}" :min="slider.value.min" :max="slider.value.max" :interval="slider.interval" tooltip="hover" v-model="payload[slider.ref]" :debug="false"></vue-slider>
          </v-flex>
        </v-layout>
      </div>
      <br>
      <v-divider></v-divider>
      <v-subheader>
        More Details
      </v-subheader>

      <div v-for="(tag,i) in allTags" :key="`tag-${i}`">
        <v-layout row wrap>
          <v-flex xs12>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>{{ tag.vicon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-action>
                {{ tag.name }}
              </v-list-tile-action>
              <v-list-tile-content></v-list-tile-content>
              <v-list-tile-action>
                <v-checkbox v-model="payload.tags" :value="tag.key" color="secondary" />
                <!-- <v-list-tile-title class="grey--text">
                                    <div class="text-xs-right">{{ formatedValue(payload[slider.ref]) }}</div>
                                </v-list-tile-title> -->
              </v-list-tile-action>

            </v-list-tile>
          </v-flex>
        </v-layout>
      </div>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import vueSlider from 'vue-slider-component';
  import AppCalendarForm from './sub-components/AppCalendarForm';
  import AppMap from './Maps/AppMap';
  import tags from '../assets/tags';

  export default {
    data() {
      return {
        value: [5, 8],
        floorEnabled: true,
        payload: {
          address: null,
          geolocation: null,
          price: [0, 10000],
          radius: 10,
          roommates: [1, 3],
          floor: [1, 20],
          entranceDate: null,
          tags: []
        },
        sliders: [
          {
            label: 'Price (₪)',
            interval: 100,
            value: {
              min: 0,
              max: 10000
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
            ref: 'roommates'
          },
          {
            label: 'Floor',
            interval: 1,
            value: {
              min: -10,
              max: 100
            },
            ref: 'floor'
          }
        ],
        menu: false,
        date: null,
        placeIcon: 'place',
        searchIcon: 'search',
        allTags: tags,
        showMap: false
      };
    },
    methods: {
      ...mapMutations(['toggleDrawer']),
      search() {
        this.$emit('search', this.floorEnabled ? this.payload : { ...this.payload, floor: null });
        /* for futer use:
        *** this code will save searchs to DB
        *** for new apartment notification
        *** only thing left is to call GET /searchs/toNotify
        *** once a day.
        *** for this to work need to add request to
        *** mapMutations(['isAuthenticated', 'isVerified', 'getUser'])
        *** and also include axios
        if (this.isAuthenticated && this.isVerified && p.entranceDate) {
          if (p.geolocation || p.address) {
            p.createdBy = this.getUser._id;
            axios.post('http://localhost:3000/searchs', p);
          }
        }*/
      },
      openMap() {
        this.showMap = true;
      },
      formatedValue(value) {
        return Array.isArray(value) ? `${value[0]}-${value[1]}` : value;
      },
      setAddress(data) {
        this.payload.address = data.full_name;
        this.payload.geolocation = [data.longitude, data.latitude];
      }
    },
    computed: {
      ...mapGetters(['getDrawerStatus']),
      drawer: {
        get() {
          return this.getDrawerStatus;
        },
        set(v) {
          this.toggleDrawer(v);
        }
      },
      center() {
        if (!this.payload.geolocation) {
          return null;
        }
        return { longitude: this.payload.geolocation[0], latitude: this.payload.geolocation[1] };
      },
      formatedDate() {
        if (!this.payload.entranceDate) {
          return null;
        }
        const [year, month] = this.payload.entranceDate.split('-');
        return `${month}-${year}`;
      }
    },
    mounted() {
      this.$setAutocomplete(this.$refs.search);
    },
    components: {
      AppCalendarForm,
      vueSlider,
      AppMap
    }
  };
</script>

<style>

</style>

<template>
  <v-container>
    <v-stepper v-model="e6" vertical>
      <h3 class="headline secondary--text ma-4">Advertise</h3>
      <v-divider></v-divider>
      <v-stepper-step step="1" :complete="e6 > 1" :rules="rules1">
        Main details
        <small>The most important stuff!</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card :color="color" class="mb-1">

          <v-container fluid grid-list-md>
            <v-layout wrap row>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Address'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field ref="address" v-model="payload.street" @placechanged="setAddress" label="Street and City" prepend-icon="map" single-line :rules="rules.address" validate-on-blur clearable required></v-text-field>
              </v-flex>

              <v-flex xs12 sm12 offset-xs1 md2 offset-md0>
                <v-text-field ref="number" v-model="payload.number" label="Street Number" type="number" mask="###" single-line :rules="rules.number" validate-on-blur required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 offset-xs1 md2 offset-md0>
                <v-text-field v-model="payload.apartmentNumber" label="Apartment Number" type="number" mask="###" single-line></v-text-field>
              </v-flex>

            </v-layout>
            <v-layout wrap row>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Price'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field ref="price" v-model="payload.price" label="" mask="#######" prepend-icon="toll" prefix="$" suffix="per month" single-line :rules="rules.price" validate-on-blur required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>

              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-subheader>Number of roommates I'm looking for*</v-subheader>
              </v-flex>

              <v-flex xs12 sm12 md3>
                <v-slider v-model="requiredRoommatesSlider" label="" thumb-label step="1" min="0" max="10" ticks required></v-slider>
              </v-flex>
              <v-flex xs12 sm12 md2 order-sm2 order-md1>
                <v-subheader v-text="'Entrance date'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3 order-sm2 order-md1>
                <app-calendar-form @dateUpdated="payload.entranceDate = $event" label="when" single-line validate-on-blur required />
              </v-flex>
              <v-flex xs12 sm12 md1 order-md2>
              </v-flex>
              <v-flex xs12 sm12 md3 order-sm1 order-md2>
                <v-subheader>Total number of roommates</v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3 order-sm1 order-md2>
                <v-slider v-model="payload.totalRoommates" label="" thumb-label step="1" min="0" max="11" ticks required></v-slider>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-btn color="primary" @click.native="e6 = 2;">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>

      </v-stepper-content>
      <v-stepper-step step="2" :complete="e6 > 2">Nice to know</v-stepper-step>
      <v-stepper-content step="2">
        <v-card :color="color" class="mb-1" height="auto">
          <v-container fluid grid-list-md>
            <v-layout wrap row>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Floor'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="floorSlider" label="" type="number" prepend-icon="" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Total floors'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.totalFloors" label="" type="number" prepend-icon="" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Number of rooms'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.numberOfRooms" label="" mask="#####" prepend-icon="" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'size'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.area" label="" mask="#####" prepend-icon="" suffix="square meters" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12>
                <v-flex xs12>
                  <v-subheader v-text="'Write a short description to attract more people'"></v-subheader>
                </v-flex>
                <v-text-field textarea v-model="payload.description" label="Start writing..." single-line></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

        </v-card>
        <v-btn outline @click.native="e6 = 1">
          <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
        <v-btn color="primary" @click.native="e6 = 3">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step step="3" :complete="e6 > 3">Select an ad format and name ad unit</v-stepper-step>
      <v-stepper-content step="3">
        <v-card :color="color" class="mb-1" height="auto">
          <template>
            <v-container fluid grid-list-md>
              <v-layout wrap row>
                <v-flex xs12 sm6 md4 v-for="tag in tags" :key="tag.key">
                  <v-checkbox :label="tag.name" :prepend-icon="tag.vicon" :value="tag.number" v-model="payload.tags"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </template>
        </v-card>

        <v-btn outline @click.native="e6 = 2">
          <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
        <v-btn color="primary" @click.native="e6 = 4">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step step="4">Upload some images</v-stepper-step>
      <v-stepper-content step="4">
        <v-card :color="color" class="mb-5 pa-3" height="auto" style="min-height: 300px">
          <app-uploader v-model="files" fileType="image/*"></app-uploader>
        </v-card>
        <v-layout class="pb-1">
          <v-btn outline @click.native="e6 = 3">
            <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
          <v-spacer/>
          <v-btn block @click.native="submit" color="secondary" slot="activator">
            Advertise Now
            <v-icon right>send</v-icon>
          </v-btn>
        </v-layout>

      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import AppCalendarForm from './sub-components/AppCalendarForm';
  import AppUploader from './sub-components/AppUploader';
  import tagsList from '../assets/tags';

  export default {
    data() {
      return {
        payload: {
          city: null,
          street: null,
          number: null,
          apartmentNumber: null,

          price: null,
          entranceDate: null,
          requiredRoommates: 1,
          totalRoommates: 2,
          floor: 2,
          totalFloors: 3,
          numberOfRooms: 4,
          area: null,
          description: '',

          tags: []
        },
        files: [],
        rules: {
          address: [
            () => !!this.payload.city || "Asset's address is required",
            () => !!this.payload.street || "Asset's address is required",
            () =>
              (this.payload.city && this.payload.city.length > 0) ||
              "Asset's address is required",
            () =>
              (this.payload.street && this.payload.street.length > 0) ||
              "Asset's address is required"
          ],
          number: [() => !!this.payload.number || "Asset's number is required"],
          price: [() => !!this.payload.price || 'Price is required'],
          entranceDate: !![
            () => this.payload.entranceDate || 'Entrance date is required'
          ]
        },
        requiredRoommatesSlider: 1,
        floorSlider: 2,
        e6: 1,
        color: 'grey lighten-5',
        tags: tagsList,
        countries: ['IL'],
        types: 'address'
      };
    },
    methods: {
      submit() {
        // eslint-disable-next-line
        alert('submitted');
      },
      setAddress(data) {
        this.payload.city = data.locality;
        this.payload.street = data.route;
      }
    },
    computed: {
      rules1() {
        return this.e6 === 1
          ? [() => true]
          : [() => this.payload.city !== null,
            () => this.payload.street !== null,
            () => this.payload.number !== null,
            () => this.payload.price !== null];
      }
    },
    watch: {
      requiredRoommatesSlide(val) {
        this.payload.requiredRoommates = val;
        this.payload.totalRoommates =
          val > this.payload.totalRoommates ? val : this.payload.totalRoommates;
      },
      floorSlider(val) {
        this.payload.floor = val;
        this.payload.totalFloors =
          val > this.payload.totalFloors ? val : this.payload.totalFloors;
      }
    },
    mounted() {
      this.$setAutocomplete(this.$refs.address, ['address']);
    },
    components: {
      AppCalendarForm,
      AppUploader
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

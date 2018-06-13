<template>
<v-container fluid>
    <v-stepper v-model="e6" vertical>
        <v-stepper-step step="1" :complete="e6 > 1">
            Main details
            <small>The most important stuff!</small>
        </v-stepper-step>
        <v-stepper-content step="1">
            <v-card :color="color">

                <v-container fluid grid-list-md>
                    <v-layout wrap row>
                        <v-flex xs12 sm12 md2>
                            <v-subheader v-text="'Address'"></v-subheader>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-select :items="cities" v-model="payload.city" label="City" prepend-icon="map" autocomplete single-line required></v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field v-model="payload.street" label="Street" single-line required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md2>
                            <v-text-field v-model="payload.number" label="Street Number" mask="###" single-line required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md2>
                            <v-text-field v-model="payload.apartmentNumber" label="Apartment Number" mask="###" single-line></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap row>
                        <v-flex xs12 sm12 md2>
                            <v-subheader v-text="'Price'"></v-subheader>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field v-model="payload.price" label="" mask="#######" prepend-icon="toll" prefix="$" suffix="per month" single-line required></v-text-field>
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
                            <app-calendar-form @dateUpdated="payload.brithdate = $event" label="when" single-line required />
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
                    <v-layout wrap row>
                        <v-flex xs12 sm12 md2>
                            <v-subheader v-text="'Upload Images'"></v-subheader>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
            <v-btn color="primary" @click.native="e6 = 2">Continue</v-btn>

        </v-stepper-content>
        <v-stepper-step step="2" :complete="e6 > 2">Nice to know</v-stepper-step>
        <v-stepper-content step="2">
            <v-card :color="color" class="mb-5" height="auto">
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
                    </v-layout>
                    <v-layout>
                        <v-flex xs12>
                            <v-text-field multi-line v-model="payload.description" label="Write a short description to attract more people" single-line></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>

            </v-card>
            <v-btn color="primary" @click.native="e6 = 3">Continue</v-btn>
            <v-btn flat @click.native="e6 = 1">Return</v-btn>
        </v-stepper-content>

        <v-stepper-step step="3" :complete="e6 > 3">Select an ad format and name ad unit</v-stepper-step>
        <v-stepper-content step="3">
            <v-card :color="color" class="mb-5" height="auto">
                <template>
                    <v-container fluid grid-list-md>
                        <v-layout wrap row>
                            <v-flex xs12 sm6 md4 v-for="tag in tags" :key="tag.key">
                                <v-checkbox :label="tag.name" :value="tag.number" v-model="payload.tags"></v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </template>
            </v-card>

            <v-btn color="primary" @click.native="e6 = 4">Continue</v-btn>
            <v-btn flat @click.native="e6 = 2">Return</v-btn>
        </v-stepper-content>

        <v-stepper-step step="4">View setup instructions</v-stepper-step>
        <v-stepper-content step="4">
            <v-card color="grey lighten-1" class="mb-5" height="auto">

            </v-card>
            <v-layout class="pb-1">
                <v-btn flat @click.native="e6 = 3">Return</v-btn>
                <v-spacer></v-spacer>
                <div class="text-xs-center">
                    <v-tooltip left>
                        <v-btn fab dark @click.native="submit" color="primary" slot="activator">
                            <v-icon dark>add</v-icon>
                        </v-btn>
                        <span>Publish!</span>
                    </v-tooltip>
                </div>
            </v-layout>

        </v-stepper-content>
    </v-stepper>
</v-container>
</template>

<script>
    import AppCalendarForm from './AppCalendarForm';
    import citiesList from '../assets/israel-cities.json';
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
            brithdate: null,
            requiredRoommates: 1,
            totalRoommates: 2,
            floor: 2,
            totalFloors: 3,
            numberOfRooms: 4,
            area: null,
            description: '',

            tags: []
          },
          requiredRoommatesSlider: 1,
          floorSlider: 2,
          e6: 1,
          color: 'grey lighten-5',
          cities: [],
          tags: []
        };
      },
      methods: {
        submit() {
          alert('submitted');
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
        this.cities = citiesList.map(x => x.english_name);
        this.tags = tagsList;
      },
      components: {
        AppCalendarForm
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

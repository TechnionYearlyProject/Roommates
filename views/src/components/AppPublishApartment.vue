<template>
  <v-container>
    <v-stepper v-model="e6" vertical>
      <h3 class="headline secondary--text ma-4">Advertise</h3>
      <v-divider></v-divider>
      <v-stepper-step ref="step1" step="1" :complete="e6 > 1" :rules="step1Rules">
        Main details
        <small>The most important stuff!</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card :color="color" class="mb-1">

          <v-form v-model="valid" ref="form" lazy-validation>
            <v-container fluid grid-list-md>
              <v-layout wrap row>
                <v-flex xs12 sm12 md2>
                  <v-subheader v-text="'Address'"></v-subheader>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="address" ref="address" @placechanged="setAddress" label="Street and City" prepend-icon="map" single-line :rules="rules.address" :validate-on-blur="isLazyValidate" clearable required></v-text-field>
                </v-flex>

                <v-flex xs12 sm12 offset-xs1 md2 offset-md0>
                  <v-text-field ref="number" v-model="payload.address.number" label="Street Number" type="number" single-line :rules="rules.number" validate-on-blur required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 offset-xs1 md2 offset-md0>
                  <v-text-field v-model="payload.address.apartmentNumber" label="Apartment Number" type="number" single-line></v-text-field>
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
                  <vue-slider :processStyle="{backgroundColor: $vuetify.theme.primary}" :tooltipStyle="{backgroundColor: $vuetify.theme.primary, borderColor: $vuetify.theme.primary}" :min="0" :max="10" :interval="1" tooltip="always" v-model="payload.requiredRoommates" :debug="false" class="pt-4" />
                </v-flex>
                <v-flex xs12 sm12 md2 order-sm2 order-md1>
                  <v-subheader v-text="'Entrance date'"></v-subheader>
                </v-flex>
                <v-flex xs12 sm12 md3 order-sm2 order-md1>
                  <app-calendar-form @dateUpdated="payload.entranceDate = new Date($event).getTime()" label="when" single-line validate-on-blur required />
                </v-flex>
                <v-flex xs12 sm12 md1 order-md2>
                </v-flex>
                <v-flex xs12 sm12 md3 order-sm1 order-md2>
                  <v-subheader>Total number of roommates</v-subheader>
                </v-flex>
                <v-flex xs12 sm12 md3 order-sm1 order-md2>
                  <vue-slider :processStyle="{backgroundColor: $vuetify.theme.primary}" :tooltipStyle="{backgroundColor: $vuetify.theme.primary, borderColor: $vuetify.theme.primary}" :min="0" :max="11" :interval="1" tooltip="always" v-model="payload.totalRoommates" :debug="false" class="pt-4" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
        <v-btn color="primary" @click.native="goNextStep">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>

      </v-stepper-content>
      <v-stepper-step ref="step2" step="2" :complete="e6 > 2">Nice to know</v-stepper-step>
      <v-stepper-content step="2">
        <v-card :color="color" class="mb-1" height="auto">
          <v-container fluid grid-list-md>
            <v-layout wrap row>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Floor'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.floor" label="" type="number" prepend-icon="" single-line></v-text-field>
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
        <v-btn outline @click.native="goPreviousStep">
          <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
        <v-btn color="primary" @click.native="goNextStep">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step ref="step3" step="3" :complete="e6 > 3">Select the asset's special attributes</v-stepper-step>
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

        <v-btn outline @click.native="goPreviousStep">
          <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
        <v-btn color="primary" @click.native="goNextStep">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>
      </v-stepper-content>

      <v-stepper-step ref="step4" step="4">Upload some images</v-stepper-step>
      <v-stepper-content step="4">
        <v-card :color="color" class="mb-5 pa-3" height="auto" style="min-height: 300px">
          <app-uploader v-model="files" fileType="image/*"></app-uploader>
        </v-card>
        <v-layout class="pb-1">
          <v-btn outline @click.native="goPreviousStep">
            <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
          <v-spacer/>
          <v-btn block @click.native="submit" color="secondary" :disabled="!valid">
            Advertise Now
            <v-icon right>send</v-icon>
          </v-btn>
        </v-layout>

      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import vueSlider from 'vue-slider-component';
  import AppCalendarForm from './sub-components/AppCalendarForm';
  import AppUploader from './sub-components/AppUploader';
  import tagsList from '../assets/tags';

  export default {
    data() {
      return {
        payload: {
          address: {
            state: 'Israel', // for now this is the default
            city: null,
            street: null,
            number: null,
            apartmentNumber: null
          },

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
        address: null,
        files: [],
        rules: {
          address: [
            () =>
              (!!this.payload.address.city &&
                this.payload.address.city.length > 0) ||
              '',
            () =>
              (!!this.payload.address.street &&
                this.payload.address.street.length > 0) ||
              ''
          ],
          number: [() => !!this.payload.address.number || ''],
          price: [() => !!this.payload.price || ''],
          entranceDate: !![() => this.payload.entranceDate || '']
        },
        e6: 1,
        color: 'grey lighten-5',
        tags: tagsList,
        countries: ['IL'],
        types: 'address',
        isLazyValidate: true,
        valid: false
      };
    },
    methods: {
      async submit() {
        if (this.$refs.form.validate()) {
          try {
            this.$store.commit('showLoading');
            const apartment = await this.$store.dispatch(
              'publishApartment',
              this.payload
            );
            this.$router.push({ name: 'AppMain' });
            await this.$store.dispatch('searchApartments', { id: apartment._id });
          } catch (error) {
            // eslint-disable-next-line
            console.log(error);
          } finally {
            this.$store.commit('hideLoading');
          }
        }
      },
      setAddress(data) {
        this.address = data.full_name;
        this.payload.address.city = data.locality;
        this.payload.address.street = data.route;
        this.isLazyValidate = false;
      },
      goPreviousStep() {
        this.e6 -= 1;
        this.scrollTo(this.$refs[`step${this.e6}`]);
      },
      goNextStep() {
        this.e6 += 1;
        this.scrollTo(this.$refs[`step${this.e6}`]);
      },
      scrollTo(ref) {
        this.$vuetify.goTo(ref, {
          duration: 2000,
          offset: -150,
          easing: 'easeInOutCubic'
        });
      }
    },
    computed: {
      step1Rules() {
        if (this.e6 === 1) {
          return [() => true];
        }
        return [
          () => this.payload.address.city !== null,
          () => this.payload.address.street !== null,
          () => this.payload.address.number !== null,
          () => this.payload.price !== null
        ];
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
      AppUploader,
      vueSlider
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

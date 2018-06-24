<template>
  <v-container>
    <v-stepper v-model="e6" vertical :class="flat ? 'elevation-0' : ''">
      <v-layout fill-height align-center>
        <h3 class="headline secondary--text ma-4">{{ title }}</h3>
        <v-spacer/>
        <v-btn v-if="edit" icon @click="$emit('cancel')">
          <v-icon>close</v-icon>
        </v-btn>
      </v-layout>


      <v-divider></v-divider>
      <v-alert :value="error.show" type="error">
        {{ error.message }}
      </v-alert>
      <v-stepper-step ref="step1" :step="1" :complete="e6 > 1" :rules="step1Rules" editable edit-icon="check">
        Main details
        <small>The most important stuff!</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card :color="color" class="mb-1">

          <v-form v-model="valid" ref="form">
            <v-container fluid grid-list-md>
              <v-layout wrap row>
                <v-flex xs12 sm12 md2>
                  <v-subheader v-text="'Address'"></v-subheader>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field v-model="address" :disabled="edit" ref="address" @placechanged="setAddress" label="Street and City" prepend-icon="map" single-line :rules="rules.address" :validate-on-blur="isLazyValidate" clearable required></v-text-field>
                </v-flex>

                <v-flex xs12 sm12 offset-xs1 md2 offset-md0>
                  <v-text-field ref="number" v-model="payload.address.number" label="Street Number" mask="#######" single-line :rules="rules.number" validate-on-blur required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 offset-xs1 md2 offset-md0>
                  <v-text-field v-model="payload.address.apartmentNumber" label="Apartment Number" mask="#######" single-line></v-text-field>
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
                  <v-slider v-model="payload.requiredRoommates" thumb-label step="1" :min="0" :max="10" ticks hide-details></v-slider>
                  <div class="text-xs-left body-2">{{ payload.requiredRoommates }}/{{ payload.totalRoommates }}</div>
                </v-flex>
                <v-flex xs12 sm12 md2 order-xs3 order-md1>
                  <v-subheader v-text="'Entrance date'"></v-subheader>
                </v-flex>
                <v-flex xs12 sm12 md3 order-xs2 order-md1>
                  <app-calendar-form @dateUpdated="payload.entranceDate = new Date($event).getTime()" label="when" single-line validate-on-blur :required="true" :rules="rules.entranceDate" :min="today" :startDate="payload.entranceDate"/>
                </v-flex>
                <v-flex xs12 sm12 md1 order-md2>
                </v-flex>
                <v-flex xs12 sm12 md3 order-xs1 order-md2>
                  <v-subheader>Total number of roommates</v-subheader>
                </v-flex>
                <v-flex xs12 sm12 md3 order-sm1 order-md2>
                  <v-slider v-model="payload.totalRoommates" thumb-label step="1" :min="1" :max="11" ticks hide-details></v-slider>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
        <v-btn color="primary" @click.native="goNextStep">Continue
          <v-icon right>keyboard_arrow_down</v-icon>
        </v-btn>

      </v-stepper-content>
      <v-stepper-step ref="step2" :step="2" :complete="e6 > 2" editable edit-icon="check">Nice to know</v-stepper-step>
      <v-stepper-content step="2">
        <v-card :color="color" class="mb-1" height="auto">
          <v-container fluid grid-list-md>
            <v-layout wrap row>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Floor'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.floor" label="Floor" type="number" prepend-icon="" :rules="rules.floor" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Building floors'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.totalFloors" label="Building floors" type="number" prepend-icon="" :rules="rules.totalFloors" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Number of rooms'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.numberOfRooms" label="Number of rooms" mask="#####" prepend-icon="" single-line></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md1>
              </v-flex>
              <v-flex xs12 sm12 md2>
                <v-subheader v-text="'Size'"></v-subheader>
              </v-flex>
              <v-flex xs12 sm12 md3>
                <v-text-field v-model="payload.area" label="size" mask="#####" prepend-icon="" suffix="square meters" single-line></v-text-field>
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

      <v-stepper-step ref="step3" :step="3" :complete="e6 > 3" editable edit-icon="check">Select the asset's special attributes</v-stepper-step>
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

      <v-stepper-step ref="step4" :step="4" editable edit-icon="check">Upload some images</v-stepper-step>
      <v-stepper-content step="4">
        <v-card :color="color" class="mb-5 pa-3" height="auto" style="min-height: 300px">
          <app-uploader v-model="payload.images" fileType="image/*"></app-uploader>
        </v-card>
        <v-layout class="pb-1">
          <v-btn outline @click.native="goPreviousStep">
            <v-icon left>keyboard_arrow_up</v-icon>Return</v-btn>
          <v-spacer/>
        </v-layout>

      </v-stepper-content>
    </v-stepper>
                <v-btn block v-show="e6 === 4" @click.native="submit" color="secondary" :disabled="!valid">
            {{ submitText }}
            <v-icon right>send</v-icon>
          </v-btn>
  </v-container>
</template>

<script>
  import AppCalendarForm from './sub-components/AppCalendarForm';
  import AppUploader from './sub-components/AppUploader';
  import tagsList from '../assets/tags';

  export default {
    props: {
      edit: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object
      },
      flat: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        id: null,
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
          totalRoommates: 3,
          floor: null,
          totalFloors: null,
          numberOfRooms: null,
          area: null,
          description: null,
          images: [],
          tags: []
        },
        address: null,
        rules: {
          address: [
            () =>
              (!!this.payload.address.city &&
                this.payload.address.city.length > 0) ||
              '',
            () =>
              (!!this.payload.address.street &&
                this.payload.address.street.length > 0) ||
              '',
            () =>
              (!!this.address &&
                this.address.length > 0) ||
              ''
          ],
          number: [() => !!this.payload.address.number || ''],
          price: [() => !!this.payload.price || ''],
          entranceDate: [() => !!this.payload.entranceDate || ''],
          floor: [() => !this.payload.totalFloors ||
            (this.payload.totalFloors && parseInt(this.payload.floor) <= parseInt(this.payload.totalFloors)) ||
            'The apartment\'s floor number is more than the total building floors'],
          totalFloors: [() => !this.payload.floor ||
            (this.payload.floor && parseInt(this.payload.floor) <= parseInt(this.payload.totalFloors)) ||
            'The total building floors are less than the apartment\'s floor number']
        },
        e6: 1,
        color: 'grey lighten-5',
        tags: tagsList,
        countries: ['IL'],
        types: 'address',
        isLazyValidate: true,
        valid: false,
        showSilders: false,
        error: {
          show: false,
          message: ''
        }
      };
    },
    methods: {
      publishApartment() {
        return this.$store.dispatch('publishApartment', this.payload);
      },
      editApartment() {
        return this.$store.dispatch('editApartment', { params: { id: this.id }, payload: this.payload })
          .then((apartment) => {
            this.$emit('input', apartment);
            this.$emit('updated');
            return apartment;
          });
      },
      async submit() {
        if (this.$refs.form.validate()) {
          this.error.show = false;
          try {
            this.$store.commit('showLoading');
            let apartment;
            if (this.edit) {
              apartment = await this.editApartment();
            } else {
              apartment = await this.publishApartment();
            }
            this.$router.push({ name: 'AppApartmentPage', params: { id: apartment._id } });
          } catch (error) {
            this.error.message = error.response.data.message;
            this.error.show = true;
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
          this.rules.address[0],
          this.rules.address[1],
          this.rules.number[0],
          this.rules.price[0],
          this.rules.entranceDate[0],

          // () => this.payload.address.city !== null,
          // () => this.payload.address.street !== null,
          // () => this.payload.address.number !== null,
          // () => this.payload.price !== null,
          // () => this.payload.entranceDate !== null
        ];
      },
      today() {
        return new Date(Date.now() - (1000 * 60 * 60 * 24)).toISOString();
      },
      title() {
        return this.edit ? 'Edit Details' : 'Advertise';
      },
      submitText() {
        return this.edit ? 'Update' : 'Advertise Now';
      }
    },
    watch: {
      floorSlider(val) {
        this.payload.floor = val;
        this.payload.totalFloors =
          val > this.payload.totalFloors ? val : this.payload.totalFloors;
      },
      'payload.requiredRoommates'(val) { // eslint-disable-line
        if (val > this.payload.totalRoommates) {
          this.payload.totalRoommates = val;
        }
      },
      'payload.totalRoommates'(val) { // eslint-disable-line
        if (val < this.payload.requiredRoommates) {
          this.payload.requiredRoommates = val;
        }
      }
    },
    created() {
      if (this.edit) {
        this.id = this.value._id;
        this.payload.address.city = this.value.location.address.city;
        this.payload.address.street = this.value.location.address.street;
        this.payload.address.number = this.value.location.address.number;
        this.address = (this.payload.address.street ? `${this.payload.address.street}` : '') + (this.payload.address.city ? ` ${this.payload.address.city}` : '') + `, ${this.payload.address.state}`; // eslint-disable-line
        this.payload.address.apartmentNumber = this.value.location.address.apartmentNumber;
        this.payload.price = this.value.price;
        this.payload.entranceDate = this.value.entranceDate;
        this.payload.requiredRoommates = this.value.requiredRoommates;
        this.payload.totalRoommates = this.value.totalRoommates;
        this.payload.floor = this.value.floor;
        this.payload.totalFloors = this.value.totalFloors;
        this.payload.numberOfRooms = this.value.numberOfRooms;
        this.payload.area = this.value.area;
        this.payload.description = this.value.description;
        this.payload.images = this.value.images;
        this.payload.tags = this.value.tags;
      }
    },
    mounted() {
      this.$setAutocomplete(this.$refs.address, ['address']);
    },
    components: {
      AppCalendarForm,
      AppUploader,
    }
  };
</script>

<style scoped>
  .hidden {
    display: none;
  }
</style>

/**
 * @author: Or Abramovich
 * @date: 06/18
 * Dialog serves to add review. The dialog has 3 steps - chossing street, categories star ranking and free text rating.
 * Dialog communicates with the back-end to store the reviews
 */
<template>
 <v-container fluid class="modal-backdrop">
    <v-card>
        <v-stepper v-model="e6" vertical>
          <v-layout align-center :class="alert.show? 'error' : 'auto'">
            <v-alert :type="alert.type" :value="alert.show" transition="scale-transition" class="mb-0">
              {{ alert.message }}
            </v-alert>
            <v-spacer/>
            <v-btn icon @click.native="close(); e6=1" flat small class="mr-3 mt-3">
              <v-icon>highlight_off</v-icon>
            </v-btn>
          </v-layout>
          <v-divider/>
					<v-stepper-step :complete="e6 > 1" step="1">Select a location</v-stepper-step>
						<v-stepper-content step="1">
						  <v-text-field v-model="reviewAddress" ref="reviewAddress" @placechanged="setReviewAddress" label="Street and City" validate-on-blur required></v-text-field>
						  <v-btn color="primary" @click.native="locationStepOnFinish" small>Continue</v-btn>
						</v-stepper-content>
					<v-stepper-step :complete="e6 > 2" step="2">Rank</v-stepper-step>
						<v-stepper-content step="2">
						  Parking: <star-rating :inline="true" :show-rating="false" v-model="ratedCharacteristics.parking" :star-size="15"></star-rating></br></br>
						  Public Transportation: <star-rating :inline="true" :show-rating="false" :star-size="15" v-model="ratedCharacteristics.publicTransport"></star-rating></br></br>
						  Noise: <star-rating :inline="true" :show-rating="false" :star-size="15" v-model="ratedCharacteristics.noise"></star-rating></br></br>
						  Commercial Service: <star-rating :inline="true" :show-rating="false" :star-size="15" v-model="ratedCharacteristics.commercialServices"></star-rating></br></br>
						  Upkeep: <star-rating :inline="true" :show-rating="false" :star-size="15" v-model="ratedCharacteristics.upkeep"></star-rating></br></br>
						  <v-btn color="primary" @click.native="e6 = 3" small>Continue</v-btn>
						  <v-btn flat @click.native="e6=1" small>Go Back</v-btn>
						</v-stepper-content>
					<v-stepper-step :complete="e6 > 3" step="3">Free text review</v-stepper-step>
					 <v-stepper-content step="3">
						  <v-text-field label="Pros" v-model="ratedPros"></v-text-field>
						  <v-text-field label="Cons" v-model="ratedCons"></v-text-field>
						  <v-btn color="primary" @click.native="saveReview" :disabled="loading" :loading="loading" small>Submit</v-btn>
						  <v-btn flat @click.native="e6=2" small>Go Back</v-btn>
						</v-stepper-content>
			 </v-stepper>
    </v-card>
</v-container>
</template>

<script>
import StarRating from 'vue-star-rating';

export default {
  name: 'AppReviewAddDialog',
  data() {
    return {
      loading: false,
      reviewAddress: '',
      e6: 1,
      locationData: [],
      ratedCharacteristics: {
        noise: 0,
        parking: 0,
        commercialServices: 0,
        upkeep: 0,
        publicTransport: 0
      },
      ratedPros: '',
      ratedCons: '',
      alert: {
        show: false,
        message: '',
        type: 'error'
      }
    };
  },
  methods: {
    locationStepOnFinish() {
      this.hideAlert();
      if (this.locationData.length < 1) {
        this.showBadAlert('Valid address must be selected');
        return;
      }
      this.e6 = 2;
    },
    clearData() {
      this.reviewAddress = '';
      this.e6 = 1;
      this.loading = false;
      this.locationData = [];
      this.ratedCharacteristics = {
        noise: 0,
        parking: 0,
        commercialServices: 0,
        upkeep: 0,
        publicTransport: 0
      };
      this.ratedPros = '';
      this.ratedCons = '';
    },
    setReviewAddress(data) {
      this.locationData = data;
      this.reviewAddress = data.full_name;
    },
    close() {
      this.clearData();
      this.$emit('close');
    },
    showBadAlert(errorMsg) {
      this.alert.message = errorMsg;
      this.alert.type = 'error';
      this.alert.show = true;
    },
    hideAlert() {
      this.alert.message = '';
      this.alert.show = false;
    },
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    validateReviewInput() {
      if (this.ratedPros.length < 10) {
        this.showBadAlert('Review text must contain at least 10 letters');
        return false;
      }
      if (this.ratedCons.length < 10) {
        this.showBadAlert('Review text must contain at least 10 letters');
        return false;
      }
      return true;
    },
    goToReview() {
      this.$router.push({ name: 'AppReviews', query: { lat: this.locationData.latitude, lng: this.locationData.longitude, city: this.locationData.locality, street: this.locationData.route } });
    },
    async saveReview() {
      this.hideAlert();
      if (!this.validateReviewInput()) return;
      this.showLoading();
      const userRating = {
        city: this.locationData.locality,
        street: this.locationData.route,
        state: this.locationData.country,
        ratedCharacteristics: this.ratedCharacteristics,
        Pros: this.ratedPros,
        Cons: this.ratedCons
      };
      await this.$store
        .dispatch('publishReview', userRating)
        .then(async () => {
          this.hideLoading();
          this.goToReview();
          this.close();
        })
        .catch(() => this.showBadAlert('Could not save review'))
        .then(() => this.hideLoading());
    }
  },
  mounted() {
    this.$setAutocomplete(this.$refs.reviewAddress, ['address']);
  },
  components: {
    StarRating
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
</style>
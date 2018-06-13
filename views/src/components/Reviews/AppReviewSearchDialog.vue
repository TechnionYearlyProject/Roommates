/**
 * @author: Or Abramovich
 * @date: 06/18
 * Dialog serves to search for a review. The dialog contains an autocomplete textbox to select a street for the review.
 */
<template>
  <v-container class="modal-backdrop">
    <v-card max-width="750px">
    <div dir="rtl">
      <v-btn icon @click.native="close();" flat small>
        <v-icon>highlight_off</v-icon>
      </v-btn>
    </div>
    <v-divider/>
      <v-card-title primary-title>Search for a review </v-card-title primary-title>
      <v-card-text>
        <v-layout wrap row>
          <v-flex>
            <v-text-field v-model="address" ref="address" @placechanged="setAddress" label="Street and City"></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn small color="primary" @click.native="search();">Search</v-btn>  
      </v-card-text>              
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AppReviewSearchDialog',
  data() {
    return {
      address: '',
      searchData: ''
    };
  },
  methods: {
    search() {
      this.$router.push({ name: 'AppReviews', query: { lat: this.searchData.latitude, lng: this.searchData.longitude, city: this.searchData.locality, street: this.searchData.route } });
    },
    close() {
      this.$emit('close');
    },
    setAddress(data) {
      this.address = data.full_name;
      this.searchData = data;
    }
  },
  mounted() {
    this.$setAutocomplete(this.$refs.address, ['address']);
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
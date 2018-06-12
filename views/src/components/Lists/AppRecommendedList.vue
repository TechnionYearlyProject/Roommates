<template>
<div>
  <div v-if="recommended.length === 0">
    <span class="text-xs-center">No Recommendations</span> 
  </div>
  <div v-else>
    <v-list subheader three-line>
      <v-subheader>Recommendations</v-subheader>
      <v-list-tile v-for="($, i) in recommended" :key="`recommended-${i}`" @click="goToPage($._id)">
        <img :src="$.images[0]" style="height:80px; max-width:98px;">
        <v-list-tile-content class="pl-3">
          <v-list-tile-title>{{ getAddress($) }}</v-list-tile-title>
          <v-list-tile-sub-title>&#x24;{{ $.price }}</v-list-tile-sub-title>
          <v-list-tile-sub-title>Entrance Date: {{ new Date($.entranceDate).toDateString() }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</div>
</template>

<script>
export default {
  props: {
    geolocation: {
      type: Array,
      default: () => [0, 0]
    },
    radius: {
      type: Number,
      default: 5
    },
    listLength: {
      type: Number,
      default: 3
    },
    filtered: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      recommended: []
    }
  },
  methods: {
    goToPage(id) {
      this.$router.push({name: 'AppApartmentPage', params: {id}});
    },
    getAddress(a) {
      return `${a.location.address.street.capitalize()} ${a.location.address.number}, ${a.location.address.city.capitalize()}`
    }
  },
  mounted() {
    this.$store.dispatch('fetchApartments', { geolocation: this.geolocation, radius: this.radius })
    .then((apartments) => {
      this.recommended = apartments.filter(a => !this.filtered.includes(a._id)).slice(0, Math.max(this.listLength, apartments.length));
    })
    .catch((e) => console.log(e));
  }
};
</script>

<style>
</style>

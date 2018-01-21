<template>
  <b-container>
    <b-row>
      <b-col cols="auto">
        <icon name="map-marker" v-b-modal.google-maps-modal scale="1.5" class="addr-icon" />

        <h3 class="address">{{this.apartment.location.address.number }} {{this.apartment.location.address.street.toFormal()}}, {{this.apartment.location.address.city.toFormal()}}</h3>
        <b-modal id="google-maps-modal" hide-footer size="lg" @shown="onModalShow" :title="`${this.apartment.location.address.number} ${this.apartment.location.address.street.toFormal()}, ${this.apartment.location.address.city.toFormal()}`">
          <g-map-picker v-model="location" />
        </b-modal>
      </b-col>
      <b-col>
        <span class="price"> ₪ {{ apartment.price }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Vue from "vue";
  import Icon from "vue-awesome/components/Icon";
  import GmapAutoComplete from "vue2-google-maps/src/components/autocomplete";
  import GMapPicker from "@/components/gmap-picker/GMapPicker";

  export default {
    props: ["apartment"],
    methods: {
      onModalShow() {
        Vue.$gmapDefaultResizeBus.$emit("resize");
      }
    },
    computed: {
      location() {
        return {
          name: `${
            this.apartment.location.address.number
          } ${this.apartment.location.address.street.toFormal()}, ${this.apartment.location.address.city.toFormal()}`,
          lat: this.apartment.location.geolocation[1],
          lng: this.apartment.location.geolocation[0]
        };
      }
    },
    components: {
      Icon,
      GmapAutoComplete,
      GMapPicker
    }
  };
</script>

<style scoped>
  .address {
    margin: 10px 0;
    font-size: 28px;
    font-weight: 38px;
    letter-spacing: 3px;
    display: inline-block;
  }
  .price {
    color: #ffa500;
    font-size: 30px;
    letter-spacing: 1.5px;
    right: 0px;
    border-bottom: 2px solid;
    line-height: 42px;
    float: right;
  }
  .addr-icon {
    margin-right: 15px;
    line-height: 120%;
    vertical-align: middle;
    margin-top: -15px;
    display: inline-block;
    transition: color 0.5s;
  }

  .addr-icon:hover {
    color: red;
  }
</style>

<template>
  <b-container>
    <b-row>
      <b-col>
        <h3 class="address"><icon name="map-marker" scale="1.5" class="addr-icon"></icon>{{ apartment.location.address.number }} {{ apartment.location.address.street.toFormal() }}, {{ apartment.location.address.city.toFormal() }}</h3>
      </b-col>
      <b-col>
        <span class="price"> ₪ {{ apartment.price }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";

  export default {
    props: ["apartment"],
    components: {
      Icon
    }
  };
</script>

<style scoped>
.address {
  margin: 10px 0;
  font-size: 28px;
  font-weight: 38px;
  letter-spacing: 3px;
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
    margin-top: -10px;
  }
</style>

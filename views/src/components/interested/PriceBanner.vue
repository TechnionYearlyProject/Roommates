<template>
  <b-badge class="price">
    <span>₪ {{ price }}</span>
    <icon name="circle" style="color: #fff;"></icon>
  </b-badge>
</template>

<script>
import Icon from "vue-awesome/components/Icon";

  export default {
    props: ['price'],
    components: {
      Icon
    }
  };
</script>

<style scoped>
   .price {
    font-size: 20px;
    margin: 5px 5px;
    font-weight: 400;
    display: inline-block;
    vertical-align: middle;
    background-color: #D5F500;
    padding: 8px;
    transform: rotate(-8deg) scale(1.1);
  }

  .price span {
    padding-right: 7px;
    color: #7d7d7d;
  }
</style>

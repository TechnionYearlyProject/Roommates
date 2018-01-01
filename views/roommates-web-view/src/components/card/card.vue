<template>
<div class="card" style="width: 20rem;">
  <img :src=card_details.img class="card-img-top" alt="img">
  <div class="card-block">
    <h4 class="card-title">{{card_details.title}}</h4>
    <p class="card-text">{{card_details.text}}</p>
    <a :href=card_details.link class="btn btn-primary">{{card_details.linkText}}</a>
  </div>
</div>
</template>

<script>
export default {
  props: [
    'card_details'
  ]
};
</script>

<style scoped>

.s-btn-sun {
  padding: 8px 80px;
  font-size: 150%;
  border: 0;
}

</style>
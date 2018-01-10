<template>
<div class="card" style="width: 20rem;">
  <div class="centralize_div">
    <img :src=card_details.img class="card-img-top" alt="img">
    <div class="card-block">
      <h4 class="card-title">{{card_details.title}}</h4>
      <p class="card-text">{{card_details.text}}</p>
      <b-button size="lg" variant="primary" :to=card_details.link>{{card_details.linkText}}</b-button>
    </div>
  </div>
</div>
</template>

<script>
import bButton from 'bootstrap-vue/es/components/button/button';

export default {
  props: [
    'card_details'
  ],
  components: {
            bButton
  }
};
</script>

<style scoped>
.card{
	margin: 3px;
}
.centralize_div{
  display:table-cell; 
  vertical-align:middle; 
  text-align:center;
  padding: 7px;
}

.card-block{
  padding: 5px;
}

img {
    height: 3rem;
    width: 3rem;
}

.s-btn-sun {
  padding: 8px 80px;
  font-size: 150%;
  border: 0;
}

.btn-primary {
    color: #fff !important;
    background-color: #fdc600 !important;
    border-color: #fdc600 !important;
}

.btn-primary:active, .btn-primary.active {
    background-color: #FD9F25 !important;
    border-color: #FD9F25 !important;
}

.btn-primary:hover {
    background-color: #FDB01A !important;
    border-color: #FDB01A !important;
}

</style>
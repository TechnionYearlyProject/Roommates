<template>
<div>
 <b-carousel controls >
          <b-carousel-slide class="image" v-if="apartment.images.length === 0" img-src="/static/images/apartments/default/default.png" />
          <b-carousel-slide class="image" v-else v-for="img in apartment.images" :key="i" :img-src="img" />
        </b-carousel>
</div>
       

</template>

<script>
  export default {
    props: ["apartment"],
    data() {
      return {};
    }
  };
</script>

<style scoped>
 .image {
    width: auto;
  height: auto;
   max-width: 100%;
   max-height: 400px;
   vertical-align: middle;
   border: 0 none;
   object-fit: none; 
  object-position: center;
    display: flex;
 }
</style>

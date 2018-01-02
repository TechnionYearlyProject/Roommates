<template>
<div>
  <div id="apartment-images-carusel" class="carousel slide" data-ride="carousel">
    
            <!-- Make pagination -->
            <ol class="carousel-indicators">
              <li v-show="apartment.images.length > 1" v-for="(_, index) in apartment.images" 
                :data-target="'#apartment-images-carusel'"
                :data-slide-to="index"
                :class="{ active: index === 0 }"></li>
            </ol>

            <!-- Photo carusel -->
            <div class="carousel-inner r-apartment-img">
              <div v-if="apartment.images.length > 0">
                <div v-for="(image, index) in apartment.images"
                :class="{ active: index === 0, 'carousel-item': true }">
                  <img class="d-block w-100" :src="image">
                </div>
              </div>
              <div v-else>
                <img class="d-block w-100" :src="noImage">
              </div>
            </div>

            <!-- Arrows - left and right -->
            <div v-show="apartment.images.length > 1">
              <a class="carousel-control-prev" href="#apartment-images-carusel" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#apartment-images-carusel" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div> 
          </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      noImage: 'src/assets/vendors/imgs/apartments/no-photo-grey.png'
    }
  },
  props: [
    'apartment'
  ]
};
</script>

<style>
.r-apartment-img img {
  transition: transform 0.5s;
}

.r-apartment-img img:hover {
  transform: scale(1.20);
}


</style>

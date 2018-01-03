<template>
  <div>
    <b-carousel id="carousel1"  style="text-shadow: 1px 1px 2px #333;"
                controls
                indicators
                background="#ababab"
                :interval="4000"
                img-width="1024"
                img-height="480"
                v-model="slide"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd">

      <b-carousel-slide img-src="https://lorempixel.com/1024/480/technics/2/">
      </b-carousel-slide>
      <b-carousel-slide img-src="https://lorempixel.com/1024/480/technics/4/">
      </b-carousel-slide>
      <b-carousel-slide img-src="https://lorempixel.com/1024/480/technics/8/">
      </b-carousel-slide>
      <b-carousel-slide>
        <img slot="img" class="d-block img-fluid w-100" width="1024" height="480"
             src="https://lorempixel.com/1024/480/technics/5/" alt="image slot">
      </b-carousel-slide>

    </b-carousel>

  </div>
</template>

<script>
  import bCarousel from 'bootstrap-vue/es/components/carousel/carousel';
  import bCarouselSlide from 	'bootstrap-vue/es/components/carousel/carousel-slide';
  export default {
    data () {
      return {
        slide: 0,
        sliding: null
      }
    },
    components: {
      bCarousel,
      bCarouselSlide
    },
    methods: {
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      }
    }
  }
</script>
<!-- carousel-1.vue -->
<style>

</style>

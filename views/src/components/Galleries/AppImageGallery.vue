<template>
    <v-container fluid>
        <v-slide-x-transition>
        <div :key="image" class="card__media__background" :style="{background: `url(${image}) center center / contain no-repeat`}"></div>
      </v-slide-x-transition>
      <v-container fill-height fluid>
        <v-layout fill-height>
          <v-btn v-if="value.length > 1" :disabled="value.length <= 1" icon @click.native="previousImage">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="value.length > 1" :disabled="value.length <= 1" icon @click.native="nextImage">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
import d from '../../assets/apartment-default.jpg';

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imageNumber: 0,
      defaultImage: d
    };
  },
  metohds: {
    nextImage(e) {
      e.stopPropagation();

      this.imageNumber = (this.imageNumber + 1) % this.value.length;
    },
    previousImage(e) {
      e.stopPropagation();

      this.imageNumber = (this.imageNumber - 1) % this.value.length;
    }
  },
  computed: {
      image() {
        return this.value[this.imageNumber] || this.defaultImage;
      }    
  }
};
</script>

<style>
</style>

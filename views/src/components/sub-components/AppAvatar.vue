<template>
  <v-avatar v-if="image" :size="`${size}px`" class="accent"><img :src="image" :alt="name"></v-avatar>
  <v-avatar v-else :color="avatarColor" :size="`${size}px`">
    <span class="white--text headline">{{ name.charAt(0).capitalize() }}</span>
  </v-avatar>
</template>

<script>
import colorGenerator from '../../assets/colorGenerator';

  export default {
    props: {
      image: {
        type: String,
        default: null
      },
      name: {
        type: String,
        default: '?'
      },
      size: {
        type: Number,
        default: 48
      },
      color: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        avatarColor: null,
        generateColor: colorGenerator
      };
    },
    created() {
      this.avatarColor = this.color ? this.color : this.generateColor();
    }
  };
</script>

<style scoped>

</style>

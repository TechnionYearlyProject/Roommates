<template>
  <v-avatar v-if="image" class="accent"><img :src="image" :size="size" :alt="name"></v-avatar>
  <v-avatar v-else :color="avatarColor" :size="size">
    <span class="white--text headline">{{ name.charAt(0).capitalize() }}</span>
  </v-avatar>
</template>

<script>
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
        avatarColor: null
      };
    },
    methods: {
      generateColor() {
        const color = Math.floor(Math.random() * 5);
        let accent = Math.floor(Math.random() * 5);
        accent = accent === 0 ? '' : `accent-${accent}`;
        switch (color) {
          case 0:
            return `red ${accent}`;
          case 1:
            return `blue ${accent}`;
          case 2:
            return `green ${accent}`;
          case 3:
            return `purple ${accent}`;
          case 4:
            return `orange ${accent}`;
          default:
            return '';
        }
      }
    },
    created() {
      this.avatarColor = this.color ? this.color : this.generateColor();
    }
  };
</script>

<style scoped>

</style>

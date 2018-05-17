<template>
<v-dialog :value="value" @input="$emit('input', false)" max-width="80vw" lazy persistent>
      <v-carousel :cycle="false" lazy>
        <v-carousel-item v-for="(image,i) in images" :src="image" :key="i" ></v-carousel-item>
      </v-carousel>
      <v-card dark>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat="flat" @click.native="$emit('input', false)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import image1 from '../../assets/apartment-defalut.jpg';
import image2 from '../../assets/user-default.jpg';

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => [image1, image2],
      required: true
    }
  },
};
</script>

<style scoped>
.slick-slide {
   height:200px;
}

.slick-slide img {
   height:200px;
}
</style>
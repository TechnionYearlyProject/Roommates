<template>
  <v-layout row wrap py-3>
    <v-flex xs3 v-for="(tag,i) in value" :key="`tag-${i}`">
      <div class="text-xs-center">
        <v-icon>{{ tags[tag].vicon }}</v-icon><br>
        <small>{{ tags[tag].name }}</small>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
import t from '../../assets/tags';

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tags: t
    }
  }
};
</script>

<style>
</style>

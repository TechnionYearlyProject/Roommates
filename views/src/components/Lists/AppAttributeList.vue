<template>
  <v-card class="mt-3">
    <v-card-title>
      <h4>{{ title }}</h4>
    </v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-tile v-for="(attribute,i) in value" :key="`attribute-${i}`">
        <v-list-tile-content>{{ attribute.title }}</v-list-tile-content>
        <v-list-tile-content class="align-end">{{ attribute.value || '-' }}</v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: {
      type: string,
      default: 'Attributes'
    }
  }
};
</script>

<style>
</style>

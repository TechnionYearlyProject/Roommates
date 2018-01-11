<template>
  <b-form-group horizontal class="mb-3" :label="label">
    <b-form-radio-group v-model="selected" :options="options" name="radioInline">
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
  export default {
    props: ["label", "options"],
    data() {
      return {
        selected: ""
      };
    },
    watch: {
      selected() {
        console.log(this.selected);
        this.$emit("changed", this.selected);
      }
    }
  };
</script>

<style>

</style>

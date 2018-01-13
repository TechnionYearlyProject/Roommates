<template>
  <b-form-group horizontal class="mb-3" :label="label">
    <b-form-radio-group v-model="selected" :options="options" name="radioInline" style="padding-top:8px">
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
        this.$emit("changed", this.selected);
      }
    }
  };
</script>

<style>

</style>

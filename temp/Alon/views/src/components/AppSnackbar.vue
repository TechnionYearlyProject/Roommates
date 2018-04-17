<template>
    <v-snackbar :timeout="timeout" :bottom="true" :left="true" :multi-line="'multi-line'" :vertical="vertical" v-model="active">
        {{ text }}
        <v-btn flat color="secondary" @click.native="active = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
      props: {
        text: {
          type: String,
          default: ''
        },
        timeout: {
          type: Number,
          default: 10000
        },
        'multi-line': {
          type: Boolean,
          default: false
        },
        vertical: {
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          active: false
        };
      },
      watch: {
        text() {
          this.active = this.text !== '';
        }
      }
    };
</script>

<style>

</style>

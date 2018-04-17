<template>
    <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="date">
        <v-text-field :label="label" slot="activator" v-model="date" :prepend-icon="no-icon? '' : 'event'" readonly :single-line="true" :required="required"></v-text-field>
        <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="dateUpdate">OK</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script>
    export default {
      props: {
        required: {
          type: Boolean,
          default: false
        },
        'single-line': {
          type: Boolean,
          default: false
        },
        label: {
          type: String,
          default: ''
        },
        'no-form': {
          type: Boolean,
          default: false
        },
        'no-icon': {
          type: Boolean,
          default: false
        }
      },
      data: () => ({
        date: null,
        menu: false,
        modal: false
      }),
      methods: {
        dateUpdate() {
          this.$refs.menu.save(this.date);
          this.$emit('dateUpdated', this.date);
        }
      }
    };
</script>

<style>

</style>

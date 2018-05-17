<template>

  <v-menu ref="menu" 
          :close-on-content-click="false"  
          v-model="menu" 
          :nudge-right="40" 
          lazy 
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
          :return-value.sync="formatDate"
          >
          <v-text-field slot="activator"
                        v-model="dateFormatted"
                        :label="label"
                        :rules="rules"
                        :prepend-icon="noIcon? '' : 'event'"
                        @blur="date = parseDate(dateFormatted)"
                        :required="required"
                        />
            <v-date-picker v-model="date" 
                            @change="dateUpdate" 
                            no-title 
                            @input="menu = false" 
                            :min="min"/>
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
        noIcon: {
          type: Boolean,
          default: false
        },
        rules: {
          type: Array,
          default: () => []
        },
        min: {
          type: String,
          default: undefined
        }
      },
      data: () => ({
        dateFormatted: null,
        date: null,
        menu: false,
      }),
      methods: {
        dateUpdate() {
          this.$emit('dateUpdated', this.date);
        },
        formatDate (date) {
          if (!date) {
            return null;
          }
          const [year, month, day] = date.split('-');
          return `${day}/${month}/${year}`;
        },
        parseDate (date) {
          if (!date) {
            return null;
          }
          const [day, month, year] = date.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      },
      watch: {
        date (val) {
          this.dateFormatted = this.formatDate(this.date)
        }
      },
    };
</script>

<style>

</style>

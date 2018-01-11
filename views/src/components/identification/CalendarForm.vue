<template>
  <b-row class="mb-4">
    <label :for="id" class="col-md-3 col-form-label text-sm-left">{{ label }}</label>
    <datepicker :id="id" :value="date" :format="customFormatter" bootstrapStyling @selected="dateSelected">
    </datepicker>
    <b-input-group-button>
      <b-button variant="warning">
        <icon name="calendar" />
      </b-button>
    </b-input-group-button>
  </b-row>
</template>

<script>
  import Datepicker from "vuejs-datepicker";
  import Icon from "vue-awesome/components/Icon";
  const dateFormat = require("dateformat");

  export default {
    props: ["id", "label", "initialDate"],
    data() {
      return {
        date: this.initialDate
      };
    },
    methods: {
      customFormatter(date) {
        return dateFormat(date, "dd/mm/yyyy");
      },
      dateSelected(date) {
        this.date = date;
        this.$emit("selected", date);
      }
    },
    components: {
      Datepicker,
      Icon
    }
  };
</script>

<style scoped>

</style>

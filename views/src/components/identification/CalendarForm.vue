<template>
  <b-row class="mb-4">
    <label :for="id" class="col-md-3 col-form-label text-sm-left">{{ label }}</label>
    <datepicker :id="id" :value="date" :disabled="disabledDates" :format="customFormatter" bootstrapStyling @selected="dateSelected" ref="programaticOpen">
    </datepicker>
    <b-input-group-button>
      <b-button variant="warning" @click="openPicker">
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
    props: ["id", "label", "initialDate", "disabledDates"],
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
      },
      openPicker() {
        this.$refs.programaticOpen.showCalendar();
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

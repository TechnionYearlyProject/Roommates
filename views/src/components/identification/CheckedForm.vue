<template>
  <b-row class="input">
    <b-col cols="11">
      <b-form-group horizontal 
      breakpoint="md" 
      class="mb-1" 
      label-class="text-sm-left" 
      :label="label" 
      :label-for="labelFor" 
      :state="state"
      :invalid-feedback="invalidFeedback" 
      :valid-feedback="validFeedback">
        <b-form-input :id="labelFor" :type="inputType" :state="state" :placeholder="placeholder" @input="inputUpdated"></b-form-input>
      </b-form-group>
      <!-- :valid-feedback="validFeedback" -->
    </b-col>
    <b-col cols="1">
      <span v-if="state === true">
        <icon name="check" class="checkmark" />
      </span>
      <span v-else-if="state === false">
        <icon name="times" class="no-check" />
      </span>
    </b-col>
  </b-row>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";

  export default {
    props: {
      label: {
        type: String,
        default: ""
      },
      labelFor: {
        type: String,
        required: true
      },
      inputType: {
        default: "text"
      },
      state: {
        type: Boolean,
        default: null
      },
      validFeedback: {
        type: String,
        default: ""
      },
      invalidFeedback: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      }
    },
    components: {
      Icon
    },
    methods: {
      inputUpdated(val) {
        console.log(val);
        this.$emit("updated", val);
      }
    }
  };
</script>

<style scoped>
  .input {
    height: 70px;
  }

  .checkmark,
  .no-check {
    display: inline-block;
    vertical-align: middle;
    margin-top: 10px;
  }

  .checkmark {
    color: #d5f500;
  }

  .no-check {
    color: #f52500;
  }
</style>

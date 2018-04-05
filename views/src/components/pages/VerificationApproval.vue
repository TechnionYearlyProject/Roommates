<template>
  <b-container>
    <loading :show="loading" label="verifying account..."></loading>
    <div v-if="successfulVerification">
      
        <b-alert variant="success" show>Thank you! Your account is now verified and you can login.</b-alert>
      <b-row><b-col cols="3"></b-col>
      <b-col cols="6"><login-form></login-form></b-col>
      <b-col cols="3"></b-col>      </b-row>

    </div>
  </b-container>
</template>

<script>
  import { setTimeout } from "timers";
  import loading from "vue-full-loading";
  import LoginForm from "@/components/identification/LoginForm.vue";

  export default {
    data() {
      return {
        token: this.$route.params.token,
        loading: false,
        successfulVerification: false,
      };
    },
    methods: {
      sendVerificationRequet() {
        return this.$http.patch(`users/verify/${this.token}`, {});
      }
    },
    mounted() {
      this.loading = true;
      setTimeout(() => {
        this.sendVerificationRequet()
          .then(payload => {
            console.log(payload);
            this.successfulVerification = true;
          })
          .catch(err => {
            console.log(err);
          })
          .then(() => (this.loading = false));
      }, 3000);
    },
    components: {
      loading,
      LoginForm
    }
  };
</script>

<style>

</style>

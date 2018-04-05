<template>
  <b-container>
    <b-row>
      <h1>
        {{ header }}
      </h1>
      <p>
        To resend Verification mail please fill your password below.
      </p>
      <b-form inline>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input id="password" placeholder="Password" type="password" v-model="password" />
        </b-input-group>
        <b-button variant="primary" @click="resendVerificationMail">Resend verification email</b-button>
      </b-form>
      {{ msg }}
    </b-row>
  </b-container>
</template>

<script>
  const MIN_TIME_BETWEEN_RESENDS = 1000 * 60 * 15; // 15 minutes
  export default {
    props: ["header"],
    data() {
      return {
        password: "",
        lastResendTime: 0,
        msg: ""
      };
    },
    methods: {
      resendVerificationMail() {
        if (this.password.length < 6) {
          this.msg = "Please feel up a correct password";
          return;
        }
        if (Date.now() - this.lastResendTime <= MIN_TIME_BETWEEN_RESENDS) {
          this.msg =
            "Please wait 15 minutes before resending another verification mail";
          return;
        }
        this.msg = "";
        this.$http
          .post("users/verify", {
            email: this.$store.getters.user.email,
            password: this.password
          })
          .then(payload => {
            this.lastResendTime = Date.now();
            console.log(payload);
            this.msg = "email set";
          })
          .catch(err => {
            console.log(err);
            this.msg = err.body.message;
          });
      }
    }
  };
</script>

<style>

</style>


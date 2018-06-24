<template>
  <v-container>
    <v-alert :type="alert.type" :value="alert.show" transition="scale-transition">
      {{ alert.message }}
    </v-alert>
    <v-layout>
      <v-flex>
        <v-form v-model="valid">
          <v-text-field label="E-mail" type="email" prepend-icon="email" v-model="payload.email" :rules="rules.email" validate-on-blur required></v-text-field>
          <v-text-field @keyup.enter="login" label="Password" type="password" prepend-icon="lock" v-model="payload.password" :rules="rules.password" validate-on-blur required></v-text-field>
          <v-flex class="text-xs-right">
          <router-link :to="{ name: 'AppResetPassword' }" style="text-decoration:none;">
            Forgot password?
          </router-link>
          </v-flex>

          <v-btn @click="login" :disabled="loading" :loading="loading">
            Login
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import * as EmailValidator from 'email-validator';

export default {
  data: () => ({
    valid: false,
    payload: {
      // email: '',
      // password: ''
      email: null,
      password: null
    },
    rules: {
      email: [
        v => !!v || 'E-mail is required',
        v => (v && EmailValidator.validate(v)) || 'E-mail must be valid'
      ],
      password: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters'
      ]
    },
    alert: {
      show: false,
      message: '',
      type: 'error'
    },
    loading: false
  }),
  methods: {
    showBadAlert() {
      this.alert.message = 'Invalid credentials';
      this.alert.type = 'error';
      this.alert.show = true;
    },
    hideAlert() {
      this.alert.message = '';
      this.alert.show = false;
    },
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    showSnackbarWelcome(user) {
      if (user.isVerified) {
        this.$store.commit('showSnackbar', `Welcome back ${user.firstName}`);
      } else {
        this.$store.commit(
          'showSnackbar',
          `Hi ${user.firstName}, you still need to verify your account`
        );
      }
    },
    login() {
      this.showLoading();
      this.$store
        .dispatch('login', this.payload)
        .then((user) => {
          this.hideAlert();
          //location.reload();
          this.$router.push({ name: 'AppMain' });
          this.showSnackbarWelcome(user);
        })
        .catch(() => this.showBadAlert())
        .then(() => this.hideLoading());
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

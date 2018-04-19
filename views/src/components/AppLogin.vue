<template>
  <v-container>
    <v-alert :type="alert.type" :value="alert.show" transition="scale-transition">
      {{ alert.message }}
    </v-alert>
    <v-layout>
      <v-flex>
        <v-form v-model="valid">
          <v-text-field label="E-mail" type="email" prepend-icon="email" v-model="payload.email" :rules="rules.email" required></v-text-field>
          <v-text-field @keyup.enter="login" label="Password" type="password" prepend-icon="lock" v-model="payload.password" :rules="rules.password" required></v-text-field>
          <router-link :to="{ name: 'AppResetPassword' }" class="" style="text-decoration:none;">
            <span class="text-xs-right d-block">Forgot password?</span>
          </router-link>
          <v-btn @click="login" :disabled="!valid || loading" :loading="loading">
            Login
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  export default {
    data: () => ({
      valid: false,
      payload: {
        // email: '',
        // password: ''
        email: 'alontalmor@gmail.com',
        password: '123456'
      },
      rules: {
        email: [
          v => !!v || 'E-mail is required',
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            'E-mail must be valid'
        ],
        password: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Password must be at least 6 characters'
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
      showSnackbar(user) {
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
            this.$router.push({ name: 'AppMain' });
            this.showSnackbar(user);
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

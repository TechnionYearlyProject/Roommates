<template>
  <v-container>
    <v-alert type="error" :value="alert.show" transition="scale-transition">
      {{ alert.message }}
    </v-alert>
    <v-layout>
      <v-flex>
        <v-form v-model="valid">
          <v-text-field label="E-mail" type="email" prepend-icon="email" v-model="payload.email" :rules="rules.email" required></v-text-field>
          <v-text-field label="Password" type="password" prepend-icon="lock" v-model="payload.password" :rules="rules.password" required></v-text-field>
          <v-btn @click="login" :disabled="!valid">
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
        message: ''
      }
    }),
    methods: {
      popLoginAlert() {
        this.alert.message = 'Invalid credentials';
        this.alert.show = true;
      },
      disableAlert() {
        this.alert.message = '';
        this.alert.show = false;
      },
      login() {
        // alert('login');
        this.$store
          .dispatch('login', this.payload)
          .then(user => {
            this.disableAlert();
            console.log(user);
            //this.$router.push({ name: 'AppMain' });
          })
          .catch(error => {
            this.popLoginAlert();
          });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

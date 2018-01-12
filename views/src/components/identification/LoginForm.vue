<template>
  <b-container>
    <b-card header-tag="header" bg-variant="light">
      <h1 slot="header" class="mb-0">Login</h1>
      <b-row>
        <b-col cols="12">
          <b-alert show variant="danger" v-if="error">
           {{ error }}
          </b-alert>
        </b-col>
        <b-col cols="12">
          <b-form-group horizontal breakpoint="md" class="mb-1" label-class="text-sm-left" label="Email:" label-for="loginEmail">
            <b-form-input id="loginEmail" type="email" v-model="email"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group horizontal breakpoint="md" class="mb-1" label-class="text-sm-left" label="Password:" label-for="loginPassword">
            <b-form-input id="loginPassword" type="password" v-model="password"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" class="mt-4">
          <b-button size="lg" variant="success" class="center-button" @click="login">
            Login
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import EventBus from "@/event-bus/EventBus";

  export default {
    data() {
      return {
        email: "",
        password: "",
        error: ""
      };
    },
    methods: {
      login() {
        this.$http
          .post("users/login", {
            email: this.email,
            password: this.password
          })
          .then(res => {
            const token = res.headers.get('x-auth');
            const expiration = res.headers.get('x-expiration');
            this.$auth.setToken(token, expiration);
            this.$router.push({ name: 'main-page' });
            EventBus.emitLogin();
          })
          .catch(e => {
            this.error =  'Invalid cradentials';
          });
      }
    }
  };
</script>

<style>
  .center-button {
    margin: auto;
    display: block;
  }
</style>

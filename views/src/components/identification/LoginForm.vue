<template>
    <b-container>
        <b-card header-tag="header" bg-variant="light">
            <h1 slot="header" class="mb-0">Login</h1>
            <b-row>
                <b-col cols="12" style="height: 70px">
                    <b-form-group horizontal breakpoint="md" class="mb-3" label-class="text-sm-left" label="Email:" label-for="loginEmail">
                        <b-form-input id="loginEmail" type="email" v-model="email" />
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-form-group horizontal breakpoint="md" class="mb-3" label-class="text-sm-left" label="Password:" label-for="loginPassword">
                        <b-form-input id="loginPassword" type="password" v-model="password" />
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-alert show variant="danger" v-if="error">
                        {{ error }}
                    </b-alert>
                </b-col>
                <b-col cols="12" class="mt-4">
                    <b-button size="lg" variant="primary" class="center-button" @click="login">
                        Login
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
    </b-container>
</template>

<script>
    import bContainer from "bootstrap-vue/es/components/layout/container";
    import bRow from "bootstrap-vue/es/components/layout/row";
    import bCol from "bootstrap-vue/es/components/layout/col";
    import bCard from "bootstrap-vue/es/components/card/card";
    import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
    import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
    import bButton from "bootstrap-vue/es/components/button/button";
    import bAlert from "bootstrap-vue/es/components/alert/alert";

    import EventBus from "@/event-bus/EventBus";
    import { SAVE_USER } from "@/vuex/constant-mutations";

    export default {
      data() {
        return {
          email: "",
          password: "",
          error: ""
        };
      },
      components: {
        bContainer,
        bRow,
        bCol,
        bCard,
        bFormInput,
        bFormGroup,
        bButton,
        bAlert
      },
      methods: {
        login() {
          this.error = "";
          this.$http
            .post("users/login", {
              email: this.email,
              password: this.password
            })
            .then(payload => {
              console.log(payload);
              const user = payload.body.user
              this.$store.commit(SAVE_USER, user);
              if (user.isVerified) {
                EventBus.emitLogin(payload.headers);
                this.$router.push({ name: "main-page" });
              } else {
                this.$router.push({
                  name: "verification-request",
                  params: {
                    header:
                      "You have yet to verify your account"
                  }
                });
              }
            })
            .catch(err => {
              this.error = err.body.message;
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

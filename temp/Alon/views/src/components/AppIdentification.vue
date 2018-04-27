<template>
    <v-container :class="{ 'pa-0': $vuetify.breakpoint.smAndDown }">
        <v-layout row warp>
            <v-flex md-1>
                <v-card class="pb-5" :class="{'small-screen-card': $vuetify.breakpoint.smAndDown, 'elevation-0': $vuetify.breakpoint.smAndDown}">
                    <div v-if="e2 === 'login'" class="pb-5">
                        <app-login />
                        <v-card-text class="py-0">
                            <small>
                                Not registered yet? click on
                                <span class="primary--text">"Register"</span>
                                below!
                            </small>
                        </v-card-text>
                    </div>
                    <app-register v-if="e2 === 'register'" class="pb-5" />
                    
                    <v-bottom-nav absolute :value="true" :active.sync="e2" :color="color" flat class="elevation-0" height="66">
                        <v-btn dark value="login">
                            <span>Login</span>
                            <v-icon>lock_open</v-icon>
                        </v-btn>
                        <v-btn dark value="register">
                            <span>Register</span>
                            <v-icon>assignment</v-icon>
                        </v-btn>
                    </v-bottom-nav>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import AppLogin from './AppLogin';
    import AppRegister from './AppRegister';

    export default {
      data() {
        return {
          e2: 'login'
        };
      },

      computed: {
        color() {
          switch (this.e2) {
            case 'login':
              return 'primary darken-1';
            case 'register':
              return 'primary darken-1';
            default:
              return '';
          }
        }
      },
      components: {
        AppLogin,
        AppRegister
      }
    };
</script>

<style scoped>
    .small-screen-card {
      min-height: 83vh;
    }
</style>

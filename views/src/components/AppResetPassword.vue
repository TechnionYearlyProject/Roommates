<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-card class="pb-3">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-2 secondary--text"> Password Reset</h3>
              <v-divider></v-divider>
              <div v-if="!showResetForm">
                <p class="mt-3 mb-1">
                  Enter your email address below to reset your password. You will be sent an email which you will need to open to continue.
                </p>
                <p class="mb-4">
                  This procedure is required in order to assure you are the rightful owner of the account.
                </p>
                <v-text-field label="Email" type="email" prepend-icon="mail" v-model="payload.email" :error-messages="emailMessages" :disabled="emailSent" required></v-text-field>
              </div>
              <div v-else>
                <p class="mt-3 mb-1">
                  Enter your new account password below. Once confirmed, your new password will be active.
                </p>
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-form>
                        <v-text-field label="E-mail" type="email" prepend-icon="email" v-model="payload.email" :error-messages="emailMessages" required></v-text-field>
                        <v-text-field label="Password" type="password" prepend-icon="lock" v-model="payload.password" :rules="rules.password" required></v-text-field>
                        <v-text-field label="Password (again)" type="password" prepend-icon="lock" v-model="passwordAgain" :rules="rules.passwordAgain" required></v-text-field>
                      </v-form>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="!emailSent" @click="showResetForm? resetPassword() : sendResetMail()" color="primary" :disabled="loading" :loading="loading">
              Submit
              <v-icon right>send</v-icon>
            </v-btn>
            <div v-else class="accept--text mr-1 mt-1 subheading">
              Email was sent
              <v-icon right color="accept">check_circle</v-icon>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        payload: {
          email: null,
          password: ''
        },
        passwordAgain: '',
        loading: false,
        emailMessages: [],
        emailSent: false,
        showResetForm: false,
        rules: {
          password: [
            v => !!v || 'Password is required',
            v => v.length >= 6 || 'Password must be at least 6 characters'
          ],
          passwordAgain: [
            v => !!v || 'Please re-enter your password',
            v => v === this.payload.password || 'Passwords do not match'
          ]
        }
      };
    },
    methods: {
      showSentSnackbar() {
        this.$store.commit(
          'showSnackbar',
          'Password reset was sent to your email, please check your inbox to continue'
        );
      },
      showResetSnackbar() {
        this.$store.commit(
          'showSnackbar',
          'Your password was reset! You can now login to your account using your new password'
        );
      },
      showInvalidEmail() {
        this.emailMessages = 'This is not a valid email';
      },
      showFailureSnackbar() {
        this.$store.commit(
          'showSnackbar',
          "Oops.. something didn't go well, please retry again or contact us"
        );
      },
      sendResetMail() {
        if (!this.isValidEmail) {
          this.showInvalidEmail();
          return;
        }
        this.errorMessages = [];
        this.loading = true;
        this.$store
          .dispatch('sendResetMail', this.payload)
          .then(() => {
            this.emailSent = true;
            this.showSentSnackbar();
          })
          .catch(() => {
            this.showInvalidEmail();
          })
          .then(() => {
            this.loading = false;
          });
      },
      resetPassword() {
        if (!this.isValidEmail) {
          this.showInvalidEmail();
          return;
        }
        this.errorMessages = [];
        this.loading = true;
        this.$store
          .dispatch('resetPassword', {
            jwt: this.$route.params.token,
            payload: this.payload
          })
          .then(() => {
            this.$router.push({ name: 'AppIdentification' });
            this.showResetSnackbar();
          })
          .catch(() => {
            this.showFailureSnackbar();
          })
          .then(() => {
            this.loading = false;
          });
      }
    },
    computed: {
      isValidEmail() {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          this.payload.email
        );
      }
    },
    created() {
      if (this.$route.params.token) {
        this.showResetForm = true;
      }
    }
  };
</script>

<style>

</style>

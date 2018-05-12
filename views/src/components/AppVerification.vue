<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-card class="pb-3">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-2 secondary--text"> You need to verify your account to start using all the fun features!</h3>
              <v-divider></v-divider>
              <div class="mt-3 mb-4">
                If you haven't recieved the verification link to your e-mail you can try and resend it.
                <h3 class="my-1">&ldquo;Wait! What should I do?&rdquo;</h3>
                We are glad you've asked! All you need to do is to follow these 3 steps:
                <ol class="ml-3">
                  <li>type in your password below</li>
                  <li>click on "{{ resendButtonText }}" button</li>
                  <li>check your mailbox</li>
                </ol>
              </div>
              <v-text-field label="Password" prepend-icon="lock" v-model="payload.password" :append-icon="showPassword ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (showPassword = !showPassword)" :type="showPassword ? 'text' :'password'" :disabled="emailSent" required></v-text-field>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="!emailSent" color="primary" @click="sendVerificationMail">{{ resendButtonText }}
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
        password: null,
      },
      resendButtonText: 'resend verification link',
      showPassword: false,
      emailSent: false,
    };
  },
  methods: {
    showSentSnackbar() {
      this.$store.commit(
        'showSnackbar',
        'Verification mail was sent, please check your mailbox'
      );
    },
    showVerifiedSnackbar(user) {
      this.$store.commit(
        'showSnackbar',
        `Thank you ${user.firstName}, your account is now verified!`
      );
    },
    showFailureSnackbar() {
      this.$store.commit(
        'showSnackbar',
        "Oops.. something didn't go well, please retry again or contact us"
      );
    },
    sendVerificationMail() {
      this.$store
        .dispatch('sendVerificationMail', this.payload)
        .then(() => {
          this.emailSent = true;
          this.showSentSnackbar();
        })
        .catch(() => {
          this.showFailureSnackbar();
        });
    },
    verifyAccount() {
      this.$store.commit('showLoading');
      this.$store
        .dispatch('verifyAccount', this.$route.params.token)
        .then((user) => {
          this.$router.push({ name: 'AppMain' });
          this.showVerifiedSnackbar(user);
        })
        .catch(() => this.showFailureSnackbar())
        .then(() => this.$store.commit('hideLoading'));
    },
  },
  mounted() {
    this.payload.email = this.$store.getters.getUser.email;
    if (this.$route.params.token) {
      this.verifyAccount();
    }
  },
};
</script>

<style>
</style>

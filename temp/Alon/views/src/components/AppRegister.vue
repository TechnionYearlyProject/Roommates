<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-form v-model="valid">
          <v-text-field label="E-mail" type="email" prepend-icon="email" v-model="payload.email" :rules="rules.email" required></v-text-field>
          <v-text-field label="Password" prepend-icon="lock" v-model="payload.password" :rules="rules.password" :append-icon="showPassword ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (showPassword = !showPassword)" :type="showPassword ? 'text' :'password'" required></v-text-field>
          <v-layout row wrap>
            <v-flex xs12 sm5>
              <v-text-field label="First Name" prepend-icon="person" v-model="payload.firstName" :rules="rules.firstName" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 offset-sm1 offset-xs2>
              <v-text-field label="Last Name" v-model="payload.lastName"></v-text-field>
            </v-flex>
          </v-layout>
          <app-calendar-form @dateUpdated="payload.birthdate = new Date($event).getTime()" label="Birthday Date" :required="true" />
          <v-radio-group v-model="payload.gender" row required>
            <v-radio v-for="(gender,i) in genderList" :key="i" :label="gender.title" :value="gender.value"></v-radio>
          </v-radio-group>
          <v-btn @click="register" :disabled="!valid || loading" :loading="loading">
            Register
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  import AppCalendarForm from './AppCalendarForm';

  export default {
    data: () => ({
      valid: true,
      // payload: {
      //   email: '',
      //   password: '',
      //   firstName: '',
      //   lastName: '',
      //   birthdate: '',
      //   gender: ''
      // },
      payload: {
        email: 'alontalmor@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: new Date('1992-06-24').getTime(),
        gender: 'male'
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
        ],
        firstName: [
          v => !!v || 'Name is required',
          v => v.length >= 2 || 'Password must be at least 2 characters'
        ]
      },
      showPassword: false,
      genderList: [
        {
          title: 'Male',
          value: 'male'
        },
        {
          title: 'Female',
          value: 'female'
        }
      ],
      alert: {
        show: false,
        message: '',
        type: 'info'
      },
      loading: false
    }),
    methods: {
      showLoading() {
        this.loading = true;
      },
      hideLoading() {
        this.loading = false;
      },
      showSnackbarWelcome(user) {
        this.$store.commit(
          'showSnackbarWelcome',
          `Welcome ${
            user.firstName
          }! Check your e-mail for the verification link to complete the registration`
        );
      },
      async register() {
        try {
          this.showLoading();
          const user = await this.$store.dispatch('register', this.payload);
          await this.$store.dispatch('sendVerificationMail', {
            email: this.payload.email,
            password: this.payload.password
          });
          //location.reload();
          this.$router.push({ name: 'AppMain' });
          this.showSnackbarWelcome(user);
        } catch (error) {
          console.log(error);
        } finally {
          this.hideLoading();
        }
      }
    },
    components: {
      AppCalendarForm
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

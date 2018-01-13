<template>
  <b-container>
    <b-card header-tag="header" bg-variant="light">
      <h1 slot="header" class="mb-0">Register</h1>
      <b-row>

        <b-col cols="12">
          <checked-form @updated="updateEmail" label="Email:" labelFor="email" inputType="email" :state="emailState" :invalid-feedback="invalidEmailFeedback"></checked-form>
        </b-col>
        <b-col cols="12">
          <checked-form @updated="updatePassword" label="Password:" labelFor="password" inputType="password" :state="passwordState" :invalid-feedback="passwordEmailFeedback"></checked-form>
        </b-col>
        <b-col cols="12">
          <checked-form @updated="updateFirstName" label="first Name:" labelFor="firstName" :state="firstNameState"></checked-form>
        </b-col>
        <b-col cols="12">
          <checked-form @updated="updateLastName" label="Last Name:" labelFor="lastName" :state="lastNameState" placeholder="Optional"></checked-form>
        </b-col>
        <b-col cols="12">
          <calendar-form id='birthday' :initialDate="date" :disabledDates="disabledDates" label="Birthday:" @selected="updateDate"></calendar-form>
        </b-col>
        <b-col cols="12">
          <radio-form label="Gender:" :options="genderOptions" @changed="updateGender"></radio-form>
        </b-col>
        <b-col cols="12">
          <b-alert show variant="danger" v-if="error">
           {{ error }}
          </b-alert>
        </b-col>
        <b-col cols="12" class="mt-4">
          <b-button size="lg" variant="primary" class="center-button" @click="register">
            Register
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";
  import CheckedForm from "@/components/identification/CheckedForm.vue";
  import CalendarForm from "@/components/identification/CalendarForm.vue";
  import RadioForm from "@/components/identification/RadioForm.vue";
  import EventBus from "@/event-bus/EventBus";
  const validator = require("email-validator");

  const maxDate = Date.now() - (15 * 365 * 24 * 60 * 60 * 1000);
  export default {
    data() {
      return {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        gender: "",
        date: new Date(maxDate),
        error: "",

        genderOptions: [
          {
            text: "Male",
            value: "male"
          },
          {
            text: "Female",
            value: "female"
          }
        ],
        disabledDates: {
          from: new Date(maxDate + 1)
        }
      };
    },
    methods: {
      updateEmail(newEmail) {
        this.email = newEmail;
      },
      updatePassword(newPassword) {
        this.password = newPassword;
      },
      updateFirstName(newFirstName) {
        this.firstName = newFirstName;
      },
      updateLastName(newLastName) {
        this.lastName = newLastName;
      },
      updateDate(newDate) {
        this.date = newDate;
      },
      updateGender(newGender) {
        this.gender = newGender;
      },
      register() {
        if (!this.emailState || !this.passwordState || !this.firstNameState || !this.genderState || !this.date) {
          this.error = "Please fill all the required fields.";
        } else {
          this.error = "";
          this.$http
          .post("users", {
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthdate: this.date.getTime()
          }).then(res => {
            console.log(res);
            EventBus.emitLogin(res.headers);
            this.$router.push({ name: 'main-page' });
          })
          .catch(e => {
            this.error = e.body.message;
            console.log(e);
          });
        }
      }
    },
    computed: {
      emailState() {
        return this.email.length === 0 ? null : validator.validate(this.email);
      },
      invalidEmailFeedback() {
        if (this.emailState === null) {
          return "Please enter your email.";
        } else if (!this.emailState) {
          return "Please provide a valid email address.";
        } else {
          return "";
        }
      },
      passwordState() {
        return this.password.length === 0 ? null : this.password.length >= 6;
      },
      passwordEmailFeedback() {
        if (this.passwordState === null) {
          return "Please enter a password.";
        } else if (!this.passwordState) {
          return "Password must be at least 6 characters long.";
        } else {
          return "";
        }
      },
      firstNameState() {
        return this.firstName.length === 0 ? null : this.firstName.length > 1;
      },
      lastNameState() {
        return this.lastName.length > 0 ? true : null;
      },
      genderState() {
        return this.genderOptions.find(go=>go.value === this.gender)? true : false;
      }
    },
    components: {
      Icon,
      CheckedForm,
      CalendarForm,
      RadioForm
    }
  };
</script>

<style scoped>

</style>

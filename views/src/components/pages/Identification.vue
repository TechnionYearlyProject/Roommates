<template>
<b-container style="margin-top:5%">
  <b-row>
    <b-col md="6" order-md="1" class="mb-3">
      <login-form></login-form>
    </b-col>
    <b-col md="6" order-md="2">
      <register-form></register-form>
    </b-col>
  </b-row>
</b-container>
  
  
</template>

<script>
import RegisterForm from "@/components/identification/RegisterForm.vue";
import LoginForm from "@/components/identification/LoginForm.vue";

export default {
  components: {
    RegisterForm,
    LoginForm
  }
}
</script>

<style>

</style>

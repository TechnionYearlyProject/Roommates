<template>
  <header>
    <div class="container-fluid row">

        <div class="col-3">
          <router-link :to="{ name: 'home'}" class="navbar-brand">
            <img src="../../assets/imgs/logo.png" 
              class="r-nav-logo" 
              alt="Roommates-logo">
            <div class="r-nav-title" role="button">Roommates</div>
          </router-link>
        </div>

      <div class="col-9">
        <ul class="r-nav-links">
          <li>
              <a
                href="#" role="button" 
                id="dropdownRegister" 
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">Register</a>

                <form class="dropdown-menu px-4 r-register-form" aria-labelledby="dropdownRegister" style="overflow:hidden;">
                  <app-register-form></app-register-form>
                </form>
          </li>
          <li>
              <a
                href="#" role="button" 
                id="dropdownLogin" 
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">Login</a>

                <form class="dropdown-menu px-4 r-login-form" aria-labelledby="dropdownLogin" style="overflow:hidden;">
                  <app-login-form></app-login-form>
                </form>
          </li>
        </ul>   
      </div>

    </div>
  </header>
</template>

<script>
import LoginForm from "@/components/identification/LoginForm.vue";
import RegisterForm from "@/components/identification/RegisterForm.vue";

export default {
  components: {
    appLoginForm: LoginForm,
    appRegisterForm: RegisterForm
  }
};
</script>

<style>
header {
  background-color: #333;
  padding: 20px 20px;
  font-size: 100%;
}

.r-nav-logo {
  border-radius: 15%;
  width: 30px;
  height: 30px;
  margin-right: 3%;
  margin-bottom: 8px;
}

.r-nav-title {
  display: inline-block;
  font-size: 120%;
  text-decoration: none;
  color: #f1c40f;
  transition: color .2s;
}

.r-nav-title:hover,
.r-nav-title:active {
  color: #eee;
}

.r-nav-links {
  list-style: none;
  text-align: right;
  margin: 0;
  padding-top: 12px;
  word-spacing: 10px;
}

.r-nav-links li {
  display: inline-block;

}

.r-nav-links li a {
  padding-bottom: 5px;
}

.r-nav-links li a:link,
.r-nav-links li a:visited {
  text-decoration: none;
  color: #f1c40f;
  border-bottom: 2px solid transparent;
  transition: color .2s, border-bottom .2s;
}

.r-nav-links li a:hover,
.r-nav-links li a:active {
  color: #eee;
  border-bottom: 2px solid #eee;
}

.r-login-form,
.r-register-form {
  margin-top: 1%;
  margin-right: 50px;
}
</style>

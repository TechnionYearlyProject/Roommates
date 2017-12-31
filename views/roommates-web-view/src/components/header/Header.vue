<template>
  <header>
    <div class="container-fluid row">

        <div class="col-4 col-sm-1 col-md-3">
          <router-link :to="{ name: 'home'}" class="navbar-brand">
            <img src="../../assets/imgs/logo.png" 
              class="r-nav-logo" 
              alt="Roommates-logo">
            <div class="r-nav-title" role="button">Roommates</div>
          </router-link>
        </div>

        <div class="col-7 col-sm-7 col-md-6 s-main-search-box-1">
          <app-main-search-box></app-main-search-box>
        </div>

      <div class="col-8 col-sm-4 col-md-3">
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

        <div class="container-fluid s-main-search-box-2">
          <app-main-search-box></app-main-search-box>
        </div>
      </div>

    </div>
  </header>
</template>

<script>
import LoginForm from "@/components/identification/LoginForm.vue";
import RegisterForm from "@/components/identification/RegisterForm.vue";
import MainSearchBox from "@/components/search-box/mainSearchBox.vue";
export default {
  components: {
    appLoginForm: LoginForm,
    appRegisterForm: RegisterForm,
    appMainSearchBox: MainSearchBox
  }
};
</script>

<style>
header {
  background-color: #333;
  padding: 40px 20px;
  font-size: 100%;
  margin-bottom: 90px;
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

.s-main-search-box-2 {
  display:none;
  margin-top:20px;
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

@media only screen and (max-width: 768px) {
          .r-nav-title {
          display: none;
          }
        }

@media only screen and (max-width: 576px) {
  header {
    margin-bottom: 50px;
  }

  .s-main-search-box-1 {
    display: none;
  }
      
  .s-main-search-box-2 {
    display: inline-block;
  }
}
</style>

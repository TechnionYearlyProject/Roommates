<template>
  <!-- register-area -->
  <div class="register-area" style="background-color: rgb(250, 250, 250);">
    <div class="container">

      <div class="col-md-6">
        <div class="box-for overflow">
          <div class="col-md-12 col-xs-12 register-blocks">
            <h2>New account : </h2>
            <form action="" method="post">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" id="email">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password">
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-default">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="box-for overflow">
          <div class="col-md-12 col-xs-12 login-blocks">
            <h2>Login : </h2>
            <form action="" method="post">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" id="email">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password">
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-default"> Log in</button>
              </div>
            </form>
            <br>

            <h2>Social login :  </h2>

            <p>
              <a class="login-social" href="#"><i class="fa fa-facebook"></i>&nbsp;Facebook</a>
              <a class="login-social" href="#"><i class="fa fa-google-plus"></i>&nbsp;Gmail</a>
              <a class="login-social" href="#"><i class="fa fa-twitter"></i>&nbsp;Twitter</a>
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
        name: "login-page"
    }
</script>

<style scoped>

  .col-md-6{
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;

    float: left;
  }
  .col-xs-12 {
    width: 100%;
  }

  .col-xs-12 .col-md12{
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;

  }

  .register-area .col-md-6 {
    margin-bottom: 15px;


  }
  h2{
    font-weight: 400;
    font-size: 1.5em;
    margin: 0.83em 0;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
    margin-top: 20px;
    margin-bottom: 10px;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    text-transform: uppercase;
    margin-bottom: 15px;
    background: transparent none repeat scroll 0% 0%;
    border-bottom: 2px solid #c72d2d;
    font-size: 20px;
    line-height: 30px;
  }

  /*.register-blocks{*/
    /*text-align: center;*/
    /*margin: 300px;*/
  /*}*/
  /*.login-blocks{*/
    /*text-align: center;*/
    /*margin: 300px;*/
  /*}*/
  .box-for {
    padding: 10px 0px;
    border: 1px solid #EEE;
    transition: all 0.2s ease 0s;
    box-shadow: none;
    background-color: #FFF;
    height: 440px;
  }

  div {
    display: block;
  }
  .container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    height: 500px;
  }





  .btn-default {
    border-radius: 1px;
    padding: 10px 20px;
    border: 1px solid #c72d2d;
    color: #000;
    /*background-color: #c74a2d;*/
    background-color: #c72d2d;

    border-color: #F0F0F0;
    font-weight: 600;
  }

  style.css:194
  .btn-default {
    color: #777777;
    border-color: #999999;
  }
  style.css:164
  .btn {
    border-width: 2px;
    background-color: rgba(0,0,0,.0);
    font-weight: 400;
    opacity: 0.8;
    padding: 8px 16px;
  }
  bootstrap.min.css:5
  .btn-default {
    color: #333;
    background-color: #fff;
    border-color: #ccc;
  }
  bootstrap.min.css:5
  .btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
  }

  .container {
    width: 1250px;
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 25px;
    margin-right: auto;
    margin-left: auto;
  }




  .login-social {
    display: inline-table;
    margin-bottom: 15px;
    padding: 10px 15px;
    background-color: #7A7878;
    color: rgb(255, 255, 255);
  }

  style
  a {
    color: #d27e04;
    outline: 0;
    font-weight: bold;
    -webkit-transition: all .8s ease;
    transition: all .8s ease;
  }

  a {
    color: #337ab7;
    text-decoration: none;
    background-color: transparent;


  }




  .container {

  }

</style>

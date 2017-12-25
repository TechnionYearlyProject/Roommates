<template>
    <div class="register-area" style="background-color: rgb(250, 250, 250);">
        <div class="container">
            <div class="col-md-6">
                <div class="box-for overflow">
                    <div class="col-md-12 col-xs-12 register-blocks">
                        <h2>Create New Account: </h2>
                        <form action="" method="post">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" class="form-control" id="name">
                            </div>
                            <div class="form-group">
                                <label for="sign-up-email">Email</label>
                                <input type="text" class="form-control" id="sign-up-email">
                            </div>
                            <div class="form-group">
                                <label for="sign-up-password">Password</label>
                                <input type="password" class="form-control" id="sign-up-password">
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-default">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="box-for overflow">
                    <div class="col-md-12 col-xs-12 login-blocks">
                        <h2>Sign In : </h2>
                        <form action="" method="post">
                            <div class="form-group">
                                <label for="sign-in-email">Email</label>
                                <input type="text" class="form-control" id="sign-in-email">
                            </div>
                            <div class="form-group">
                                <label for="sign-in-password">Password</label>
                                <input type="password" class="form-control" id="sign-in-password">
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-default">Sign in</button>
                            </div>
                        </form>
                        <br>

                        <h2>Social login : </h2>

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

    .col-md-6 {
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;

        float: left;
    }

    .col-xs-12 {
        width: 100%;
    }

    .register-area .col-md-6 {
        margin-bottom: 15px;

    }

    h2 {
        font-family: inherit;
        font-weight: 500;
        color: inherit;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        text-transform: uppercase;
        margin: 20px 0 15px;
        background: transparent none repeat scroll 0 0;
        border-bottom: 2px solid #c72d2d;
        font-size: 20px;
        line-height: 30px;
    }

    .box-for {
        padding: 10px 0;
        border: 1px solid #eee;
        transition: all 0.2s ease 0s;
        box-shadow: none;
        background-color: #FFF;
        height: 450px;
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
        border: 1px solid #f0f0f0;
        color: #fff;
        background-color: #c72d2d;
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
        background-color: #7a7878;
        color: #fff;
    }

    a {
        text-decoration: none;
    }
</style>

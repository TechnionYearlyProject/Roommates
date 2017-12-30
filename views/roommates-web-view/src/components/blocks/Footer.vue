// --= TEMPLATE =-- //
<template>
  <footer>
    <div class="container-fluid row">
                <div class="col-sm-6">
                    <ul class="r-footer-nav">
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">iOS App</a></li>
                        <li><a href="#">Android App</a></li>
                    </ul>
                </div>
                <div class="col-sm-6 xxs-text-align">
                    <ul class="r-social-links">
                        <li><a href="#"><i class="ion-social-facebook"></i></a></li>
                        <li><a href="#"><i class="ion-social-twitter"></i></a></li>
                        <li><a href="#"><i class="ion-social-googleplus"></i></a></li>
                        <li><a href="#"><i class="ion-social-instagram"></i></a></li>
                    </ul>
                </div>
            </div>
            <div class="container-fluid row">
              <div class="col-12">
                <p>
                    Coppyright &copy; 2017 by Roommates. All right reserved.
                </p>
              </div>
            </div>
  </footer>
</template>

// --= SCRIPT =-- //
<script>
export default {};
</script>

// --= STYLE =-- //
<style>
footer {
  background-color: #333;
  padding: 30px 30px 10px 30px;
  font-size: 80%;
}

.r-footer-nav {
  list-style: none;
  float: left;
}

.r-social-links {
  list-style: none;
  float: right;
}

.r-footer-nav li,
.r-social-links li {
  display: inline-block;
  margin-right: 20px;
}

.r-footer-nav li:last-child,
.r-social-links li:last-child {
  margin-right: 0;
}

.r-footer-nav li a:link,
.r-footer-nav li a:visited,
.r-social-links li a:link,
.r-social-links li a:visited {
  text-decoration: none;
  border: 0;
  color: #999;
  transition: color 0.3s;
}

.r-footer-nav li a:hover,
.r-footer-nav li a:active {
  color: #fff;
}

.r-social-links li a:link,
.r-social-links li a:visited {
    font-size: 160%;
}

.ion-social-facebook,
.ion-social-twitter,
.ion-social-googleplus,
.ion-social-instagram {
    transition: color 0.3s;
}

.ion-social-facebook:hover {
    color: #3b5998;
}

.ion-social-twitter:hover {
    color: #00aced;
}

.ion-social-googleplus:hover {
    color: #dd4b39;
}

.ion-social-instagram:hover {
    color: #517fa4;
}

footer p {
    color: #999;
    text-align: left;
    margin-top: 20px;
}
</style>

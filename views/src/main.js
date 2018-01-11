import Vue from 'vue';
import 'vue-awesome/icons';
import BootstrapVue from 'bootstrap-vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueResource from 'vue-resource';

import '@/../static/css/style.css';
require ('../static/js/string-utils.js');
import App from './App.vue';
import router from './router';


Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Icon);
Vue.use(VueResource);

Vue.http.options.root = process.env.SERVER_URI;
Vue.http.headers.common['x-auth'] = 'x-auth';
Vue.http.interceptors.push((request, next) => {
  next();
});

new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
});

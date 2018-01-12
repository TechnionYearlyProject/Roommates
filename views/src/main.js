import Vue from 'vue';
import 'vue-awesome/icons';
import BootstrapVue from 'bootstrap-vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueResource from 'vue-resource';

import '@/../static/css/style.css';
require('../static/js/string-utils.js');
import App from './App.vue';
import router from './router';
import Auth from '@/auth/Auth.js'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Icon);
Vue.use(VueResource);
Vue.use(Auth);

Vue.http.options.root = process.env.SERVER_URI;
Vue.http.headers.common['x-auth'] = 'x-auth';
Vue.http.interceptors.push((request, next) => {
  next();
});

// router.beforeEach(
//   (to, from, next) => {
//     if (to.matched.some(record => record.meta.forVisitors)) {
//       if (Vue.auth.isAuthenticated()) {
//         console.log('authenticated')
//         next({ name: 'main-page' });
//       } else {
//         next();
//       }
//     } else if (to.matched.some(record => record.meta.forAuth)) {
//       if (!Vue.auth.isAuthenticated()) {
//         console.log('not authenticated')
//         next({ name: 'identification' });
//       } else {
//         next();
//       }
//     } else {
//       next();
//     }
//   }
// );

new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
});

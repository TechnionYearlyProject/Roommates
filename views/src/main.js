// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.min.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import SocialSharing from 'vue-social-sharing';
import App from './App';
import router from './router';
import './assets/stringAssets';
import store from './store';
import GoogleMaps from './services/google-maps';
import './sockets';

Vue.use(Vuetify, {
  theme: {
    primary: '#3F51B5',
    secondary: '#E91E63',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    accept: '#009688',
    cancel: '#E91E63'
  }
});
Vue.use(VueAxios, axios);
Vue.use(GoogleMaps);
Vue.use(SocialSharing);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

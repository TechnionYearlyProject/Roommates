import Vue from 'vue';
import router from './router';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import '@/../static/css/style.css';

import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Icon);

new Vue({
    el: '#app',
    router,
    template: '<App />',
    components: { App }
});

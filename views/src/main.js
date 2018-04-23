import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import BootstrapVue from 'bootstrap-vue';
import VueSocketio from 'vue-socket.io';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from '@/App.vue';
import router from '@/router';
import Auth from '@/auth/Auth.js';
import { store } from '@/vuex/store.js';
import '@/../static/css/style.css';
import '@/../static/js/string-utils.js';
import '@/configuration/register-icons.js';

Vue.config.productionTip = false; // Don't show Vue's annoying tips in the console
Vue.use(BootstrapVue);
Vue.use(VueSocketio, 'http://localhost:2000');
Vue.use(Icon);
Vue.use(VueResource);
Vue.use(Auth);

Vue.http.options.root = process.env.SERVER_URI;
Vue.http.headers.common['x-auth'] = 'x-auth';
Vue.http.interceptors.push((request, next) => {
    if (Vue.auth.isAuthenticated()) {
        request.headers.set('X-Auth', Vue.auth.getToken());
    }

    next();
});

router.beforeEach(
    (to, from, next) => {
        if (to.matched.some(record => record.meta.forVisitors)) {
            if (Vue.auth.isAuthenticated()) {
                console.log('authenticated');
                next({ name: 'main-page' });
            } else {
                next();
            }
        } else if (to.matched.some(record => record.meta.forAuth)) {
            if (!Vue.auth.isAuthenticated()) {
                console.log('not authenticated');
                next({ name: 'identification' });
            } else {
                next();
            }
        } else {
            next();
        }
    }
);

new Vue({
    el: '#app',
    router,
    store,
    template: '<App />',
    components: { App }
});

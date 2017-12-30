import Vue from 'vue'
import App from './App'
import router from './router'

import '../static/style/reset.css'
import '../static/style/fontawesome/css/fontawesome-all.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    template: '<App />',
    components: { App }
});

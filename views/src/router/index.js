import Vue from 'vue'
import Router from 'vue-router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import MainPage from '../components/MainPage'
import RegistrationPage from '../components/RegistrationPage'
import LoginPage from '../components/LoginPage'
import ApartmentPage from '../components/ApartmentPage'

Vue.use(Router)
Vue.use(BootstrapVue)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main-page',
            component: MainPage
        },
        {
            path: '/register',
            name: 'registration-page',
            component: RegistrationPage
        },
        {
            path: '/login',
            name: 'login-page',
            component: LoginPage
        },
        {
            path: '/apartment/:id',
            name: 'apartment-page',
            component: ApartmentPage
        }
    ]
})

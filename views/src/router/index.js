import Vue from 'vue'
import Router from 'vue-router'

import MainPage from '../components/MainPage'
import SignInPage from '../components/SignInPage'
import ApartmentPage from '../components/ApartmentPage'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main-page',
            component: MainPage
        },
        {
            path: '/sign-in',
            name: 'sign-in-page',
            component: SignInPage
        },
        {
            path: '/apartment/:id',
            name: 'apartment-page',
            component: ApartmentPage
        }
    ]
})

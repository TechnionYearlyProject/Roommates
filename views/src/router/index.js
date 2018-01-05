import Vue from 'vue';
import Router from 'vue-router';

import MainPage from '@/components/pages/Main'
import ApartmentPage from '@/components/pages/Apartment'
import AddApartmentPage from '@/components/pages/AddApartment'

Vue.use(Router);

const routes = [
    { path: '/', name: 'main-page', component: MainPage },
    { path: '/apartments/:id', name: 'apartment-page', component: ApartmentPage },
    { path: '/add', name: 'add-apartment-page', component: AddApartmentPage }
];

export default new Router({
    routes
});

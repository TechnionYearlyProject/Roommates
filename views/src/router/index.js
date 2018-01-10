import Vue from 'vue';
import Router from 'vue-router';

import MainPage from '@/components/pages/Main'
import ApartmentPage from '@/components/pages/Apartment'
import UserProfilePage from '@/components/pages/UserProfile'
import AddApartmentPage from '@/components/pages/AddApartment'
import InterestedApartments from '@/components/pages/InterestedApartments'
import UserPanel from '@/components/pages/UserPanel'
import HobbiesSelection from '@/components/pages/HobbiesSelection'

Vue.use(Router);

const routes = [
    { path: '/', name: 'main-page', component: MainPage },
    { path: '/apartments/:id', name: 'apartment-page', component: ApartmentPage },
    { path: '/add', name: 'add-apartment-page', component: AddApartmentPage },
    { path: '/users/:id/interested', name: 'interested-apartments', component: InterestedApartments },
    { path: '/users/:id/hobbies', name: 'select-hobbies', component: HobbiesSelection, props: true },
    { path: '/users/:id/profile', name: 'user-profile', component: UserProfilePage, props: true },
    { path: '/users/:id/control-panel', name: 'user-panel', component: UserPanel, props: true }
];

export default new Router({
    routes
});

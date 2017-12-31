import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import ApartmentPage from '@/components/Apartment.vue';

Vue.use(Router);

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/apartment/:id', name: 'apartment-page', component: ApartmentPage }
];

export default new Router({
  routes
});

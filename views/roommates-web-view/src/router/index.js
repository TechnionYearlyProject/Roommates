import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import ApartmentPage from '@/components/Apartment.vue';
import AddApartmentPage from '@/components/AddApartment.vue'

Vue.use(Router);

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/apartment/:id', name: 'apartment-page', component: ApartmentPage },
  { path: '/apartment', name: 'add-apartment-page', component: AddApartmentPage }
];

export default new Router({
  routes
});

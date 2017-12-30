import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/mainPage/Home.vue';
import ApartmentPage from '@/components/apartmentPage/ApartmentPage.vue';

Vue.use(Router);

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/apartment/:id', name: 'apartment-page', component: ApartmentPage }
}
];

export default new Router({
  routes
});

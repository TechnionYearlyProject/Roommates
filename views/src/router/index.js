import Vue from 'vue';
import Router from 'vue-router';
import AppMain from '@/components/AppMain';
import AppIdentification from '@/components/AppIdentification';
import AppVerification from '@/components/AppVerification';
import AppUserProfile from '@/components/AppUserProfile';
import AppPublishApartment from '@/components/AppPublishApartment';
import store from '../store';
// import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    // },
    {
      path: '/',
      name: 'AppMain',
      component: AppMain,
    },
    {
      path: '/identification',
      name: 'AppIdentification',
      component: AppIdentification,
      meta: {
        rejectsAuth: true
      }
    },
    {
      path: '/verification/:token?',
      name: 'AppVerification',
      alias: '/users/verify/:token',
      component: AppVerification,
      meta: {
        requiresAuth: true,
        rejectsVerify: true
      }
    },
    {
      path: '/user-profile',
      name: 'AppUserProfile',
      component: AppUserProfile,
      meta: {
        requiresVerify: true
      }
    },
    {
      path: '/advertise',
      name: 'AppPublishApartment',
      component: AppPublishApartment,
      meta: {
        requiresVerify: true
      }
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuthenticated) {
    next({ name: 'AppIdentification' });
  } else if (to.matched.some(record => record.meta.rejectsAuth) && store.getters.isAuthenticated) {
    next({ name: 'AppMain' });
  } else if (to.matched.some(record => record.meta.requiresVerify) && !store.getters.isAuthenticated) {
    next({ name: 'AppIdentification' });
  } else if (to.matched.some(record => record.meta.requiresVerify) && !store.getters.isVerified) {
    next({ name: 'AppVerification' });
  } else if (to.matched.some(record => record.meta.rejectsVerify) && store.getters.isVerified) {
    next({ name: 'AppMain' });
  } else {
    next();
  }
});

export default router;

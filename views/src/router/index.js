import Vue from 'vue';
import Router from 'vue-router';
import AppMain from '@/components/AppMain';
import AppAboutUs from '@/components/AppAboutUs';
import AppIdentification from '@/components/AppIdentification';
import AppVerification from '@/components/AppVerification';
import AppResetPassword from '@/components/AppResetPassword';
import AppUserProfile from '@/components/AppUserProfile';
import AppPublishApartment from '@/components/AppPublishApartment';
import AppApartmentPage from '@/components/AppApartmentPage';
import AppReviews from '@/components/AppReviews';
import AppPayment from '@/components/AppPayment';
import AppChat from '@/components/AppChat';
import store from '../store';
// import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/test',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      name: 'AppMain',
      component: AppMain
    },
    {
      path: '/App/about_us',
      name: 'AppAboutUs',
      component: AppAboutUs
    },
    {
      path: '/App/identification',
      name: 'AppIdentification',
      component: AppIdentification,
      meta: {
        rejectsAuth: true
      }
    },
    {
      path: '/App/verification/:token?',
      name: 'AppVerification',
      alias: '/users/verify/:token',
      component: AppVerification,
      meta: {
        requiresAuth: true,
        rejectsVerify: true
      }
    },
    {
      path: '/App/reset_password/:token?',
      name: 'AppResetPassword',
      alias: '/users/reset-password/:token',
      component: AppResetPassword
    },
    {
      path: '/App/user_profile/:id?',
      name: 'AppUserProfile',
      component: AppUserProfile,
      meta: {
        requiresVerify: true
      }
    },
    {
      path: '/App/advertise',
      name: 'AppPublishApartment',
      component: AppPublishApartment,
      meta: {
        requiresVerify: true
      }
    },
    {
      path: '/App/apartments/:id',
      name: 'AppApartmentPage',
      props: true,
      component: AppApartmentPage,
    },
    {
      path: '/App/reviews/:location?',
      name: 'AppReviews',
      props: true,
      component: AppReviews
    },
    {
      path: '/App/payment',
      name: 'AppPayment',
      component: AppPayment
    },
    {
      path: '/App/chat',
      name: 'AppChat',
      component: AppChat,
      meta: {
        requiresVerify: true
      }
    }
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuthenticated) {
    next({ name: 'AppIdentification' });
  } else if (to.matched.some(record => record.meta.rejectsAuth) && store.getters.isAuthenticated) {
    next({ name: 'AppMain' });
  } else if ( to.matched.some(record => record.meta.requiresVerify) && !store.getters.isAuthenticated) { // eslint-disable-line
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

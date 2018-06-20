<template>
  <v-app>
    <app-toolbar/>
    <v-content>
      <!-- <v-container fluid> -->
      <app-loader :loading="getLoadingStatus" />
      <router-view :key="$route.fullPath"/>
      <app-snackbar :text="getSnackbarText" />
      <!-- </v-container> -->
    </v-content>
    <app-footer/>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import AppToolbar from './components/AppToolbar';
import AppLoader from './components/AppLoader';
import AppSnackbar from './components/AppSnackbar';
import AppFooter from './components/AppFooter';

export default {
  computed: {
    ...mapGetters(['getLoadingStatus', 'getSnackbarText', 'isAuthenticated']),
  },
  components: {
    AppToolbar,
    AppLoader,
    AppSnackbar,
    AppFooter,
  },
  name: 'App',
  methods: {
    ...mapMutations(['toggleDrawer', 'startSession']),
    loadInitialState() {
      // this.toggleDrawer(this.$vuetify.breakpoint.mdAndUp);
      if (this.isAuthenticated) {
        this.startSession(); // need to set up the session first
        this.$store.dispatch('fetchSelf')
        .then(() => {
          // eslint-disable-next-line
          console.log('[authorized] fetched self');
          this.$store.dispatch('socket_createConnection');
        })
        .catch(() => {
          // if the server failed to fetch the user it means that he is no longer authorized
          this.$store.commit('setUser', null);
          this.$store.commit('endSession');
        });
      }
    },
  },
  beforeCreate() {
    this.$store.commit('showLoading');
  },
  created() {
    this.loadInitialState();
  },
  mounted() {
    this.$store.commit('hideLoading');
  }
};
</script>

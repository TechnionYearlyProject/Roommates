<template>
  <v-app>
    <app-toolbar/>
    <v-content>
      <!-- <v-container fluid> -->
      <app-loader :loading="getLoadingStatus" />
      <router-view/>
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
      ...mapGetters(['getLoadingStatus', 'getSnackbarText', 'isAuthenticated'])
    },
    components: {
      AppToolbar,
      AppLoader,
      AppSnackbar,
      AppFooter
    },
    name: 'App',
    methods: {
      ...mapMutations(['toggleDrawer', 'startSession']),
      loadInitialState() {
        // this.toggleDrawer(this.$vuetify.breakpoint.mdAndUp);
        if (this.isAuthenticated) {
          this.startSession();
        }
      }
    },
    created() {
      this.loadInitialState();
    }
  };
</script>

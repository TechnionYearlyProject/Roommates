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
import { mapGetters } from 'vuex';
import AppToolbar from './components/AppToolbar';
import AppLoader from './components/AppLoader';
import AppSnackbar from './components/AppSnackbar';
import AppFooter from './components/AppFooter';

export default {
  computed: {
    ...mapGetters(['getLoadingStatus', 'getSnackbarText'])
  },
  components: {
    AppToolbar,
    AppLoader,
    AppSnackbar,
    AppFooter,
  },
  name: 'App',
};
</script>

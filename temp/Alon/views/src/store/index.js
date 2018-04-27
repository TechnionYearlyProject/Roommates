import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexPersistence = new VuexPersistence({
  storage: window.localStorage,
  modules: ['user', 'sessionToken'],
});

export default new Vuex.Store({
  state: {
    user: null,
    apartments: null,
    loading: false,
    snackbar: {
      text: '',
    },
    drawer: null,
    sessionToken: null
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getLoadingStatus(state) {
      return state.loading;
    },
    getSnackbarText(state) {
      return state.snackbar.text;
    },
    isAuthenticated(state) {
      return state.user != null;
    },
    isVerified(state) {
      return state.user && state.user.isVerified;
    },
    getDrawerStatus(state) {
      return state.drawer;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
    showSnackbar(state, text) {
      state.snackbar.text = text;
    },
    toggleDrawer(state, value) {
      state.drawer = typeof value === 'boolean' ? value : !state.drawer;
    },
    startSession(state, token) {
      state.sessionToken = token;
      axios.defaults.headers.common['x-auth'] = token;
    },
    endSession(state) {
      state.sessionToken = null;
      axios.defaults.headers.common['x-auth'] = null;
    }
  },
  actions: {
    /**
     * @author: Alon Talmor
     * @date: 12/04/18
     * @param: payload: object of {email, password}
     */
    login({ commit, getters }, payload) {
      return axios.post('http://localhost:3000/users/login', payload
      ).then((response) => {
        commit('startSession', response.headers['x-auth']);
        commit('setUser', response.data.user);
        return getters.getUser;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     */
    logout({ commit }) {
      commit('showLoading');
      // TODO: send request to the server to logout user (delete token) and then...
      commit('endSession');
      commit('setUser', null);
      commit('hideLoading');
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     * @param: payload: object of {email, password, firstName, lastName, birthdate, gender}
     */
    register({ commit, getters }, payload) {
      return axios.post('http://localhost:3000/users', payload
      ).then((response) => {
        commit('setUser', response.data.user);
        return getters.getUser;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     * @param: payload: object of {email,password}
     */
    sendVerificationMail(context, payload) {
      console.log(payload);
      return axios.post('http://localhost:3000/users/verify', payload);
    },
    /**
     * @author: Alon Talmor
     * @date: 16/04/18
     * @param: payload: object of {email,password}
     */
    verifyAccount({ commit, getters }, jwt) {
      if (getters.isVerified) {
        return;
      }
      return axios.patch(`http://localhost:3000/users/verify/${jwt}`)
        .then((response) => {
          commit('setUser', response.data.user);
          return getters.getUser;
        });
    },
  },
  created() {
    this.state.drawer = this.$vuetify.breakpoint.mdAndUp;
  },
  plugins: [vuexPersistence.plugin]
});

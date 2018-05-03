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
    getApartments(state) {
      return state.apartments;
    },
    getLoadingStatus(state) {
      return state.loading;
    },
    getSnackbarText(state) {
      return state.snackbar.text;
    },
    isAuthenticated(state) {
      return state.user != null && state.sessionToken != null;
    },
    isVerified(state) {
      return state.user && state.user.isVerified && state.sessionToken;
    },
    getDrawerStatus(state) {
      return state.drawer;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setApartments(state, apartments) {
      state.apartments = apartments;
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
      state.sessionToken = token || state.sessionToken;
      axios.defaults.headers.common['x-auth'] = state.sessionToken;
    },
    endSession(state) {
      state.sessionToken = null;
      axios.defaults.headers.common['x-auth'] = null;
    },
  },
  actions: {
    /**
     * @author: Alon Talmor
     * @date: 12/04/18
     * @param: payload: object of {email, password}.
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
     * @param: payload: object of {email, password, firstName, lastName, birthdate, gender}.
     */
    register({ commit, getters }, payload) {
      return axios.post('http://localhost:3000/users', payload
      ).then((response) => {
        commit('startSession', response.headers['x-auth']);
        commit('setUser', response.data.user);
        return getters.getUser;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     * @param: payload: object of {email,password}.
     */
    sendVerificationMail(context, payload) {
      return axios.post('http://localhost:3000/users/verify', payload);
    },
    /**
     * @author: Alon Talmor
     * @date: 19/04/18
     * @param: payload: object of {email}.
     */
    sendResetMail(context, payload) {
      return axios.post('http://localhost:3000/users/reset', payload);
    },
    /**
     * @author: Alon Talmor
     * @date: 16/04/18
     * @param: payload: object of {email,password}.
     */
    verifyAccount({ commit, getters }, jwt) {
      if (getters.isVerified) {
        return Promise.reject('Account Already verified');
      }
      return axios.patch(`http://localhost:3000/users/verify/${jwt}`)
        .then((response) => {
          commit('setUser', response.data.user);
          return getters.getUser;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 20/04/18
     * @param: jwt: jwt token
     * @param: payload: object of {email,password}.
     */
    resetPassword({ commit, getters }, { jwt, payload }) {
      return axios.patch(`http://localhost:3000/users/reset/${jwt}`, payload)
        .then(() => {
          commit('logout'); // clear user session (if logged in)
          return getters.getUser;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 18/04/18
     * @param: params: object of {id, address, price, radius, roommates, floor, entranceDate,tags} -
     * filter of the apartments list (the properties are optional).
     * Empty object {} will return all apartments.
     */
    searchApartments({ commit, getters }, params) {
      return axios.get('http://localhost:3000/apartments', { params })
        .then((response) => {
          commit('setApartments', response.data.apartments);
          return getters.getApartments;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 19/04/18
     * @param: params: object of {id} - the id of the apartment to favor.
     */
    favor(context, params) {
      return axios.put(`http://localhost:3000/apartments/${params.id}/interested`)
        .then((response) => {
          // eslint-disable-next-line 
          console.log(response.data);
          return response.data.apartment;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 23/04/18
     * @param: params: object of {id} - the id of the apartment.
     * @param: payload: object of {text} - the text of the comment.
     */
    addApartmentComment(context, { params, payload }) {
      return axios.put(`http://localhost:3000/apartments/${params.id}/comment`, payload)
        .then((response) => {
          // eslint-disable-next-line 
          console.log(response.data);
          return response.data.comments;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 24/04/18
     * @param: payload: object of {address:{state, city, street, number, apartmentNumber},
     * price, entranceDate, requiredRoommates, totalRoommates, floor, totalFloors,
     * numberOfRooms, area, description, tags} - the details of the new apartment.
     */
    publishApartment(context, payload) {
      return axios.post('http://localhost:3000/apartments', payload)
      .then((response) => {
        // eslint-disable-next-line 
        console.log(response.data);
        return response.data.apartment;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 28/04/18
     * @param: params: object of {id} where id can be a String or an Array of ids.
     */
    fetchUser(context, params) {
      return axios.get('http://localhost:3000/users', { params })
      .then((response) => {
        // eslint-disable-next-line
        console.log(response.data);
        return response.data.users;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 27/04/18
     * @param: payload: object of {firstName, lastName, birthdate, gender, mobilePhone,
     * about, image, hobbies, _interestedApartments} - the properties to update.
     */
    updateUser({ commit }, payload) {
      return axios.patch('http://localhost:3000/users/self', payload)
      .then((response) => {
        // eslint-disable-next-line
        console.log(response.data);
        commit('setUser', response.data.user);
      });
    },
  },
  plugins: [vuexPersistence.plugin]
});
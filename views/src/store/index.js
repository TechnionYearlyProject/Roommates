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
    conversations: {},
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
    getConversations(state) {
      return state.conversations;
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
    },
    getToken(state) {
      return state.sessionToken;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setConversations(state, conversations) {
      state.conversations = conversations;
    },
    setApartments(state, apartments) {
      state.apartments = apartments;
    },
    setNotifications(state, notifications) {
      state.user.notifications = notifications;
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
    }
  },
  actions: {
    /**
     * @author: Alon Talmor
     * @date: 10/05/18
     * connect to socket server
     */
    socket_createConnection({ getters }) {
      this._vm.$socket.connect();
      this._vm.$socket
          .emit('authenticate', { token: getters.getToken })
          .on('authenticated', () => {
            this._vm.$socket.emit('join');
            // eslint-disable-next-line 
            console.log('[authorized] connected to socket server');
          })
          .on('unauthorized', (message) => {
            // eslint-disable-next-line 
            console.log(`[unauthorized] socket server connection refused\n${message}`);
          });
    },
    /**
     * @author: Alon Talmor
     * @date: 24/06/18
     * disconnect from socket server
     */
    socket_closeConnection({ getters }) {
      this._vm.$socket.disconnect();
    },
    /**
     * @author: Alon Talmor
     * @date: 12/04/18
     * @param: payload: object of {email, password}.
     */
    login({ commit, getters, dispatch }, payload) {
      return axios.post(`${process.env.ROOT_API}/users/login`, payload
      ).then((response) => {
        commit('startSession', response.headers['x-auth']);
        commit('setUser', response.data.user);
        dispatch('socket_createConnection');
        return getters.getUser;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     */
    logout({ commit, dispatch }) {
      commit('showLoading');
      // TODO: send request to the server to logout user (delete token) and then...
      commit('endSession');
      dispatch('socket_closeConnection');
      commit('setUser', null);
      commit('hideLoading');
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     * @param: payload: object of {email, password, firstName, lastName, birthdate, gender}.
     */
    register({ commit, getters, dispatch }, payload) {
      return axios.post(`${process.env.ROOT_API}/users`, payload
      ).then((response) => {
        commit('startSession', response.headers['x-auth']);
        commit('setUser', response.data.user);
        dispatch('socket_createConnection');
        return getters.getUser;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 13/04/18
     * @param: payload: object of {email,password}.
     */
    sendVerificationMail(context, payload) {
      return axios.post(`${process.env.ROOT_API}/users/verify`, payload);
    },
    /**
     * @author: Alon Talmor
     * @date: 19/04/18
     * @param: payload: object of {email}.
     */
    sendResetMail(context, payload) {
      return axios.post(`${process.env.ROOT_API}/users/reset`, payload);
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
      return axios.patch(`${process.env.ROOT_API}/users/verify/${jwt}`)
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
    resetPassword({ commit, getters, dispatch }, { jwt, payload }) {
      return axios.patch(`${process.env.ROOT_API}/users/reset/${jwt}`, payload)
        .then(() => {
          dispatch('logout'); // clear user session (if logged in)
          return getters.getUser;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 12/6/18
     * @param: params: object of {id,address,price,radius,roommates,floor,entranceDate,tags} -
     * filter of the apartments list (the properties are optional).
     * Empty object {} will return all apartments.
     */
    fetchApartments(context, params) {
      return axios.get(`${process.env.ROOT_API}/apartments`, { params })
        .then(response =>
          response.data.apartments
        );
    },
    /**
     * @author: Alon Talmor
     * @date: 18/04/18
     * Search apartment and update vuex with the results.
     * See fetchApartments action for information about @param params
     */
    searchApartments({ commit, getters, dispatch }, params) {
      return dispatch('fetchApartments', params)
        .then((apartments) => {
          commit('setApartments', apartments);
          return getters.getApartments;
        });
    },
    /**
     * @author: Alon Talmor
     * @date: 13/6/18
     * @param: params: object of {id} - the id to update
     * @param: payload: object of {price,entranceDate,images,description,tags,
     * requiredRoommates,totalRoommates, numberOfRooms,floor totalFloors, area}
     * - the properties to update
     */
    editApartment(context, { params, payload }) {
      return axios.patch(`${process.env.ROOT_API}/apartments/${params.id}`, payload)
        .then(response =>
          response.data.apartment
        );
    },
    /**
     * @author: Alon Talmor
     * @date: 19/04/18
     * @param: params: object of {id} - the id of the apartment to favor.
     */
    favor({ state }, params) {
      return axios.put(`${process.env.ROOT_API}/apartments/${params.id}/interested`)
        .then((response) => {
          const index = state.user._interestedApartments.indexOf(response.data.apartment._id);
          if (index >= 0) { // if favor exists it means we need to remove it
            state.user._interestedApartments.splice(index, 1);
          } else { // we have just added it
            state.user._interestedApartments.push(response.data.apartment._id);
          }
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
      return axios.put(`${process.env.ROOT_API}/apartments/${params.id}/comment`, payload)
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
    publishApartment({ state }, payload) {
      return axios.post(`${process.env.ROOT_API}/apartments`, payload)
      .then((response) => {
        state.user._publishedApartments.push(response.data.apartment._id);
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
      return axios.get(`${process.env.ROOT_API}/users`, { params })
      .then(response => response.data.users);
    },
    /**
     * @author: Alon Talmor
     * @date: 24/06/18
     * get interest users ordered by their matching to the logged in user 
     * @param: param: object of {id} the id of the apartment 
     */
    fetchInterestedUsersOrdered(context, params) {
      return axios.get(`${process.env.ROOT_API}/apartments/${params.id}/interested`)
      .then(response => response.data.users);
    },
    /**
     * @author: Alon Talmor
     * @date: 07/05/18
     * required authentication.
     */
    fetchSelf({ commit }) {
      return axios.get(`${process.env.ROOT_API}/users/self`)
      .then((response) => {
        commit('setUser', response.data.self);
        return response.data.self;
      });
    },

    /**
     * @author Idan Yadgar
     * @date 20/06/18
     */
    fetchSelfConversations({ commit }) {
      return axios.get(`${process.env.ROOT_API}/users/self/conversations`)
        .then((response) => {
          commit('setConversations', response.data.conversations);
          return response.data.conversations;
        });
    },

    /**
     * @author: Alon Talmor
     * @date: 27/04/18
     * @param: payload: object of {firstName, lastName, birthdate, gender, mobilePhone,
     * about, image, hobbies, _interestedApartments} - the properties to update.
     */
    updateUser({ commit }, payload) {
      return axios.patch(`${process.env.ROOT_API}/users/self`, payload)
      .then((response) => {
        // eslint-disable-next-line
        console.log(response.data);
        commit('setUser', response.data.user);
        return response.data.user;
      });
    },
    /**
     * @author: Alon Talmor
     * @date: 10/05/18
     * @param: params: object of {id} where id can be a String or an Array of notification ids.
     * @param: payload object of {wasRead} - the notification new read state.
     */
    updateNotification({ commit }, { params, payload }) {
      return axios.patch(`${process.env.ROOT_API}/users/notifications`, payload, { params })
      .then((response) => {
        // eslint-disable-next-line
        console.log(response.data);
        commit('setNotifications', response.data.user.notifications);
        return response.data.user.notifications;
      });
    },
    /**
     * @author: Or Abramovich
     * @date: 06/18
     * @param: params: object of {long, lat} -
     * Gets all reviews within a radius of 1 KM from the given coordinates
     */
    getReviews({ commit }, params) {
      return axios.get(`${process.env.ROOT_API}/reviews/${params.long}/${params.lat}`)
        .then(response =>
          response.data.reviews
        );
    },
    /**
     * @author: Or Abramovich
     * @date: 06/18
     * @param: payload: object of review
     * Adds the given review to the DB.
     */
    publishReview({ state }, payload) {
      return axios.post(`${process.env.ROOT_API}/reviews`, payload)
      .then(response =>
        response.data.review
      );
    },
    /**
     * @author: Alon Talmor
     * @date: 6/5/18
     * @param: params: object of {id} which specified the apartment id.
     */
    fetchGroups(context, params) {
      return axios.get(`${process.env.ROOT_API}/apartments/${params.id}/groups`)
      .then(response =>
        response.data.groups
      );
    },
    /**
     * @author: Alon Talmor
     * @date: 6/5/18
     * @param: params: object of {id} - the id of the apartment.
     * @param: payload: Array of {id} - the ids array of the group members.
     */
    addGroup(context, { params, payload }) {
      return axios.post(`${process.env.ROOT_API}/apartments/${params.id}/groups`, payload)
      .then(response =>
        response.data.apartment
      );
    },
    /**
     * @author: Alon Talmor
     * @date: 6/6/18
     * @param: params: object of {id} - the id of the apartment.
     * @param: payload: Array of {id,status} - the id of the group to update,
     * and the new member's status.
     * Note that is it possible to update only self status.
     */
    updateGroupStatus(context, { params, payload }) {
      return axios.patch(`${process.env.ROOT_API}/apartments/${params.id}/groups`, payload)
      .then(response =>
        response.data.apartment
      );
    },
    /**
     * @author: Or Abramovich
     * @date: 19/06/18
     * @param: params: object of {id} - the id of the apartment to toggle subscription.
     *
     * The following function toggles the logged-in user subscription (on/off) state for the given apartment.
     */
    toggleSubscription({ state }, params) {
      return axios.put(`${process.env.ROOT_API}/apartments/${params.id}/subscription`)
        .then((response) => {
          return response.data.apartment;
        });
    },
    /**
     * @author: Or Abramovich
     * @date: 24/6/18
     * @param: params: object of {id} - the id of the apartment.
     * @param: payload: object of {id} - the id of the group to sign
     */
    signGroup(context, { params, payload }) {
      return axios.patch(`${process.env.ROOT_API}/apartments/${params.id}/groups/sign`, payload)
      .then(response =>
        response.data.apartment
      );
    }
  },
  plugins: [vuexPersistence.plugin]
});

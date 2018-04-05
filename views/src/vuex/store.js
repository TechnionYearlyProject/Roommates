import Vue from 'vue';
import Vuex from 'vuex';

import { LOAD_APARTMENTS,SAVE_USER } from './constant-mutations';

Vue.use(Vuex);


export const store = new Vuex.Store({
  state: {
    loadedApartments: null,
    user: null
  },
  getters: {
    loadedApartments (state) {
      return state.loadedApartments;
    },
    user (state) {
      return state.user;
    },
  },
  mutations: {
    [LOAD_APARTMENTS] (state, payload) {
      state.loadedApartments = payload;
    },
    [SAVE_USER] (state, payload) {
      state.user = payload;
    }
  },
  actions: {

  }
});
import Vue from 'vue';
import Vuex from 'vuex';

import { LOAD_APARTMENTS } from './constant-mutations';

Vue.use(Vuex);


export const store = new Vuex.Store({
  state: {
    loadedApartments: null
  },
  getters: {
    loadedApartments (state) {
      return state.loadedApartments;
    }
  },
  mutations: {
    [LOAD_APARTMENTS] (state, payload) {
      state.loadedApartments = payload;
    }
  }
});
import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketio from 'vue-socket.io';
import store from '../store';

Vue.use(VueSocketio, socketio('http://localhost:5000'), store);

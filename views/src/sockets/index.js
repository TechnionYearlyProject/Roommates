import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, socketio('http://localhost:5000'));

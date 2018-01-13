import Vue from 'vue';

const EventBus = new Vue({
  methods: {
    emitLogin(payload) {
      const token = payload.get('x-auth');
      const expiration = payload.get('x-expiration');
      this.$auth.setToken(token, expiration);
      this.$emit('login', payload)  
    },
    onLogin(callback) {
      this.$on('login', callback)  
    }
  }
});

export default EventBus;
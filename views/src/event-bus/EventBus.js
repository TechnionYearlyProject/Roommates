import Vue from 'vue';

const EventBus = new Vue({
  methods: {
    emitLogin(payload) {
      this.$emit('login', payload)  
    },
    onLogin(callback) {
      this.$on('login', callback)  
    }
  }
});

export default EventBus;
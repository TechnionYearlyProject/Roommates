<template>
    <v-btn @click="clickButton">click</v-btn>
</template>

<script>
    export default {
      name: 'helloWorld',
      sockets: {
        connect: function() {
          alert('socket connected');
          // this.$socket.emit('join');
        },
        notification: function({ message }) {
          console.log(
            'this method was fired by the socket server. eg: io.emit("notification", data)'
          );
        },
        'chat_message': function (val) {

        }
      },
      methods: {
        clickButton: function(val) {
          // $socket is socket.io-client instance
          this.$socket.emit('chat_message', '5ad8588944db813fe850c923');
          console.log('emitted');
        }
      },
      created() {
        console.log(this.$store.getters.getToken);
        if( this.$store.getters.isAuthenticated) {
        this.$socket.emit('connect', this.$store.getters.getToken);
        this.$socket.emit('join');
        }
      }
    };
</script>

<style>

</style>

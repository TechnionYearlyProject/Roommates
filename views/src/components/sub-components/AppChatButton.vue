<template>
  <v-btn flat exact :to="{ name: 'AppChat' }" @click="nullifyMessages">
    <span class="text-xs-center">
      <v-badge :value="newMessages > 0" right color="red" overlap>
        <span slot="badge">{{ newMessages }}</span>
          <v-icon>chat</v-icon>
      </v-badge>
      <span class="hidden-xs-only">
        <br>
        <small>Chat</small>
      </span>
    </span>
    <audio :src="tone" hidden preload="auto" ref="audio"></audio>
  </v-btn>
</template>

<script>
  import tone from '../../../static/new-message-tone.mp3';

  export default {
    name: "AppChatButton",
    data() {
      return {
        newMessages: 0,
        intervalHandler: null,
        pageDefaultTitle: document.title,
        audioLoaded: false,
        tone
      }
    },
    mounted() {
      this.$refs.audio.addEventListener("canplaythrough", () => {
        this.audioLoaded = true;
      });
    },
    methods: {
      nullifyMessages() {
        if (this.newMessages > 0) {
          clearInterval(this.intervalHandler);
          document.title = this.pageDefaultTitle;

          this.newMessages = 0;
        }
      }
    },
    sockets: {
      chat_message(m) {
        if (!document.hasFocus() && this.audioLoaded) {
          this.$refs.audio.play();
        }

        if (this.$router.history.current.name === 'AppChat') {
          return;
        }

        if (this.newMessages === 0) {
          let flag = true;
          this.intervalHandler = setInterval(() => {
            document.title = flag ? 'Unread Messages!' : this.pageDefaultTitle;

            flag = !flag;
          }, 1300);
        }

        ++this.newMessages;
      }
    }
  }
</script>

<style scoped>

</style>
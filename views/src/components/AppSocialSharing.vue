<template>
<v-layout justify-center wrap row justify-space-around>
  <social-sharing v-for="(network, i) in share.networks"
    :key="`network-${i}`"
    :url="share.url"
    :title="share.title"
    :description="share.description"
    :quote="share.quote"
    inline-template>
      <network :network="network.name" style="cursor:pointer">
        <v-icon large :color="network.color">{{ network.icon }}</v-icon>
      </network>
  </social-sharing>
</v-layout>
</template>

<script>
export default {
  props: {
    id: {
      required: true
    },
    address: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      share: {
        url: null,
        title: null,
        description: null,
        quote: null,
        networks: [
          {
            name: "email",
            icon: "mdi-email",
            color: "lime darken-4"
          },
          {
            name: "facebook",
            icon: "mdi-facebook-box",
            color: "blue darken-3"
          },
          {
            name: "googleplus",
            icon: "mdi-google-plus-box",
            color: "red darken-1"
          },
          {
            name: "twitter",
            icon: "mdi-twitter-box",
            color: "light-blue"
          },
          {
            name: "whatsapp",
            icon: "mdi-whatsapp",
            color: "teal darken-1"
          }
        ]
      }
    };
  },
  created() {
    this.share.url = `https://localhost:8080/${this.id}`;
    this.share.title = "Sharing this apartment I found on Roommates with you";
    this.share.description = `Located in ${this.address}, price: ${this.price}`;
    this.share.quote = "This is an apartment that I thought might interest you.";
  }
};
</script>

<style>
</style>

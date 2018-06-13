<template>
<v-layout justify-center wrap row justify-space-around>
  <social-sharing v-for="(network, i) in networks"
    :key="`network-${i}`"
    :url="url"
    :title="title"
    :description="description"
    :quote="quote"
    inline-template>
      <network v-if="network.show" :network="network.name" style="cursor:pointer">
        <v-icon large :color="network.color">{{ network.icon }}</v-icon>
      </network>
  </social-sharing>
</v-layout>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '404'
    },
    title: {
      type: String,
      default: 'No Title'
    },
    description: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      default: ''
    },
    email: {
      type: Boolean,
      default: false
    },
    facebook: {
      type: Boolean,
      default: false
    },
    googleplus: {
      type: Boolean,
      default: false
    },
    twitter: {
      type: Boolean,
      default: false
    },
    whatsapp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      networks: [
        {
          name: 'email',
          icon: 'mdi-email',
          color: 'lime darken-4',
          show: this.email
        },
        {
          name: 'facebook',
          icon: 'mdi-facebook-box',
          color: 'blue darken-3',
          show: this.facebook
        },
        {
          name: 'googleplus',
          icon: 'mdi-google-plus-box',
          color: 'red darken-1',
          show: this.googleplus
        },
        {
          name: 'twitter',
          icon: 'mdi-twitter-box',
          color: 'light-blue',
          show: this.twitter
        },
        {
          name: 'whatsapp',
          icon: 'mdi-whatsapp',
          color: 'teal darken-1',
          show: this.whatsapp
        }
      ]
    };
  }
};
</script>

<style>
</style>

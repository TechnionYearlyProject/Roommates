<template>
  <v-menu offset-y :nudge-bottom="15" bottom :close-on-content-click="false" max-width="340" lazy>
      <v-tooltip :top="top" :left="left" :right="right" :bottom="bottom" slot="activator">
        <v-btn icon slot="activator">
          <v-icon>share</v-icon>
        </v-btn>
        <span>Share</span>
      </v-tooltip>
      <v-card>
        <v-container grid-list-sm pa-2>
          <v-layout wrap row>
            <v-flex xs10>
              <v-text-field ref="link" v-model="url" hide-details readonly class="pl-2"/>
            </v-flex>
            <v-flex xs2 class="text-xs-center">
              <v-tooltip top slot="activator" :color="clipboard.color" :close-delay="clipboard.closeDelay">
                <v-btn color="success" slot="activator" class="mt-2" style="min-width: 0;width:40px" @click="copyToClipboard">
                  <v-icon color="white-text">content_copy</v-icon>
                </v-btn>
                <div class="text-xs-center">{{ clipboard.text }}</div>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 py-2>
              <v-divider/>
            </v-flex>
            <v-flex>
              <app-social-sharing :url="url" :title="title" :description="description" :quote="quote" :email="email" :facebook="facebook" :googleplus="googleplus" :twitter="twitter" :whatsapp="whatsapp"/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-menu>
</template>

<script>
import AppSocialSharing from '../Social/AppSocialSharing';

export default {
  props: {
    top: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
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
      clipboard: {
        color: undefined,
        text: 'Copy link',
        closeDelay: 200,
        lastCopyTime: 0
      }
    };
  },
  methods: {
    copyToClipboard() {
      this.$refs.link.$refs.input.select();
      document.execCommand('copy');
      this.clipboard.text = 'Copied!';
      this.clipboard.color = 'success';
      this.clipboard.closeDelay = 3000;
      const lastCopyTime = Date.now();
      this.clipboard.lastCopyTime = lastCopyTime;
      setInterval(() => {
        if (lastCopyTime === this.clipboard.lastCopyTime) {
          this.clipboard.text = 'Copy link';
          this.clipboard.color = undefined;
          this.clipboard.closeDelay = 200;
        }
      }, 5000);
    }
  },
  components: {
    AppSocialSharing
  }
};
</script>

<style>
</style>

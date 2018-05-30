<template>
    <v-card>
          <v-list style="height:300px;overflow-y: auto;">
            <template  v-for="(m,j) in value.members">
            <v-list-tile :key="`member-${j}`" @click="" avatar :disabled="disabled">
              <v-list-tile-action>
                <v-icon v-if="value.status[j] === 'in'" color="teal">mdi-comment-check-outline</v-icon>
                <v-icon v-else-if="value.status[j] === 'out'" color="red">mdi-comment-remove-outline</v-icon>
                <v-icon v-else>mdi-comment-question-outline</v-icon>
              </v-list-tile-action>
              <v-list-tile-avatar>
                <app-avatar name="Alon" :size="40"></app-avatar>
              </v-list-tile-avatar>
              <v-list-tile-content>
              {{ m }}
              </v-list-tile-content>
              <v-list-tile-action>
                <v-tooltip top>
                  <v-btn slot="activator" icon>
                    <v-icon color="info">chat_bubble</v-icon>
                  </v-btn>
                  <span>chat</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider :key="`divider-member-${j}`"></v-divider>
            </template>
          </v-list>
          <v-divider></v-divider>
          <v-progress-linear :value="optInNumber / value.members.length * 100" height="4" color="teal" class="mt-0 mb-1"></v-progress-linear>
          <div>
            <v-btn slot="activator" block outline @click.stop="optInDialog = true" color="success" class="pa-0 ma-0 mb-1">
                <v-icon>check</v-icon>
                Count me in!
            </v-btn>
            <v-dialog v-model="optInDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Do you want to continue?</v-card-title>
                <v-card-text>Just to make sure you didn't click <span class="teal--text">Approve</span> by mistake.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat @click.native="optIn();optOutDialog = false">I'm sure!</v-btn>
                  <v-btn color="grey darken-3" flat @click.native="optInDialog = false">nevermind...</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>  
          </div>
          <div>
            <v-btn block outline @click.stop="optOutDialog = true" color="error" class="pa-0 ma-0">
              <v-icon>close</v-icon>
              Not a chance.
            </v-btn>
            <v-dialog v-model="optOutDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Are you sure you want to leave?</v-card-title>
                <v-card-text>Just to make sure you didn't click<br> <span class="red--text">Decline</span> by mistake.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click.native="optOut();optOutDialog = false">Yes, let me out!</v-btn>
                  <v-btn color="grey darken-3" flat @click.native="optOutDialog = false">nevermind...</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>  
          </div>
        </v-card>
</template>

<script>
import AppAvatar from './sub-components/AppAvatar';

export default {
  props: {
    value: {
      required: true
    }
  },
  data() {
    return {
      disabled: false,
      optInDialog: false,
      optOutDialog: false
    };
  },
  methods: {
    optOut() {
      this.disabled = true;
    },
    optIn() {}
  },
  computed: {
    optInNumber() {
      return this.value.status.filter(m => m === "in").length;
    }
  },
  components: {
    AppAvatar
  }
};
</script>

<style>
</style>

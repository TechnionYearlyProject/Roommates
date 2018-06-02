<template>
<div>
  <v-toolbar color="primary" dark dense>
    <span>{{ groupTitle }}</span>
    <v-spacer></v-spacer>
    <v-tooltip left class="mx-0">
      <v-btn slot="activator" icon>
        <v-icon>poll</v-icon>
      </v-btn>
      <span>
        <div class="subheading">statistics:</div>
          <div>
          <span class="green--text text--lighten-2">accepted:</span> {{ statistics.accepted }}/{{ value.members.length }}
          </div>
          <div>
          <span class="red--text text--lighten-2">declined:</span> {{ statistics.declined }}/{{ value.members.length }}
          </div>
          <div>
          <span class="yellow--text text--lighten-2">pending:</span> {{ statistics.pending }}/{{ value.members.length }}
        </div>
      </span>
    </v-tooltip>
  </v-toolbar>
  <v-card height="390px">
    <div v-if="!value.loaded" class="text-xs-center">
      <v-progress-circular indeterminate color="purple" class="mt-5"></v-progress-circular>
    </div>
    <div v-else>
      <v-list style="height:300px;overflow-y: auto;">
        <template  v-for="(m,j) in value.members">
        <v-list-tile :key="`member-${j}`" @click.stop="goToProfile(m)" avatar :disabled="disabled" :class="color(value.status[j])">
          <v-list-tile-action>
            <v-icon v-if="value.status[j] === 'in'" color="teal">mdi-comment-check-outline</v-icon>
            <v-icon v-else-if="value.status[j] === 'out'" color="red">mdi-comment-remove-outline</v-icon>
            <v-icon v-else color="yellow darken-3">mdi-comment-question-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-avatar>
            <app-avatar :name="getName(m)" :size="40"></app-avatar>
          </v-list-tile-avatar>
          <v-list-tile-content>
          {{ getName(m) }}
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip top>
              <v-btn slot="activator" icon @click.stop="">
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
      <div v-if="participatingInGroup">
        <div v-if="closeTheDeal">
          <v-btn block outline color="primary" style="height:75px">
            <v-icon class="mr-1">new_releases</v-icon>
            Close The Deal !
          </v-btn>
        </div>
        <div v-else>
          <div>
            <v-btn slot="activator" block outline @click.stop="optInDialog = true" color="success" class="pa-0 ma-0 mb-1">
                <v-icon>check</v-icon>
                Count me in !
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
              Not a chance
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
        </div>
      </div>
      <div v-else class="body-1 pt-4 text-xs-center">
        <v-icon>lock</v-icon>You are not participating in this group.
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppAvatar from "../sub-components/AppAvatar";
import GroupStatuses from "../../assets/group-statuses";

export default {
  props: {
    value: {
      required: true
    },
    groupTitle: {
      type: String,
      default: "Group"
    }
  },
  data() {
    return {
      status: GroupStatuses,
      disabled: false,
      optInDialog: false,
      optOutDialog: false
    };
  },
  methods: {
    optOut() {
      this.disabled = true;
    },
    optIn() {},
    color(status) {
      let color;
      if (status === "in") {
        color = "green lighten-5";
      } else if (status === "out") {
        color = "red lighten-5";
      } else {
        color = "grey lighten-5";
      }
      return color;
    },
    getName(user) {
      return `${user.firstName.capitalize()}` + (user.lastName ? ` ${user.lastName.capitalize()}` : "");
    },
    goToProfile(user) {
      this.$router.push({ name: "AppUserProfile", params: { id: user._id } });
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    optInNumber() {
      return this.value.status.filter(s => s === "in").length;
    },
    optOutNumber() {
      return this.value.status.filter(s => s === "out").length;
    },
    pendingNumber() {
      return this.value.status.filter(s => s === "pending").length;
    },
    closeTheDeal() {
      return this.value.status.filter(s => s === "in").length === this.value.members.length;
    },
    statistics() {
      return {
        accepted: this.optInNumber,
        declined: this.optOutNumber,
        pending: this.pendingNumber
      };
    },
    participatingInGroup() {
      return this.value.members.some(m => m._id === this.getUser._id);
    }
  },
  components: {
    AppAvatar
  }
};
</script>

<style>
</style>

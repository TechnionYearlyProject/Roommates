<template>
<div>
  <v-toolbar :color="isClosedDeal ? 'success' : 'primary'" dark dense>
    <span>{{ groupTitle }}</span>
    <v-spacer></v-spacer>
    <v-tooltip left class="mx-0">
      <v-btn slot="activator" icon>
        <v-icon>poll</v-icon>
      </v-btn>
      <span>
        <div class="subheading">statistics:</div>
          <div>
          <span class="green--text text--lighten-2">accepted:</span>&nbsp;&nbsp;{{ statistics.accepted }}
          </div>
          <div>
          <span class="red--text text--lighten-2">declined:</span>&nbsp;&nbsp;&nbsp;{{ statistics.declined }}
          </div>
          <div>
          <span class="yellow--text text--lighten-2">pending:</span>&nbsp;&nbsp;&nbsp;&nbsp;{{ statistics.pending }}
        </div>
      </span>
    </v-tooltip>
  </v-toolbar>
  <v-card height="390px">
    <div v-if="!loaded" class="text-xs-center">
      <v-progress-circular indeterminate color="purple" class="mt-5"></v-progress-circular>
    </div>
    <div v-else>
      <v-list style="height:300px;overflow-y: auto;">
        <template  v-for="(m,j) in value.members">
        <v-list-tile :key="`member-${j}`" @click.stop="goToProfile(members[m.id])" avatar :class="color(m.status)">
          <v-list-tile-action>
            <v-icon v-if="m.status === ACCEPTED" color="teal">mdi-comment-check-outline</v-icon>
            <v-icon v-else-if="m.status === DECLINED" color="red">mdi-comment-remove-outline</v-icon>
            <v-icon v-else color="yellow darken-3">mdi-comment-question-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-avatar>
            <app-avatar :name="getName(members[m.id])" :size="40"></app-avatar>
          </v-list-tile-avatar>
          <v-list-tile-content>
          {{ getName(members[m.id]) }}
          </v-list-tile-content>
          <v-list-tile-action v-if="j !== myIndex">
            <v-tooltip top>
              <v-btn slot="activator" icon @click.stop="$router.push({ name: 'AppChat', query: { startChatWith: members[m.id]._id } })">
                <v-icon color="info">chat</v-icon>
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
      <div v-if="closeTheDeal && !isClosedDeal">
        <v-btn block outline slot="activator" color="primary" style="height:75px" @click.native="optSign()">
          <v-icon size="22" class="mr-1 mb-1">fa-handshake-o</v-icon>
          Close The Deal !
        </v-btn>
      </div>
      <div v-else-if="participatingInGroup && !isClosedDeal">
        <div>
          <div>
            <v-btn slot="activator" block outline @click.stop="optInDialog = true" color="success" class="pa-0 ma-0 mb-1" :disabled="disabled || disableClicks" :loading="loading">
                <v-icon>check</v-icon>
                Count me in !
            </v-btn>
            <v-dialog v-model="optInDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Do you want to continue?</v-card-title>
                <v-card-text>Just to make sure you didn't click <span class="teal--text">Approve</span> by mistake.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat @click.native="optIn();optInDialog = false">I'm sure!</v-btn>
                  <v-btn color="grey darken-3" flat @click.native="optInDialog = false">nevermind...</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <div>
            <v-btn block outline @click.stop="optOutDialog = true" color="error" class="pa-0 ma-0" :disabled="disabled || disableClicks" :loading="loading">
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
      <div v-else-if="!isClosedDeal" class="body-1 pt-4 text-xs-center">
        <v-icon>lock</v-icon>You are not participating in this group.
      </div>
       <div v-else class="body-1 pt-4 text-xs-center">
          <v-icon size="22" class="mr-1 mb-1">fa-handshake-o</v-icon>Closed!
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import AppAvatar from '../sub-components/AppAvatar';
import AppPayment from '../AppPayment';

export default {
  props: {
    value: {
      required: true
    },
    apartmentId: {
      type: String,
      required: true
    },
    ownerId: {
      type: String,
      required: true
    },
    groupTitle: {
      type: String,
      default: 'Group'
    },
    disableClicks: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled: false,
      loading: false,
      optInDialog: false,
      optOutDialog: false,
      loaded: false,
      members: null,
      myIndex: -1,
      PaymentMenuDialog: false,
      PENDING: 1,
      DECLINED: 2,
      ACCEPTED: 3,
      PAYD: 4,
      CONST_GROUP_STATUS_COMPLETED: 4
    };
  },
  methods: {
    ...mapMutations(['showSnackbar']),
    showThankYouMessage() {
      this.showSnackbar('Thank you for voting!');
    },
    showCloseDealMessage() {
      this.showSnackbar('Congratulations! You have just found your Roommates!');
    },
    optOut() {
      this.loading = true;
      this.$store
        .dispatch('updateGroupStatus', {
          params: { id: this.apartmentId },
          payload: { id: this.value._id, status: this.DECLINED }
        })
        .then(() => {
          this.disabled = true;
          this.value.members[this.myIndex].status = this.DECLINED;
          this.value.members.splice();
          this.showThankYouMessage();
        })
        .catch(error => console.log(error)) // eslint-disable-line
        .then(() => { this.loading = false; });
    },
    optIn() {
      this.loading = true;
      this.$store
        .dispatch('updateGroupStatus', {
          params: { id: this.apartmentId },
          payload: { id: this.value._id, status: this.ACCEPTED }
        })
        .then(() => {
          this.disabled = true;
          this.value.members[this.myIndex].status = this.ACCEPTED;
          this.value.members.splice();
          this.showThankYouMessage();
        })
        .catch(error => console.log(error)) // eslint-disable-line
        .then(() => { this.loading = false; });
    },
    optSign() {
      this.loading = true;
      this.$store
        .dispatch('signGroup', {
          params: { id: this.apartmentId },
          payload: { id: this.value._id }
        })
        .then(() => {
          this.value.status=this.CONST_GROUP_STATUS_COMPLETED; 
          showCloseDealMessage();
        })
        .catch(error => console.log(error)) // eslint-disable-line
        .then(() => { this.loading = false; });
    },
    color(status) {
      let color;
      if (status === this.ACCEPTED) {
        color = 'green lighten-5';
      } else if (status === this.DECLINED) {
        color = 'red lighten-5';
      } else {
        color = 'grey lighten-5';
      }
      return color;
    },
    getName(user) {
      return `${user.firstName.capitalize()}${(user.lastName ? ` ${user.lastName.capitalize()}` : '')}`;
    },
    goToProfile(user) {
      this.$router.push({ name: 'AppUserProfile', params: { id: user._id } });
    }
  },
  computed: {
    ...mapGetters(['getUser', 'isVerified']),
    optInNumber() {
      return this.value.members.filter(m => m.status === this.ACCEPTED).length;
    },
    optOutNumber() {
      return this.value.members.filter(m => m.status === this.DECLINED).length;
    },
    pendingNumber() {
      return this.value.members.filter(m => m.status === this.PENDING).length;
    },
    closeTheDeal() {
      const user = this.getUser;
      return user && user._id === this.ownerId &&
       this.value.members.filter(m => m.status === this.ACCEPTED).length === this.value.members.length; // eslint-disable-line
    },
    statistics() {
      return {
        accepted: this.optInNumber,
        declined: this.optOutNumber,
        pending: this.pendingNumber
      };
    },
    isClosedDeal() {
      if(this.value.status == this.CONST_GROUP_STATUS_COMPLETED){
        this.$emit('dealClosed');
        return true;
      }
      return false;
    },
    participatingInGroup() {
      return this.myIndex > -1;
    }
  },
  created() {
    const id = this.value.members.map(m => m.id);
    this.$store
      .dispatch('fetchUser', { id })
      .then((users) => {
        this.members = users;
        this.loaded = true;
      })
      .catch(e => console.log(e)); // eslint-disable-line
    if (this.isVerified) {
      this.myIndex = this.value.members.findIndex(m => m.id === this.getUser._id);
    }
    if (this.participatingInGroup && this.value.members[this.myIndex].status !== this.PENDING) {
      this.disabled = true;
    }
  },
  components: {
    AppAvatar,
    AppPayment
  }
};
</script>

<style>
</style>

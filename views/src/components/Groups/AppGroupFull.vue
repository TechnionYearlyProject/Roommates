<template>
    <div>
  <v-container fluid grid-list-xl px-0 pt-0>
    <v-card flat>
      <v-toolbar card>
      <v-icon>mdi-account-group</v-icon>
      <v-toolbar-title>Suggested Groups</v-toolbar-title>
    </v-toolbar>
      <v-card-title></v-card-title>
      <v-container>
        <v-layout wrap>
            <div v-if="groups.length === 0" class="pb-4 pl-3 body-1">There are no groups</div>
            <v-flex v-else xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
                <app-group v-model="groups[i]" :apartmentId="apartmentId" :ownerId="ownerId" :group-title="`Group #${i+1}`"></app-group>
            </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
  <v-container fluid grid-list-xl px-0 pt-0>
    <v-card flat>
        <v-toolbar card>
            <v-icon>mdi-account-multiple-plus</v-icon>
            <v-toolbar-title>Create Your Own Group</v-toolbar-title>
        </v-toolbar>
      <v-container>
        <app-my-group :apartmentId="apartmentId" :interested="interestedList" :myGroupMaxSize="requiredRoommates" @submit="submit($event)"></app-my-group>
      </v-container>
    </v-card>
  </v-container>
</div>
</template>

<script>
import { mapMutations } from 'vuex';
import AppGroup from './AppGroup';
import AppMyGroup from './AppMyGroup';

export default {
  props: {
    apartmentId: {
      type: String,
      required: true
    },
    ownerId: {
      type: String,
      required: true
    },
    requiredRoommates: {
      type: Number,
      default: 2
    },
    interestedList: {
      type: Array,
      default: () => null
    }
  },
  data() {
    return {
      groups: []
    };
  },
  methods: {
    ...mapMutations(['showLoading', 'hideLoading']),
    submit(group) {
      this.showLoading();
      this.$store
        .dispatch('addGroup', { params: { id: this.apartmentId }, payload: { id: group } })
        .then((apartment) => {
          this.groups.push(apartment.groups[apartment.groups.length - 1]);
        })
        .catch(error => console.log(error)) // eslint-disable-line
        .then(() => this.hideLoading());
    }
  },
  mounted() {
    this.$store
      .dispatch('fetchGroups', { id: this.apartmentId })
      .then((groups) => {
        this.groups = groups;
      })
      .catch(error => console.log(error)); // eslint-disable-line
  },

  components: {
    AppGroup,
    AppMyGroup
  }
};
</script>

<style>
</style>

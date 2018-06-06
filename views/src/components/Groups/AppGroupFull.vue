<template>
    <div>
  <v-container grid-list-xl>
    <v-card>
        <v-toolbar card>
      <v-icon>mdi-account-group</v-icon>
      <v-toolbar-title>Suggested Groups</v-toolbar-title>
    </v-toolbar>
      <v-card-title></v-card-title>
      <v-container>
        <v-layout wrap>
            <div v-if="groups.length === 0" class="pb-4 pl-3 body-1">There are no groups</div>
            <v-flex v-else xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
                <app-group v-model="groups[i]" :apartmentId="apartmentId" :group-title="`Group #${i+1}`"></app-group>
            </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
  <v-container grid-list-xl>
    <v-card>
        <v-toolbar card>
            <v-icon>mdi-account-multiple-plus</v-icon>
            <v-toolbar-title>Create Your Own Group</v-toolbar-title>
        </v-toolbar>
      <v-container>
        <app-my-group :members="interestedList" :myGroupMaxSize="requiredRoommates" @submit="submit($event)"></app-my-group>
      </v-container>
    </v-card>
  </v-container>
</div>
</template>

<script>
import AppGroup from "./AppGroup";
import AppMyGroup from "./AppMyGroup";
import { mapMutations } from 'vuex';

export default {
  props: {
    apartmentId: {
      type: String,
      required: true
    },
    requiredRoommates: {
      type: Number,
      default: 2
    },
    interestedList: {
      type: Array,
      default: () => ["5b140ad395d5b923886ffb43", "5b140fae95d5b923886ffb54", "5b14141895d5b923886ffb5d", "5b14149295d5b923886ffb5f", "5b1414c195d5b923886ffb61"]
    }
  },
  data() {
    return {
      groups: []
    };
  },
  methods: {
    ...mapMutations(['showLoading','hideLoading']),
    submit(group) {
      this.showLoading();
      this.$store.dispatch('addGroup', { params: { id: this.apartmentId }, payload: { id: group } })
      .then((apartment) => {
        console.log(apartment)
        this.groups.push(apartment.groups[apartment.groups.length - 1]);
      })
      .catch((error) => console.log(error))
      .then(() => this.hideLoading());
    }
  },
  mounted() {
    this.$store.dispatch("fetchGroups", { id: this.apartmentId })
    .then(groups => {
      this.groups = groups;
    })
    .catch((error) => console.log(error));
  },

  components: {
    AppGroup,
    AppMyGroup
  }
};
</script>

<style>
</style>

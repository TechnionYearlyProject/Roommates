<template>
<div>
  <v-container grid-list-xl>
    <v-toolbar>
      <v-icon>mdi-account-group</v-icon>
      <v-toolbar-title>Suggested Groups</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-title></v-card-title>
      <v-container>
        <v-layout wrap>
          <v-flex xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
            <app-group v-model="groups[i]" :group-title="`Group #${i+1}`"></app-group>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
  <v-container grid-list-xl>
    <v-toolbar>
      <v-icon>mdi-account-multiple-plus</v-icon>
      <v-toolbar-title>Create Your Own Group</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-container>
        <app-my-group :members="interestedList" :myGroupMaxSize="requiredRoommates" @submit="groups.push($event)"></app-my-group>
      </v-container>
    </v-card>
  </v-container>
</div>
</template>

<script>
import { union } from 'lodash';
import AppGroup from "./Groups/AppGroup";
import AppMyGroup from "./Groups/AppMyGroup";

export default {
  props: {
    requiredRoommates: {
      type: Number,
      default: 3
    },
    interestedList: {
      type: Array,
      default: () => ['Alon Talmor', 'Gerry The Pacemaker', 'Agnetha Faltskog', 'Judith Durham', 'Kent Lambert']
    }
  },
  data() {
    return {
      groups: [
        {
          members: ['5b140ad395d5b923886ffb43','5b1414c195d5b923886ffb61'],
          status: ["in","in"],
        },
        {
          members: ["5b140ad395d5b923886ffb43", "5b140fae95d5b923886ffb54", "5b14141895d5b923886ffb5d"],
          status: ["pending", "in", "in"],
        },
        {
          members: ["5b140fae95d5b923886ffb54", "5b14141895d5b923886ffb5d"],
          status: ["out", "in"],
        },
        {
          members: ["5b140ad395d5b923886ffb43", "5b14149295d5b923886ffb5f",'5b1414c195d5b923886ffb61'],
          status: ["in", "pending", "pending"],
        }
      ]
    };
  },
  methods: {},
  mounted() {
    
  },

  components: {
    AppGroup,
    AppMyGroup
  }
};
</script>

<style scoped>
</style>

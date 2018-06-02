<template>
<div>
  <v-container grid-list-xl>
    <div class="title">Suggested Groups</div>
    <v-layout wrap>
      <v-flex xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
        <app-group v-model="groups[i]" :group-title="`Group #${i+1}`"></app-group>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container grid-list-xl>
    <div class="subheading">Create Your Own Group</div>
    <div class="caption mb-2" v-if="$vuetify.breakpoint.smAndUp">Drag other interested fellows to your group.</div>
    <app-my-group :members="interestedList" :myGroupMaxSize="requiredRoommates" @submit="groups.push($event)"></app-my-group>
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
      default: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  data() {
    return {
      groups: [
        {
          members: ['5ad8588944db813fe850c923'],
          status: ["in"],
          loaded: false
        },
        {
          members: ["5ad8588944db813fe850c923", "5ae46e3ab67e3d46f895c53c", "5af6e0274507132c7c2016c0"],
          status: ["out", "in", "in"],
          loaded: false
        },
        {
          members: ["5ae46e3ab67e3d46f895c53c", "5af6e0274507132c7c2016c0"],
          status: ["out", "in"],
          loaded: false
        },
        {
          members: ["5ad8588944db813fe850c923", "5af6e0274507132c7c2016c0"],
          status: ["in", "pending"],
          loaded: false
        }
      ]
    };
  },
  methods: {},
  mounted() {
    console.log(this.groups)
    const id = union.apply(null, this.groups.map(g => g.members));
    this.$store.dispatch('fetchUser', {id})
    .then((users) => {
      for(let i = 0; i < this.groups.length; i++) {
        console.log(this.groups[i].members);
        for (let j = 0; j < this.groups[i].members.length; j++) {
          this.groups[i].members[j] = users[this.groups[i].members[j]];
        }
        this.groups[i].loaded = true;
      }
    })
    .catch(e => console.log(e));
  },

  components: {
    AppGroup,
    AppMyGroup
  }
};
</script>

<style scoped>
</style>

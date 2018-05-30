<template>
<div>
  <v-container grid-list-xl>
    <div class="title">Suggested Groups</div>
    <v-layout wrap>
      <v-flex xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
        <app-group v-model="groups[i]"></app-group>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container grid-list-sm>
    <div class="subheading">Create Your Own Group</div>
    <div class="caption mb-2">Drag other interested fellows to your group.</div>
    <app-my-group :members="interestedList" :myGroupMaxSize="requiredRoommates" @submit="groups.push($event)"></app-my-group>
  </v-container>
</div>
</template>

<script>
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
          members: ["Moshe Biton"],
          status: ["in"]
        },
        {
          members: ["Alex Vlda", "Yani Max", "Roberto Carlos"],
          status: ["out", "in", "in"]
        },
        {
          members: ["Gene the Pacemaker", "Lora Keva"],
          status: ["out", "in"]
        },
        {
          members: ["Yoram Rahamim", "Shmuel Azulai"],
          status: ["in"]
        }
      ]
    };
  },
  methods: {},

  components: {
    AppGroup,
    AppMyGroup
  }
};
</script>

<style scoped>
</style>

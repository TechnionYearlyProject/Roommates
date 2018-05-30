<template>
<div>
  <v-container grid-list-xl>
    <div class="title">Suggested Groups</div>
    <v-layout wrap>
      <v-flex xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
        <v-card fluid style="border: 1px">
          <v-list style="height:300px;overflow-y: auto;">
            <template  v-for="(m,j) in g.members">
            <v-list-tile :key="`member-${j}`" @click="" avatar>
              <v-list-tile-action>
                <v-icon v-if="g.status[j] === 'in'" color="teal">mdi-comment-check-outline</v-icon>
                <v-icon v-else-if="g.status[j] === 'out'" color="red">mdi-comment-remove-outline</v-icon>
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
            <v-divider></v-divider>
            </template>
          </v-list>
          <v-divider></v-divider>
          <v-progress-linear :value="optInNumber(g) / g.members.length * 100" height="4" color="teal" class="pt-0 mt-0"></v-progress-linear>
          <div>
          <v-btn @click="optIn(g)" outline fab small color="teal"><v-icon>check</v-icon></v-btn>
          <span class="teal--text body-2">Count me in!</span>
          </div>
          <div>
          <v-btn @click="optOut(g)" outline fab small color="red"><v-icon>close</v-icon></v-btn>
          <span class="red--text body-1">Not a chance.</span>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container grid-list-sm>
    <div class="subheading">Create Your Own Group</div>
    <div class="caption mb-2">Drag other interested fellows to your group.</div>
    <v-layout wrap>
      <v-flex xs12 sm6>
        <div class="body-1">Group ({{ myGroupSize }}/{{ myGroupMaxLength }})</div> 
        <v-list subheader>
          <draggable v-model="myGroup" :options="dragOptions" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
            <v-list-tile v-for="e in myGroup" @click="" avatar>
              {{ e }}
            </v-list-tile>
          </draggable>
        </v-list>
      </v-flex>
      <v-flex xs12 sm6>
      <div class="body-1">These people expressed interest:</div>
      <v-list subheader>
        <draggable v-model="hisArray" :options="dragOptions" :move="onMove" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
          <v-list-tile v-for="e in hisArray" @click="" avatar>
          {{ e }}
          </v-list-tile>
        </draggable>
      </v-list>
      </v-flex>
      <v-btn @click="addMyGroup" :disabled="myGroupSize !== myGroupMaxLength" color="success">Add Group</v-btn>
      <v-btn @click="clearMyGroup">Clear</v-btn>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import draggable from 'vuedraggable'
import AppAvatar from './sub-components/AppAvatar';

export default{
  data() {
    return {
      groups: [
        {
          members: [1],
          status: ['in']
        },
        {
          members: [1,2,3],
          status: ['out','in','in']
        },
        {
          members:[1,2],
          status: ['out','in']
        },
        {
          members:[3,4],
          status: ['in']
        }],
      myGroup: [1,2,3,4],
      hisArray: [5,6,7,8],
      isDragging: false,
      editable: true,
      delayedDragging: false,
      myGroupMaxLength: 4
    }
  },
  methods: {
    onMove ({relatedContext, draggedContext}) {
      return this.myGroup.length < this.myGroupMaxLength;
    },
    clearMyGroup() {
      this.hisArray = this.hisArray.concat(this.myGroup);
      this.myGroup = [];
    },
    addMyGroup() {
      this.groups.push({
        members: this.myGroup,
        status: Array(this.myGroup.length).fill('not-set')
        });
      this.clearMyGroup();
    },
    optOut(group) {

    },
    optIn(group) {

    },
    optInNumber(group) {
      console.log(group);
      return group.status.filter((m) => m === 'in').length;
    }
  },
  computed: {
    dragOptions () {
      return  {
        animation: 0,
        scroll: true,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'app-drag-ghost',
        chosenClass: 'app-drag-chosen',
        dragClass: 'app-drag-chosen',
      };
    },
    myGroupSize() {
      return this.myGroup.length;
    },
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging= true
        return
      }
      this.$nextTick( () => {
           this.delayedDragging =false
      });
    }
  },
  components: {
    draggable,
    AppAvatar
  }
}
</script>

<style>
.app-drag-ghost {
  opacity: .5;
  background: #C8EBFB;
}
.app-drag-chosen {
  opacity: 1;
  background: #C8EBFB;
}
.app-drag-handle {
  cursor: move;
	cursor: -webkit-grabbing;
}
</style>

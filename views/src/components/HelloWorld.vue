<template>
<div>
  <v-container grid-list-xl>
    Suggested Groups
    <v-layout wrap>
      <v-flex xs12 sm6 md4 lg3 v-for="(g,i) in groups" :key="`group-${i}`">
        <v-list subheader style="height:300px;overflow-y: auto;">
          <template  v-for="(m,j) in g.members">
          <v-list-tile :key="`member-${j}`" @click="" avatar>
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
      </v-flex>
    </v-layout>
  </v-container>
  <v-container grid-list-sm>
    <v-layout wrap>
      <v-flex xs12 sm6>
  My Group ({{ myGroupSize }}/{{ myGroupMaxLength }})
    <v-list subheader>
  <draggable v-model="myGroup" :options="dragOptions" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
      <v-list-tile v-for="e in myGroup" @click="" avatar>
        {{ e }}
      </v-list-tile>
  </draggable>
    </v-list>
    </v-flex>
    <v-flex xs12 sm6>
    These people expressed interest:
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
      groups: [{members:[1]},{members:[1,2,3]},{members:[1,2]},{members:[3,4]}],
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
      this.groups.push({members: this.myGroup});
      this.clearMyGroup();
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
    }
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

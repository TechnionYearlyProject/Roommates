<template>
<div>
  <v-container grid-list-sm>
    <v-layout wrap>
      <v-flex xs12 sm6>
  My Group ({{ myGroupSize }}/{{ myGroupMaxLength }})
    <v-list>
  <draggable v-model="myGroup" :options="dragOptions" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
      <v-list-tile v-for="e in myGroup" class="app-drag-handle">
        {{ e }}
      </v-list-tile>
  </draggable>
    </v-list>
    </v-flex>
    <v-flex xs12 sm6>
    These people expressed interest:
  <v-list >
  <draggable v-model="hisArray" :options="dragOptions" :move="onMove" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
      <v-list-tile v-for="e in hisArray" class="app-drag-handle">
        {{ e }}
      </v-list-tile>
  </draggable>
    </v-list>
    </v-flex>
    </v-layout>
    </v-container>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default{
  data() {
    return {
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
    draggable
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

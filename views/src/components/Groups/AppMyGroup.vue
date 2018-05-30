<template>
    <v-layout wrap>
      <v-flex xs12 sm6>
        <v-toolbar dark dense color="primary lighten-3">
          <span class="mb-1 ml-3">My Group ({{ myGroup.length }}/{{ myGroupMaxSize }})</span>
        </v-toolbar>
        <v-card>
          <v-btn v-if="$vuetify.breakpoint.xsOnly" @click.stop="peopleDialog = true" color="secondary" dark absolute top right fab style="z-index:1">
            <v-icon>add</v-icon>
          </v-btn>
          <v-dialog v-model="peopleDialog" scrollable max-width="400px">
            <v-card>
              <v-card-title>Choose people</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-list subheader>
                  <v-list-tile v-for="(e,i) in members" :key="`xs-interested-${i}`" @click.capture.stop="toggleSelection(e)" avatar>
                    <v-list-tile-action>
                      <v-checkbox v-model="myGroup" :value="e" :disabled="myGroup.length >= myGroupMaxSize && !myGroup.includes(e)"/>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      {{ e }}
                    </v-list-tile-content>
                    <v-list-tile-avatar>
                      <app-avatar name="Alon" :size="40"></app-avatar>
                    </v-list-tile-avatar>
                  </v-list-tile>
                </v-list>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn  flat @click.native="peopleDialog = false">Cancel</v-btn>
                <v-btn color="secondary" flat @click.native="updateAvailableMembers(); peopleDialog = false">Done</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-list>
            <draggable v-model="myGroup" :options="dragOptions" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
              <div v-for="(e,i) in myGroup">
                <v-list-tile :key="`my-group-${i}`" @click="" avatar>
                  <v-list-tile-avatar>
                    <app-avatar name="Alon" :size="40"></app-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                      {{ e }}
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="`divider-my-group-${i}`"></v-divider>
              </div>
            </draggable>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-toolbar dense color="secondary">
            <div class="mb-1 ml-3">People Who Expressed Interest</div>
          </v-toolbar>
          <v-card>
            <v-list>
              <draggable v-model="availableMemebers" :options="dragOptions" :move="onMove" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
                <div v-for="(e,i) in availableMemebers">
                  <v-list-tile :key="`interest-${i}`" @click="" avatar>
                    <v-list-tile-avatar>
                      <app-avatar name="Alon" :size="40"></app-avatar>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      {{ e }}
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="`divider-interest-${i}`" slot="footer"></v-divider>
                </div>
              </draggable>
            </v-list>
          </v-card>
        </div>
      </v-flex>
      <v-btn @click="submit" :disabled="myGroup.length !== myGroupMaxSize" color="success">Add Group</v-btn>
      <v-btn @click="clearMyGroup">Clear</v-btn>
    </v-layout>
</template>

<script>
import draggable from "vuedraggable";
import AppAvatar from "../sub-components/AppAvatar";

export default {
  props: {
    myGroupMaxSize: {
      type: Number,
      required: true
    },
    members: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      myGroup: [],
      delayedDragging: false,
      availableMemebers: null,
      isDragging: false,
      editable: true,
      peopleDialog: false
    };
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      return this.myGroup.length < this.myGroupMaxSize;
    },
    updateAvailableMembers() {
      this.availableMemebers = this.availableMemebers.filter(e => !this.myGroup.includes(e));
    },
    clearMyGroup() {
      this.availableMemebers = this.availableMemebers.concat(this.myGroup);
      this.myGroup = [];
    },
    toggleSelection(member) {
      const i = this.myGroup.indexOf(member);
      if (i > -1) {
        this.myGroup.splice(i, 1);
      } else if (this.myGroup.length < this.myGroupMaxSize) {
        this.myGroup.push(member);
      }
    },
    submit() {
      this.$emit("submit", {
        members: this.myGroup,
        status: Array(this.myGroup.length).fill("not-set")
      });
      this.clearMyGroup();
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        scroll: true,
        group: "description",
        disabled: !this.editable,
        ghostClass: "app-drag-ghost",
        chosenClass: "app-drag-chosen",
        dragClass: "app-drag-chosen"
      };
    }
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  },
  created() {
    this.availableMemebers = this.members.slice();
  },
  components: {
    draggable,
    AppAvatar
  }
};
</script>

<style>
.app-drag-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.app-drag-chosen {
  opacity: 1;
  background: #c8ebfb;
}
.app-drag-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}
</style>

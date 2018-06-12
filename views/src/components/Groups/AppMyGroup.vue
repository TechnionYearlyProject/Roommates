<template>
  <div>
    <v-layout v-if="!loaded" wrap>

    </v-layout>
    <v-layout v-else wrap>
      <v-flex xs12 sm6>
        <v-toolbar dark dense color="primary lighten-3">
          <span class="mb-1 ml-3">My Group ({{ myGroupIds.length }}/{{ myGroupMaxSize }})</span>
          <v-spacer></v-spacer>
          <v-icon v-show="$vuetify.breakpoint.smAndUp">open_with</v-icon>
        </v-toolbar>

        <!-- the group that I'm building layout -->
        <v-card>

          <!-- display for small screens only -->
          <v-btn v-if="$vuetify.breakpoint.xsOnly" @click.stop="peopleDialog = true" color="secondary" dark absolute top right fab style="z-index:1">
            <v-icon>add</v-icon>
          </v-btn>
          <v-dialog v-model="peopleDialog" scrollable max-width="400px">
            <v-card>
              <v-card-title>Choose people</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-list subheader>
                  <v-list-tile v-for="(id,i) in interestedUsersids" :key="`xs-interested-${i}`" @click.capture.stop="toggleSelection(id)" avatar>
                    <v-list-tile-action>
                      <v-checkbox v-model="myGroupIds" :value="id" :disabled="myGroupIds.length >= myGroupMaxSize && !myGroupIds.includes(id)"/>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      {{ getName(interestedUsers[id]) }}
                    </v-list-tile-content>
                    <v-list-tile-avatar>
                      <app-avatar :name="getName(interestedUsers[id])" :size="40"></app-avatar>
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


          <!-- the actual group that I'm building -->
          <v-list>
            <draggable v-model="myGroupIds" :options="dragOptions" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
              <div v-for="(id,i) in myGroupIds">
                <v-list-tile :key="`my-group-${i}`" @click="" avatar>
                  <v-list-tile-avatar>
                    <app-avatar :name="getName(interestedUsers[id])" :size="40"></app-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                      {{ getName(interestedUsers[id]) }}
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
            <v-spacer></v-spacer>
            <v-icon v-show="$vuetify.breakpoint.smAndUp">open_with</v-icon>
          </v-toolbar>
          <v-card>
            <v-list>
              <draggable v-model="interestedUsersids" :options="dragOptions" :move="onMove" @start="isDragging = true" @end="isDragging = false" style="height:300px;overflow-y: auto;">
                <div v-for="(id,i) in interestedUsersids">
                  <v-list-tile :key="`interest-${i}`" @click="" avatar>
                    <v-list-tile-avatar>
                      <app-avatar :name="getName(interestedUsers[id])" :size="40"></app-avatar>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      {{ getName(interestedUsers[id]) }}
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="`divider-interest-${i}`" slot="footer"></v-divider>
                </div>
              </draggable>
            </v-list>
          </v-card>
        </div>
      </v-flex>
      <v-btn @click="submit" :disabled="myGroupIds.length !== myGroupMaxSize" color="success">
        <v-icon left>group_add</v-icon>
        Add Group
        </v-btn>
      <v-btn @click="clearMyGroup">Clear</v-btn>
    </v-layout>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import AppAvatar from "../sub-components/AppAvatar";

export default {
  props: {
    apartmentId: {
      type: String,
      required: true
    },
    myGroupMaxSize: {
      type: Number,
      required: true
    },
    interested: {
      required: true
    }
  },
  data() {
    return {
      interestedUsers: [], // object
      interestedUsersids: [], // list of ids (of interested users)
      myGroupIds: [], // list of ids (of the group users)
      delayedDragging: false,
      availableMemebers: [],
      isDragging: false,
      editable: true,
      peopleDialog: false,
      loaded: false
    };
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      return this.myGroupIds.length < this.myGroupMaxSize;
    },
    updateAvailableMembers() {
      this.availableMemebers = this.availableMemebers.filter(e => !this.myGroupIds.includes(e));
    },
    clearMyGroup() {
      this.availableMemebers = this.availableMemebers.concat(this.myGroupIds);
      this.myGroupIds = [];
    },
    toggleSelection(id) {
      const i = this.myGroupIds.indexOf(id);
      if (i > -1) {
        this.myGroupIds.splice(i, 1);
      } else if (this.myGroupIds.length < this.myGroupMaxSize) {
        this.myGroupIds.push(id);
      }
    },
    getName(m) {
      return `${m.firstName.capitalize()}`+ (m.lastName ? ` ${m.lastName.capitalize()}` : '');
    },
    submit() {
      this.$emit("submit", this.myGroupIds);
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
  mounted() {
    if (!this.interested) {
      this.$store.dispatch('searchApartments', { id: this.apartmentId })
      .then((apartments) => {
        this.interestedUsersids = apartments[0]._interested;
        this.$store.dispatch('fetchUser', { id: this.interestedUsersids })
        .then((users) => {
          this.interestedUsers = users;
           this.loaded = true;
        });
      })
      .catch(error => console.log(error));
    } else {
      this.interestedUsersids = this.interested;
      this.$store.dispatch('fetchUser', { id: this.interestedUsersids })
        .then((users) => {
          this.interestedUsers = users;
           this.loaded = true;
        });
    }
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

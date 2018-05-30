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
    <v-layout wrap>
      <v-flex xs12 sm6>
        <div class="body-1 mb-1">Group ({{ myGroupSize }}/{{ myGroupMaxLength }})</div>
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
                  <v-list-tile v-for="(e,i) in interestedList" :key="`xs-interested-${i}`" @click="toggleCheckBox(e)" avatar>
                    <v-list-tile-action>
                      <v-checkbox v-model="myGroup" :value="e" :disabled="myGroupSize >= myGroupMaxLength && !myGroup.includes(e)"/>
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
                <v-btn color="blue darken-1" flat @click.native="peopleDialog = false">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click.native="updateAvailableMembers(); peopleDialog = false">Done</v-btn>
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
          <div class="body-1 mb-1">These people expressed interest:</div>
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
      <v-btn @click="addMyGroup" :disabled="myGroupSize !== myGroupMaxLength" color="success">Add Group</v-btn>
      <v-btn @click="clearMyGroup">Clear</v-btn>
    </v-layout>
  </v-container>
  <div style="height:500px"></div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import AppAvatar from './sub-components/AppAvatar';
import AppGroup from './AppGroup';

export default{
  data() {
    return {
      groups: [
        {
          members: ['Moshe Biton'],
          status: ['in']
        },
        {
          members: ['Alex Vlda', 'Yani Max', 'Roberto Carlos'],
          status: ['out','in','in']
        },
        {
          members:['Gene the Pacemaker', 'Lora Keva'],
          status: ['out','in']
        },
        {
          members:['Yoram Rahamim', 'Shmuel Azulai'],
          status: ['in']
        }],
      myGroup: [],
      availableMemebers: [1,2,3,4,5,6,7,8],
      interestedList: [1,2,3,4,5,6,7,8],
      isDragging: false,
      editable: true,
      delayedDragging: false,
      myGroupMaxLength: 4,
      optInDialog: false,
      optOutDialog: false,
      peopleDialog: false
    }
  },
  methods: {
    onMove ({relatedContext, draggedContext}) {
      return this.myGroup.length < this.myGroupMaxLength;
    },
    updateAvailableMembers() {
        this.availableMemebers = this.availableMemebers.filter((e) => !this.myGroup.includes(e));
    },
    clearMyGroup() {
      this.availableMemebers = this.availableMemebers.concat(this.myGroup);
      this.myGroup = [];
      this.potentialMembers = [];
    },
    addMyGroup() {
      this.groups.push({
        members: this.myGroup,
        status: Array(this.myGroup.length).fill('not-set')
        });
      this.clearMyGroup();
    },
    toggleCheckBox(member) {
      const i = this.myGroup.indexOf(member)
        if (i > -1) {
          this.myGroup.splice(i, 1)
        } else if (this.myGroupSize < this.myGroupMaxLength) {
          this.myGroup.push(member)
        }
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
    AppAvatar,
    AppGroup
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

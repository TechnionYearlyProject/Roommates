<template>
<div>
  <v-container grid-list-xl>
    <div class="title">Suggested Groups</div>
    <v-layout wrap>
      <v-flex xs12 sm6 md4 v-for="(g,i) in groups" :key="`group-${i}`">
        <v-card fluid style="border: 1px">
          <v-list style="height:300px;overflow-y: auto;">
            <template  v-for="(m,j) in g.members">
            <v-list-tile :key="`member-${j}`" @click="" avatar :disabled="disabledGroups.includes(i)">
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
            <v-divider :key="`divider-member-${j}`"></v-divider>
            </template>
          </v-list>
          <v-divider></v-divider>
          <v-progress-linear :value="optInNumber(g) / g.members.length * 100" height="4" color="teal" class="mt-0 mb-1"></v-progress-linear>
          <div>
            <v-btn slot="activator" block outline @click.stop="optInDialog = true" color="success" class="pa-0 ma-0 mb-1">
                <v-icon>check</v-icon>
                Count me in!
            </v-btn>
            <v-dialog v-model="optInDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Do you want to continue?</v-card-title>
                <v-card-text>Just to make sure you didn't click <span class="teal--text">Approve</span> by mistake.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat @click.native="optIn(g);optOutDialog = false">I'm sure!</v-btn>
                  <v-btn color="grey darken-3" flat @click.native="optInDialog = false">nevermind...</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>  
          </div>
          <div>
            <v-btn block outline @click.stop="optOutDialog = true" color="error" class="pa-0 ma-0">
              <v-icon>close</v-icon>
              Not a chance.
            </v-btn>
            <v-dialog v-model="optOutDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Are you sure you want to leave?</v-card-title>
                <v-card-text>Just to make sure you didn't click<br> <span class="red--text">Decline</span> by mistake.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click.native="optOut(i);optOutDialog = false">Yes, let me out!</v-btn>
                  <v-btn color="grey darken-3" flat @click.native="optOutDialog = false">nevermind...</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>  
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
                <v-list>
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
          <v-list subheader>
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
            <v-list subheader>
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
      myGroup: [],
      availableMemebers: [1,2,3,4,5,6,7,8],
      interestedList: [1,2,3,4,5,6,7,8],
      disabledGroups: [],
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
    optOut(groupIndex) {
      this.disabledGroups.push(groupIndex);
    },
    optIn(group) {

    },
    optInNumber(group) {
      return group.status.filter((m) => m === 'in').length;
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

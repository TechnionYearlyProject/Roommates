<template>
    <div style="overflow-y: auto; height: 100%">
        <v-list v-if="hasFavors">
            <div v-if="!usersList" class="text-xs-center">
                <v-progress-circular indeterminate :size="25" :width="3" color="purple" class="my-5" />
            </div>
            <transition-group v-else name="scale-transition" mode="out-in">
                <v-list-tile avatar v-for="(favor, i) in favors" :key="`interested-${i}`" @click="goToProfile(favor)">
                    <v-list-tile-action>
                        <v-icon color="amber accent-3">star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="getName(favor)"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-avatar>
                        <img :src="userDefaultImage">
                    </v-list-tile-avatar>
                </v-list-tile>
            </transition-group>
        </v-list>
        <div v-if="!hasFavors()" class="text-xs-center">
            No one expressed interet
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import userDefault from '../../assets/user-default.jpg';

    export default {
      props: {
        favors: {
          type: Array,
          default: [],
          required: true
        }
      },
      data() {
        return {
          usersList: null,
          userDefaultImage: userDefault
        };
      },
      methods: {
        ...mapGetters(['isVerified', 'getUser']),
        isMyFavor(favor) {
          return this.isVerified && favor === this.getUser._id;
        },
        hasFavors() {
          return this.favors.length > 0;
        },
        goToProfile(favor) {
          this.$router.push({ name: 'AppUserProfile', params: { id: favor } });
        },
        fetchUsers() {
          if (!this.hasFavors()) {
            this.usersList = [];
          } else {
            this.$store.dispatch('fetchUser', { id: this.favors }).then((users) => {
              this.usersList = users;
            });
          }
        },
        getName(favor) {
          if (!this.usersList[favor]) {
            return 'User';
          } else if (this.isMyFavor(favor)) {
            return 'You';
          } else { // eslint-disable-line
            return `${this.usersList[favor].firstName} ${
              this.usersList[favor].lastName
            }`;
          }
        }
      },
      beforeMount() {
        this.fetchUsers();
      },
      mounted() {
        //   if (this.isVerified) {
        //       this.store.dispatch('getSortedFavors')
        //   }
      }
    };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>

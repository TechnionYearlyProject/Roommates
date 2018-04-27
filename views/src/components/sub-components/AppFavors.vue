<template>
    <div style="overflow-y: auto; height: 100%">
        <v-list v-if="hasFavors">
            <transition-group name="scale-transition" mode="out-in">
                <v-list-tile avatar v-for="(favor, i) in favors" :key="`interested-${i}`" @click="goToProfile(favor)">
                    <v-list-tile-action>
                        <v-icon color="amber accent-3">star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="favor"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-avatar>
                        <img :src="userDefaultImage">
                    </v-list-tile-avatar>
                </v-list-tile>
            </transition-group>
        </v-list>
        <div v-else>
            No one expressed interet
        </div>
    </div>
</template>

<script>
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
          userDefaultImage: userDefault
        };
      },
      methods: {
        hasFavors() {
          return this.favors.length > 0;
        },
        goToProfile() {
          this.$router.push({ name: 'AppUserProfile' }); // , params: {} },);
        }
      }
    };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>

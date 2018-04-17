<template>
    <v-toolbar app absolute clipped-left dark color="primary">
        <v-toolbar-side-icon @click.stop="toggleSearchMenu"></v-toolbar-side-icon>
        <v-btn dark flat exact :to="{ name: 'AppMain' }" class="pr-3" active-class="">
        
        <v-toolbar-title class="hidden-xs-only">Roommates</v-toolbar-title>
        <v-toolbar-title class="hidden-sm-and-up">R</v-toolbar-title>

        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!-- always show -->
            <!-- <v-btn flat exact :to="{ name: 'AppMain' }">
                <span class="text-xs-center">
                    <v-icon>home</v-icon>
                    <span class="hidden-xs-only">
                        <br>
                        <small>Home</small>
                    </span>
                </span>
            </v-btn> -->
            <!-- show only when not authenticated -->
            <template v-if="!isAuthenticated">
                <v-btn flat exact :to="{ name: 'AppIdentification' }">
                    <span class="text-xs-center">
                        <v-icon>lock_open</v-icon>
                        <span class="hidden-xs-only">
                            <br>
                            <small>Login</small>
                        </span>
                    </span>
                </v-btn>
            </template>
            <!-- show only when authenticated -->
            <template v-if="isAuthenticated">
                <v-btn flat exact :to="{ name: 'AppPublishApartment' }">
                    <span class="text-xs-center">
                        <v-icon>add</v-icon>
                        <span class="hidden-xs-only">
                            <br>
                            <small>Advertise</small>
                        </span>
                    </span>
                </v-btn>
                <v-menu offset-y nudge-left="25" attach open-on-hover>
                    <v-btn flat slot="activator">
                        <app-avatar image='' name='alon'></app-avatar>
                    </v-btn>
                    <v-list light>
                        <v-list-tile v-for="(item,i) in menuItems" :key="`item-${i}`" exact :to="{name: item.to}" @click="item.do">
                            <v-list-tile-title>
                                <v-icon light>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </template>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { mapMutations } from 'vuex';
    import AppAvatar from './AppAvatar';

    export default {
      data() {
        return {
          menuItems: [
            {
              title: 'Profile',
              icon: 'account_box',
              to: 'AppUserProfile',
              do: () => {}
            },
            {
              title: 'Account',
              icon: 'settings',
              to: '##',
              do: () => {}
            },
            {
              title: 'Logout',
              icon: 'exit_to_app',
              to: 'AppMain',
              do: () => this.$store.dispatch('logout')
            }
          ],
        };
      },
      methods: {
        ...mapMutations(['toggleDrawer']),
        toggleSearchMenu() {
            if (this.$route.name === 'AppMain') {
                this.toggleDrawer();
            } else {
                this.toggleDrawer(true);
                this.$router.push({ name: 'AppMain' });
            }
        }
      },
      computed: {
        ...mapGetters(['isAuthenticated', 'isVerified']),
      },
      components: {
        AppAvatar
      }
    };
</script>

<style>

</style>

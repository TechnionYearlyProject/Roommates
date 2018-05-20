<template>
  <v-menu transition="slide-y-transition" offset-y bottom left attach lazy :close-on-content-click="false">
    <v-btn flat slot="activator" style="min-width:0" @click="sendNotificationReadMessage">
      <span class="text-xs-center">
        <v-badge :value="hasNewNotifications" right color="red" overlap>
          <span slot="badge">{{ unreadNotifications.length }}</span>
          <v-icon>{{ notificationsIcon }}</v-icon>
        </v-badge>
        <span class="hidden-xs-only">
          <br>
          <small>Notifications</small>
        </span>
      </span>
    </v-btn>
    <v-card light style="width: 250px">
      <div class="body-2 pl-3 py-3" style="line-height: 20px;">
        Notifications
      </div>
      <v-divider light/>
      <v-list v-if="notificationsReady" light three-line class="pt-0">
        <div v-if="notifications.length > 0" style="max-height:350px; overflow-y: auto;">
          <template v-for="(notification, i) in notifications">
            <template v-if="i + 1 <= notificationsShowCount">
              <v-list-tile :key="`notification-${i}`" :class="{grey: notification.wasRead, 'lighten-3': notification.wasRead}" @click="goToAd(notification)">
                <v-list-tile-action>
                  <v-icon :color="notification.wasRead? 'grey' : attr[notification.notificationType].color">{{ attr[notification.notificationType].icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-layout row wrap align-center style="flex: 0 1 auto;">
                    <v-flex xs12>
                      <div class="body-1 my-1">{{ attr[notification.notificationType].title }}</div>
                    </v-flex>
                    <v-flex xs12 @click.stop>
                      <div class="my-1 body-2">
                        By
                        <span>
                          <router-link :to="{name: 'AppUserProfile', params: { id: notification._createdBy[0] } }">
                            {{ notification.users[notification._createdBy[0]].firstName.capitalize() }} {{ notification.users[notification._createdBy[0]].lastName.capitalize() }}
                          </router-link>
                          <span v-if="notification._createdBy.length > 1" @input.stop>
                            <span>and </span>
                            <v-tooltip right offset-overflow>
                              <a slot="activator" @click.stop="openDialog(notification)" style="text-decoration: underline;">
                                {{ `${notification._createdBy.length - 1} ${notification._createdBy.length > 2 ? 'others' : 'other'}` }}
                              </a>
                              <ul v-for="(userId,i) in notification._createdBy" v-if="i > 0" :key="`user-${i}`">
                                <li>{{ notification.users[userId].firstName.capitalize() }} {{ notification.users[userId].lastName.capitalize() }}</li>
                              </ul>
                            </v-tooltip>
                          </span>
                        </span>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-list-tile-content>
                <v-list-tile-action class="pl-3" style="align-items:flex-start">
                  <div class="caption">{{ new Date(notification.createdAt).toLocaleDateString() }}</div>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider light :key="`divider-${i}`" />
            </template>
          </template>
        </div>
        <div class="text-xs-center body-1 grey--text my-3" v-else>No notifications</div>
      </v-list>
      <div class="text-xs-center my-3" v-else>
        <v-progress-circular indeterminate color="purple"></v-progress-circular>
      </div>
      <div class="text-xs-center" style="line-height: 32px;">
        <a v-if="notificationsShowCount < notifications.length" class="primary--text text--darken-1" @click="showMore">See More</a>
        <div v-else class="caption" @click="showMore">You've reached the bottom</div>
      </div>
    </v-card>
    <v-dialog v-model="dialog.show" scrollable max-width="300px">
      <v-card>
        <v-layout>
        <v-card-title>{{Object.keys(dialog.users).length }} people</v-card-title>
        <v-spacer/>
        <v-btn icon @click="dialog.show = false"><v-icon>close</v-icon></v-btn>
        </v-layout>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile v-for="(user,i) in dialog.users" :key="`dialog-${i}`" avatar @click="$router.push({name: 'AppUserProfile', params: { id: user._id } }); dialog.show = false">
            <v-list-tile-content>
              <v-list-tile-title>{{ user.firstName.capitalize() }} {{ user.lastName.capitalize() }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              <img :src="user.image || defaultImage">
            </v-list-tile-avatar>
          </v-list-tile>
        </v-list>
      </v-card>
  </v-dialog>
  </v-dialog>
  </v-menu>
</template>

<script>
  import { mapGetters } from 'vuex';
  import image from '../../assets/user-default.jpg';

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        notifications: [],
        notificationsShowCount: 4,
        unreadNotifications: [],
        people: [],
        attr: [
          {},
          {
            color: 'info',
            icon: 'add_comment',
            title: 'New Comment!'
          },
          {
            color: 'pink',
            icon: 'favorite',
            title: 'New Interest!'
          },
          {
            color: 'info',
            icon: 'edit',
            title: 'An ad was updated'
          }
        ],
        notificationsReady: false,
        dialog: {
          show: false,
          users: []
        },
        defaultImage: image
      };
    },
    methods: {
      fetchUser(notification) {
        const id = notification._createdBy;
        return this.$store
          .dispatch('fetchUser', { id })
          .then((users) => {
            notification.users = users;
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
          });
      },
      fetchPeople() {
        const promises = [];
        for (let i = 0; i < this.notifications.length; i += 1) {
          promises.push(this.fetchUser(this.notifications[i]));
        }
        Promise.all(promises).then(() => {
          this.notificationsReady = true;
        });
      },
      pushUnreadNotifications() {
        for (let i = 0; i < this.notifications.length; i += 1) {
          if (this.notifications[i].wasRead === false) {
            this.unreadNotifications.push(this.notifications[i]);
          }
        }
      },
      showMore() {
        this.notificationsShowCount = Math.min(
          this.notifications.length,
          this.notificationsShowCount + 2
        );
      },
      sendNotificationReadMessage() {
        if (this.unreadNotifications.length > 0) {
          const id = this.unreadNotifications.map(n => n._id);
          this.$store
            .dispatch('updateNotification', {
              params: { id },
              payload: { wasRead: true }
            })
            .then(() => {
              this.unreadNotifications = [];
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
            });
        }
      },
      async goToAd(n) {
        this.$store.commit('showLoading');
        this.$router.push({ name: 'AppMain' });
        await this.$store.dispatch('searchApartments', {
          id: n._notifiedObjectsIds[0]
        });
        this.$store.commit('hideLoading');
      },
      openDialog(n) {
        this.dialog.users = n.users;
        this.dialog.show = true;
      }
    },
    computed: {
      ...mapGetters(['getUser']),
      notificationsIcon() {
        return this.hasNewNotifications ? 'notifications' : 'notifications_none';
      },
      hasNewNotifications() {
        return this.unreadNotifications.length > 0;
      }
    },
    mounted() {
      this.notifications = this.getUser.notifications;
      this.fetchPeople();
      this.pushUnreadNotifications();
    },
    sockets: {
      notification(message) {
        this.fetchUser(message).then(() => {
          this.notifications.unshift(message);
          this.unreadNotifications.push(this.notifications[0]);
          // eslint-disable-next-line
          console.log(message);
        });
      }
    }
  };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>

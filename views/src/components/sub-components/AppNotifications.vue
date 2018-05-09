<template>
    <v-menu transition="slide-y-transition" offset-y bottom left attach>
        <v-btn flat slot="activator" style="min-width:0">
            <span class="text-xs-center">
                <v-badge :value="hasNotifications" right color="red" overlap>
                    <span slot="badge">{{ unreadNotificationNum }}</span>
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
            <v-list light three-line>
                <div v-if="notifications.length > 0" style="max-height:350px; overflow-y: auto;">
                    <template v-for="(notification, i) in notifications">
                        <v-list-tile :key="`notification-${i}`" :class="{grey: notification.wasRead, 'lighten-3': notification.wasRead}">
                            <v-list-tile-action>
                                <v-icon :color="notification.wasRead? 'grey' : 'pink'">{{ getNotificationIcon(notification) }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-layout row wrap align-center style="flex: 0 1 auto;">
                                    <v-flex xs12>
                                        <div class="body-1 my-1">{{ getNotificationTitle(notification) }}</div>
                                    </v-flex>
                                    <v-flex xs12>
                                        <div class="body-2 my-1">{{ getNotificationSubtitle(notification) }}</div>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile-content>
                            <v-list-tile-action class="pl-3" style="align-items:flex-start">
                                <div class="caption">{{ new Date(notification.createdAt).toLocaleDateString() }}</div>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider light :key="`divider-${i}`" />
                    </template>
                </div>
                <div class="text-xs-center body-1 grey--text my-3" v-else>No notifications</div>
            </v-list>
            <div v-if="notifications.length > 0" class="text-xs-center" style="line-height: 32px;">
                <a class="primary--text text--darken-1">See More</a>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    import socketio from 'socket.io-client';

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
          unreadNotificationNum: 0
        };
      },
      methods: {
        getNotificationIcon(n) {
          let icon = '';
          switch (n.notificationType) {
            case 2:
              icon = 'favorite';
              break;
            default:
          }
          return icon;
        },
        getNotificationTitle(n) {
          let title = '';
          switch (n.notificationType) {
            case 2:
              title = 'New Interests!';
              break;
            default:
          }
          return title;
        },
        getNotificationSubtitle(n) {
          return `${n._notifiedObjectsIds.length} people`;
        }
      },
      computed: {
        notificationsIcon() {
          return this.hasNotifications ? 'notifications' : 'notifications_none';
        },
        hasNotifications() {
          return this.notifications.length > 0;
        }
      },
      created() {
        for (let i = 0; i < this.notifications.length; i += 1) {
          if (this.notifications[i].wasRead === false) {
            this.unreadNotificationNum += 1;
          }
        }
      },
      sockets: {
        connect() {
          if (this.$store.getters.isAuthenticated) {
            this.$socket
              .emit('authenticate', { token: this.$store.getters.getToken })
              .on('authenticated', () => {
                this.$socket.emit('join');
                console.log('authorized');
              })
              .on('unauthorized', function(msg) {
                console.log('not authorized');
              });
          }
        },
        notification(message) {
          this.notifications.push(message);
          this.unreadNotificationNum += 1;
          console.log(message);
        }
      }
    };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>

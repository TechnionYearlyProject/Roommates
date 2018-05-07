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
        <v-list light>
            <v-list-tile-title class="body-2 pl-3" style="line-height: 20px;">
                Notifications
            </v-list-tile-title>
            <v-divider light/>
            <div style="max-height:350px; overflow-y: auto;">
                <template v-for="(notification, i) in notifications">
                    <v-list-tile :key="`notification-${i}`" :class="{grey: notification.wasRead, 'lighten-3': notification.wasRead}">
                        <v-list-tile-action>
                            <v-icon v-show="!notification.wasRead" color="success">fiber_new</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ notification.notificationType }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ notification._notifiedObjectsIds }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pl-3" style="align-items:flex-start">
                            <v-list-tile-action-text>{{ notification.createdAt }}</v-list-tile-action-text>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider light :key="`divider-${i}`" />
                </template>
            </div>
            <v-list-tile-title class="text-xs-center" style="line-height: 32px;">
                <a class="primary--text text--darken-1">See More</a>
            </v-list-tile-title>
        </v-list>
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
          notifications: [
          ],
          unreadNotificationNum: 0,
        };
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
              if(this.$store.getters.isAuthenticated) {
                this.$socket.emit('authenticate', { token : this.$store.getters.getToken })
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
              this.unreadNotificationNum +=1;
              console.log(message);
          }
        }
    };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>

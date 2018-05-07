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
                <v-list-tile :key="`notification-${i}`" :class="{grey: notification.read, 'lighten-3': notification.read}">
                    <v-list-tile-action>
                        <v-icon v-show="!notification.read"color="success">fiber_new</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ notification.type }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ notification.text }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="pl-3" style="align-items:flex-start">
                        <v-list-tile-action-text>{{ notification.publishedAt }}</v-list-tile-action-text>
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
            {
              type: 'notification 0',
              text: 'some text here',
              read: false,
              publishedAt: '15 min'
            },
            {
              type: 'notification 1',
              text: 'some text here',
              read: false,
              publishedAt: '20 min'
            },
            {
              type: 'notification 2',
              text: 'some text here',
              read: true,
              publishedAt: '1 hour'
            },
            {
              type: 'notification 3',
              text: 'some text here',
              read: false,
              publishedAt: '2 days'
            }
          ]
        };
      },
      computed: {
        unreadNotificationNum() {
          let count = 0;
          for (let i = 0; i < this.notifications.length; i += 1) {
            if (this.notifications[i].read === false) {
              count += 1;
            }
          }
          return count;
        },
        notificationsIcon() {
          return this.hasNotifications ? 'notifications' : 'notifications_none';
        },
        hasNotifications() {
          return this.notifications.length > 0;
        }
      }
    };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>

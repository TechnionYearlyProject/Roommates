<template>
  <v-card style="min-height:60px">
    <v-list>
      <v-list-tile avatar @click="goToPublisherProfile">
        <v-list-tile-avatar>
          <app-avatar :image="value.image" :name="value.firstName" :size="40"></app-avatar>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ name }}</v-list-tile-title>
          <v-list-tile-sub-title>rating</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-tile>
        <v-icon class="pr-1">email</v-icon>
        <v-list-tile-title>
          <small class="pr-3">E-mail</small>
          {{ value.email }}
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile>
        <v-icon class="pr-1">phone</v-icon>
        <v-list-tile-title>
          <small class="pr-3">Phone</small>
          {{ phone }}
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
    <v-divider inset></v-divider>
    <v-card-actions>
      <v-list-tile>
        <v-list-tile-action>
          <v-switch color="purple"></v-switch>
        </v-list-tile-action>
        <v-list-tile-title>Enable notifications</v-list-tile-title>
      </v-list-tile>
    </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import AppAvatar from '../sub-components/AppAvatar';

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToPublisherProfile() {
      this.$router.push({ name: 'AppUserProfile', params: { id: this.value._id } });
    }
  },
  computed: {
    name() {
      return `${this.value.firstName.capitalize()}`+ (this.value.lastName ? ` ${this.value.lastName.capitalize()}` : '');
    },
    phone() {
      return this.value.phone || 'No Phone';
    }
  },
  components: {
    AppAvatar
  }
}
</script>

<style>

</style>

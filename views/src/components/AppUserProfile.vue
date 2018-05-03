<template>
  <v-layout row warp pt-0>
    <v-flex xs12 sm12 md6 offset-md3 :class="{'my-5': $vuetify.breakpoint.mdAndUp}">
      <v-card>
        <v-card-media :src="image" height="300px">
          <v-layout column class="media">
            <v-card-title primary-title>
              <div class="display-1 white--text ml-3">{{ title }}</div>
              <v-spacer></v-spacer>
              <v-btn dark icon class="mr-3">
                <v-icon>edit</v-icon>
              </v-btn>
            </v-card-title>
          </v-layout>
        </v-card-media>
        <v-list subheader>
          <v-list-group v-model="profile.active" :prepend-icon="profile.icon" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ profile.title }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-container pt-1>
              <div v-for="(property, i) in profile.properties" :key="`property-${i}`" class="pb-3">
                <v-subheader>
                  <!-- <v-icon class="pr-2">{{ property.icon }}</v-icon> -->
                  {{ property.title }}
                  <v-spacer/>
                  <span v-if="property.isEditable">
                    <v-btn icon v-if="!property.edit.active" @click="property.edit.active = true">
                      <v-icon color="info">edit</v-icon>
                    </v-btn>
                    <v-btn icon v-if="property.edit.active" @click="editProperty(property)">
                      <v-icon color="success">check</v-icon>
                    </v-btn>
                    <v-btn icon v-if="property.edit.active" @click="property.edit.active = false; property.value.current = property.value.previous">
                      <v-icon color="error">close</v-icon>
                    </v-btn>
                  </span>
                </v-subheader>
                <span v-if="!property.isEditable || !property.edit.active" class="body-1 pl-3">
                  {{ property.value.current }}
                </span>
                <span v-else>
                  <v-text-field v-if="property.edit.kind === 'text'" class="pt-0 px-3" v-model="property.value.current" :mask="property.edit.mask" :counter="property.edit.counter" :rules="property.edit.rules" :multi-line="property.edit.isMultiline" :error-messages="property.error" single-line autofocus return-masked-value />
                  <v-radio-group v-else-if="property.edit.kind === 'radio'" v-model="property.value.current" :error-messages="property.error" class="pt-0 px-3" row>
                    <v-radio v-for="(gender, i) in genderList" :key="`gender-${i}`" :label="gender.title" :value="gender.value"></v-radio>
                  </v-radio-group>
                </span>
              </div>
            </v-container>
          </v-list-group>
          <v-list-group v-model="attributes.active" :prepend-icon="attributes.icon" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ attributes.title }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-container pt-0 px-5>
              <v-select v-model="attributes.values" @input="updateAttributes" :items="allAttributes" label="Your attributes" :error-messages="attributes.error" :disabled="!isMyProfile" :hint="attributes.hint" persistent-hint chips deletable-chips multiple autocomplete />
              </v-list-tile>
            </v-container>
          </v-list-group>
          <v-list-group v-model="favorites.active" :prepend-icon="favorites.icon" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ favorites.title }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(favorite, i) in favorites.values" :key="`favorites-${i}`">
              <v-list-tile-content>
                <v-list-tile-title>{{ favorite }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-group v-model="publishes.active" :prepend-icon="publishes.icon" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ publishes.title }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(publish, i) in publishes.values" :key="`favorites-${i}`">
              <v-list-tile-content>
                <v-list-tile-title>{{ publish }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
/* eslint no-param-reassign: ["error", { "props": false }] */
import { mapGetters } from 'vuex';
import defaultUserImage from '../assets/user-default.jpg';
import attrList from '../assets/attributes';

export default {
  data() {
    return {
      isMyProfile: false,
      image: null,
      profile: {
        active: true,
        icon: 'person',
        title: 'Profile Information',
        properties: [],
      },
      attributes: {
        active: false,
        icon: 'fitness_center',
        title: 'Attributes and Skills',
        error: [],
        hint: '',
        lastUpdate: null,
        values: [],
      },
      favorites: {
        active: false,
        icon: 'favorite',
        title: 'Interests',
        values: [],
      },
      publishes: {
        active: false,
        icon: 'home',
        title: 'Publishes',
        values: [],
      },
      genderList: [
        {
          title: 'Male',
          value: 'male',
        },
        {
          title: 'Female',
          value: 'female',
        },
      ],
      allAttributes: attrList,
    };
  },
  methods: {
    editProperty(property) {
      if (property.value.current === property.value.previous) {
        property.edit.active = false;
        return;
      }
      this.$store
        .dispatch('updateUser', property.getPayload())
        .then(() => {
          property.error = [];
          property.value.previous = property.value.current;
          property.edit.active = false;
        })
        .catch(error => {
          property.value.current = property.value.previous;
          property.error = 'An error occured!';
          // eslint-disable-next-line
          console.log(error); // show an error message
        });
    },
    updateAttributes(value) {
      this.attributes.hint = 'Updating attributes...';
      const lastUpdate = Date.now();
      this.attributes.lastUpdate = lastUpdate;
      setTimeout(() => {
        if (lastUpdate === this.attributes.lastUpdate) {
          this.$store
            .dispatch('updateUser', { hobbies: value })
            .then(() => {
              this.attributes.error = [];
              this.attributes.hint = 'Saved!';
            })
            .catch(() => {
              this.attributes.error = 'An error occured!';
            });
        }
      }, 2000);
    },
    initProfile(user) {
      this.profile.properties.push({
        title: 'E-mail',
        value: {
          current: user.email,
        },
        icon: 'email',
        error: [],
        isEditable: false,
      });
      this.profile.properties.push({
        title: 'Name',
        value: {
          current: `${user.firstName} ${user.lastName}`,
          previous: `${user.firstName} ${user.lastName}`,
        },
        icon: 'face',
        error: [],
        isEditable: this.isMyProfile,
        edit: {
          active: false,
          kind: 'text',
          rules: [v => v.length <= 25 || ''],
          counter: 25,
        },
        getPayload() {
          const name = this.value.current.split(' ');
          return {
            firstName: name.shift(),
            lastName: name.join(' '),
          };
        },
      });
      this.profile.properties.push({
        title: 'Birthday date',
        value: {
          current: '2018-03-02',
          previous: '2018-03-02',
        },
        icon: 'event',
        error: [],
        isEditable: this.isMyProfile,
        edit: {
          active: false,
          kind: 'text',
          mask: '####-##-##',
        },
        getPayload() {
          return {
            birthdate: new Date(this.value.current).getTime(),
          };
        },
      });
      this.profile.properties.push({
        title: 'Gender',
        value: {
          current: user.gender,
          previous: user.gender,
        },
        icon: 'wc',
        error: [],
        isEditable: this.isMyProfile,
        edit: {
          active: false,
          kind: 'radio',
        },
        getPayload() {
          return {
            gender: this.value.current,
          };
        },
      });
      this.profile.properties.push({
        title: 'Phone',
        value: {
          current: user.mobilePhone,
          previous: user.mobilePhone,
        },
        icon: 'phone',
        error: [],
        isEditable: this.isMyProfile,
        edit: {
          active: false,
          kind: 'text',
          mask: '##########',
        },
        getPayload() {
          return {
            mobilePhone: this.value.current,
          };
        },
      });
      this.profile.properties.push({
        title: 'About',
        value: {
          current: user.about,
          previous: user.about,
        },
        icon: 'dehaze',
        error: [],
        isEditable: this.isMyProfile,
        edit: {
          active: false,
          kind: 'text',
          isMultiline: true,
          rules: [v => v.length <= 147 || ''],
          counter: 147,
        },
        getPayload() {
          return {
            about: this.value.current,
          };
        },
      });
      this.attributes.values = user.hobbies;
      this.favorites.values = user._interestedApartments;
      this.publishes.values = user._publishedApartments;
      this.image = user.image ? user.image : defaultUserImage;
    },
  },
  computed: {
    ...mapGetters(['getUser', 'isAuthenticated']),
    title() {
      return (
        this.profile.properties[1] && this.profile.properties[1].value.current
      );
    },
  },
  mounted() {
    const id = this.$route.params.id;
    if (!id) {
      const user = this.$store.getters.getUser;
      this.isMyProfile = true;
      this.initProfile(user);
    } else {
      this.$store.commit('showLoading');
      this.$store
        .dispatch('fetchUser', { id })
        .then(users => {
          this.isMyProfile = this.isAuthenticated && this.getUser._id === id;
          this.initProfile(users[id]);
        })
        .catch(() => {
          this.$router.push({ name: 'AppMain' });
        })
        .then(() => this.$store.commit('hideLoading'));
    }
  },
};
</script>

<style scoped>
</style>

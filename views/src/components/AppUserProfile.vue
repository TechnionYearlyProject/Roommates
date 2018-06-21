<template>
  <v-layout row warp pt-0>
    <v-flex xs12 sm12 md6 offset-md3 :class="{'my-5': $vuetify.breakpoint.mdAndUp}">
      <v-card>
        <v-card-media :src="image" height="300px">
          <v-layout column class="media">
            <v-card-title primary-title>
              <v-chip class="display-1 primary--text headline ml-3"><v-icon class="mr-1">account_circle</v-icon>{{ title }}</v-chip>
              <v-spacer></v-spacer>
              <div v-if="isMyProfile">
              <v-btn dark icon class="mr-3" @click="uploadDialog = true">
                <v-icon color="info">edit</v-icon>
              </v-btn>
              <v-dialog v-model="uploadDialog" max-width="400">
                <v-card>
                  <v-alert :value="uploadError" type="error">An error occured while trying to upload your photo</v-alert>
                  <v-card-title class="headline">
                    Upload profile picture
                    <v-spacer/>
                    <v-btn icon @click="uploadDialog = false"><v-icon>close</v-icon></v-btn>
                  </v-card-title>
                  <div style="height:220px">
                  <app-uploader v-model="imageToUpload" fileType="image/*" :multipleFiles="false" button-text="Select your photo" single-line/>
                  </div>
                  <v-layout align-end justify-end warp row fill-height>
                      <v-btn @click="uploadImage" color="success" :disabled="uploadloading" :loading="uploadloading">Upload</v-btn>
                  </v-layout>
                </v-card>
              </v-dialog>
              </div>
              <div v-else>
                <v-btn dark icon class="mr-3" @click="$router.push({ name: 'AppChat', query: { startChatWith: profile.id } })">
                  <v-icon>chat</v-icon>
                </v-btn>
              </div>
            </v-card-title>
          </v-layout>
        </v-card-media>
        <v-list subheader two-line>
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
            </v-container>
          </v-list-group>

          <!-- Favorite Apartments -->
          <v-list-group v-model="favorites.active" :prepend-icon="favorites.icon" @click.native="loadFavoriteApartments" lazy>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ favorites.title }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <div v-if="favorites.values.length === 0" class="body-1 pl-3">You have yet to express interest in anything.</div>
            <v-progress-circular v-else-if="!favorites.loaded" indeterminate color="purple"/>
            <template v-else v-for="(favorite, i) in favorites.values">
              <v-list-tile :key="`favorites-${i}`" @click="goToAd(favorite)" avatar>
                <v-list-tile-action>
                  <v-icon color="pink" small>favorite</v-icon>
                </v-list-tile-action>
                <v-list-tile-avatar :size="50">
                  <img :src="favorite.images[0] || defaultApartmentImage" >
                </v-list-tile-avatar>
                <v-layout wrap row>
                  <v-flex xs12 md7>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ favorite.location.address.street.capitalize() }} {{ favorite.location.address.number }}, {{ favorite.location.address.city.capitalize() }} </v-list-tile-title>
                      <v-list-tile-sub-title>&#x24;{{ favorite.price }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-flex>
                  <v-flex hidden-sm-and-down md5>
                    <v-list-tile-content>
                      <v-layout wrap row>
                        <v-flex xs12>
                            <span class="body-2 pr-1">Entrance Date:</span>
                            <span class="body-1">{{ new Date(favorite.entranceDate).toLocaleDateString() }}</span>
                        </v-flex>
                        <v-flex xs12>
                            <span class="body-2 pr-4">Interests:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span class="body-1">{{ favorite._interested.length }}</span>
                        </v-flex>
                        <v-flex xs12>
                            <span class="body-2 pr-4">Comments:</span>
                            <span class="body-1">{{ favorite.comments.length }}</span>
                        </v-flex>
                      </v-layout>
                    </v-list-tile-content>
                  </v-flex>
                </v-layout>
              </v-list-tile>
              <v-divider v-if="i < favorites.values.length -1" inset :key="`divider-${i}`"/>
            </template>
          </v-list-group>

          <!-- Published Apartments -->
          <v-list-group v-model="publishes.active" :prepend-icon="publishes.icon" @click.native="loadPublishedApartments" lazy>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ publishes.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <div v-if="publishes.values.length === 0" class="body-1 pl-3">You have yet to publish anything.</div>
            <v-progress-circular v-else-if="!publishes.loaded" indeterminate color="purple"/>
            <template v-else v-for="(publish, i) in publishes.values">
              <v-list-tile :key="`publishes-${i}`" @click="goToAd(publish)">
                <v-list-tile-action>
                  <v-icon color="green" small>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-avatar :size="50">
                  <img :src="publish.images[0] || defaultApartmentImage" >
                </v-list-tile-avatar>
                <v-layout wrap row>
                  <v-flex xs12 md7>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ publish.location.address.street.capitalize() }} {{ publish.location.address.number }}, {{ publish.location.address.city.capitalize() }} </v-list-tile-title>
                      <v-list-tile-sub-title>&#x24;{{ publish.price }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-flex>
                  <v-flex hidden-sm-and-down md5>
                    <v-list-tile-content>
                      <v-layout wrap row>
                        <v-flex xs12>
                            <span class="body-2 pr-1">Publish Date:</span>
                            <span class="body-1">{{ new Date(publish.createdAt).toLocaleDateString() }}</span>
                        </v-flex>
                        <v-flex xs12>
                            <span class="body-2 pr-4">Interests:&nbsp;</span>
                            <span class="body-1">{{ publish._interested.length }}</span>
                        </v-flex>
                        <v-flex xs12>
                            <span class="body-2 pr-3">Comments:</span>
                            <span class="body-1">{{ publish.comments.length }}</span>
                        </v-flex>
                      </v-layout>
                    </v-list-tile-content>
                  </v-flex>
                </v-layout>
              </v-list-tile>
              <v-divider v-if="i < publishes.values.length -1" inset :key="`divider-${i}`"/>
            </template>
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
import defaultApartment from '../assets/apartment-default.jpg';
import attrList from '../assets/attributes';
import AppUploader from './sub-components/AppUploader';

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
        id: null
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
        loaded: false,
        values: [],
      },
      publishes: {
        active: false,
        icon: 'home',
        title: 'Publishes',
        loaded: false,
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
      defaultApartmentImage: defaultApartment,
      imageToUpload: [],
      uploadDialog: false,
      uploadloading: false,
      uploadError: false
    };
  },
  methods: {
    uploadImage() {
      this.uploadError = false;
      if (this.imageToUpload.length === 0) {
        this.uploadDialog = false;
        return;
      }
      this.uploadloading = true;
      this.$store
        .dispatch('updateUser', { image: this.imageToUpload[0] })
        .then((user) => {
          this.image = user.image;
          this.uploadDialog = false;
        })
        .catch(() => {
          this.uploadError = true;
        })
        .then(() => {
          this.uploadloading = false;
          this.imageToUpload = [];
        });
    },
    loadPublishedApartments() {
      if (this.publishes.values.length === 0) {
        this.publishes.loaded = true;
      } else if (!this.publishes.loaded) {
        this.$store.dispatch('fetchApartments', { id: this.publishes.values })
          .then((apartments) => {
            this.publishes.values = apartments;
            this.publishes.loaded = true;
          });
      }
    },
    loadFavoriteApartments() {
      if (this.favorites.values.length === 0) {
        this.favorites.loaded = true;
      } else if (!this.favorites.loaded) {
        this.$store.dispatch('searchApartments', { id: this.favorites.values })
          .then((apartments) => {
            this.favorites.values = apartments;
            this.favorites.loaded = true;
          });
      }
    },
    goToAd(apartment) {
      this.$store.commit('setApartments', [apartment]);
      this.$router.push({ name: 'AppMain' });
    },
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
        .catch((error) => {
          property.value.current = property.value.previous;
          property.error = `Invalid information. Please make sure you fill in a correct ${property.title.toLowerCase()}.`;
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
          current: `${user.firstName} ${` ${user.lastName || ''}`}`,
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
          current: new Date(user.birthdate).toLocaleDateString(),
          previous: new Date(user.birthdate).toLocaleDateString(),
        },
        icon: 'event',
        error: [],
        isEditable: this.isMyProfile,
        edit: {
          active: false,
          kind: 'text',
        },
        getPayload() {
          const date = this.value.current.split('.');
          const birthdate = new Date(`${date[2]}-${date[1]}-${date[0]}`).getTime();
          return {
            birthdate
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
        title: 'Phone Number',
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
      this.profile.id = user['_id'];
    } else {
      this.$store.commit('showLoading');
      this.$store
        .dispatch('fetchUser', { id })
        .then((users) => {
          this.isMyProfile = this.isAuthenticated && this.getUser._id === id;
          this.initProfile(users[id]);
          this.profile.id = id;
        })
        .catch(() => {
          this.$router.push({ name: 'AppMain' });
        })
        .then(() => this.$store.commit('hideLoading'));
    }
  },
  components: {
    AppUploader
  }
};
</script>

<style scoped>
</style>

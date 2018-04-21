<template>
    <v-card>
        <v-card-media :src="image" height="200px">
            <v-container fill-height fluid>
                <v-layout fill-height>
                    <v-btn icon @click.native="previousImage" color="white" :disabled="apartment.images.length <= 1">
                        <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="nextImage" color="white" :disabled="apartment.images.length <= 1">
                        <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                </v-layout>
            </v-container>
        </v-card-media>
            <app-map v-model="showMap" :center="{ longitude: apartment.location.geolocation[0] , latitude: apartment.location.geolocation[1] }"></app-map>

        <v-card-actions class="pt-4">
            
            <v-flex>
                <span class="caption">
                    <span class="body-2">published:</span>
                    <span class="body-1">{{ new Date(apartment.createdAt).toDateString() }}</span>
                    </span>
            </v-flex>
            <v-spacer></v-spacer>
            <v-tooltip top slot="activator">
                <v-btn icon slot="activator" :class="fav ? 'red--text' : ''" @click.native="favorite">
                    <v-icon>favorite</v-icon>
                </v-btn>
                <span>{{ interestedMessage }}</span>
            </v-tooltip>
            <v-menu offset-x :close-on-content-click="false" :nudge-width="245" lazy>
                <v-tooltip top slot="activator">
                    <v-btn icon slot="activator" @click.native="getPublisher">
                        <v-icon>account_box</v-icon>
                    </v-btn>
                    <span>Publisher profile</span>
                </v-tooltip>
                <v-card>
                    <v-list>
                        <v-list-tile avatar>
                            <v-list-tile-avatar>
                                <app-avatar img="" name="publisherName" :size="40"></app-avatar>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>publisher name</v-list-tile-title>
                                <v-list-tile-sub-title>rating</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-tile>
                            <v-icon class="pr-1">email</v-icon>
                            <v-list-tile-title>
                                <small>E-mail</small>
                            </v-list-tile-title>
                            <v-list-tile-title>8742458</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-icon class="pr-1">phone</v-icon>
                            <v-list-tile-title>
                                <small>Phone</small>
                            </v-list-tile-title>
                            <v-list-tile-title>+972-8711111</v-list-tile-title>
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
                </v-card>
            </v-menu>

            <v-tooltip top>
                <v-btn icon slot="activator">
                    <v-icon>share</v-icon>
                </v-btn>
                <span>Share</span>
            </v-tooltip>
        </v-card-actions>
        <v-card-actions class="subheading">
                    <v-btn icon @click.native="openMap" class="pink--text">
                    <v-icon class="pb-2">place</v-icon>
                    </v-btn>
                    {{ apartment.location.address.street.capitalize()}} {{ apartment.location.address.number}}, {{ apartment.location.address.city.capitalize()}}
                        <v-spacer></v-spacer>
                ${{ apartment.price }}
           
            <v-spacer></v-spacer>
            <v-btn icon @click.native="show = !show">
                <v-icon>{{ apartment.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            </v-btn>

        </v-card-actions>

        <v-slide-y-transition>
            <v-card-text v-show="show" class="pt-0">
                <v-divider class="mb-3"></v-divider>


                <strong>Entrance date:</strong> {{ new Date(apartment.entranceDate).toDateString() }}
                <v-card class="mt-3">
                    <v-card-title>
                        <h4>Attributes</h4>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list dense>
                        <v-list-tile v-for="(attribute,i) in attributes" :key="`attribute-${i}`">
                            <v-list-tile-content>{{ attribute.label }}</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ apartment[attribute.ref] || '-' }}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                </v-card>
                <v-layout row wrap py-3>
                    <v-flex xs3 v-for="(tag,i) in apartment.tags" :key="`tag-${i}`" mx-auto>
                        <div class="text-xs-center">
                            <v-icon>{{ tags[tag].vicon }}</v-icon><br>
                            <small>{{ tags[tag].name }}</small>
                        </div>

                    </v-flex>
                </v-layout>

                <v-card v-if="apartment.description">
                    <v-card-title>
                        <h4>About</h4>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <i>{{ apartment.description }}</i>

                    </v-card-text>
                </v-card>
                <v-breadcrumbs divider="/">
                    <v-breadcrumbs-item :disabled="false" v-show="true" to="#">
                        {{ apartment._interested.length }} interested
                    </v-breadcrumbs-item>
                    <v-breadcrumbs-item :disabled="false" v-show="true" to="#">
                        {{ apartment.comments.length }} comments
                    </v-breadcrumbs-item>
                    <v-breadcrumbs-item :disabled="true" v-show="true" to="#">
                        reviews
                    </v-breadcrumbs-item>
                </v-breadcrumbs>
            </v-card-text>
        </v-slide-y-transition>

    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import defaultApartmentImage from '../assets/apartment-defalut.jpg';
    import tagsList from '../assets/tags';
    import AppAvatar from './AppAvatar';
    import AppMap from './AppMap';


    export default {
      props: ['apartment'],
      data() {
        return {
          attributes: [
            {
              label: 'required roommates',
              ref: 'requiredRoommates'
            },
            {
              label: 'total roommates',
              ref: 'totalRoommates' // change model from currentlyNumberOfRoommates -> totalRoommates
            },
            {
              label: 'floor',
              ref: 'floor'
            },
            {
              label: 'total floors',
              ref: 'totalFloors'
            },
            {
              label: 'rooms number',
              ref: 'numberOfRooms'
            },
            {
              label: 'area (square meter)',
              ref: 'area'
            }
          ],
          show: false,
          fav: false,
          showMap: false,
          tags: tagsList,
          defaultImage: defaultApartmentImage,
          imageNumber: 0,
          interestedMessage: "I'm interested!",
          e1: 'recent'
        };
      },
      methods: {
        favorite() {
          if (!this.isAuthenticated) {
            this.interestedMessage = 'Please login first';
          } else if (!this.isVerified) {
            this.interestedMessage = 'Please verify account';
          } else {
            this.fav = !this.fav;
            this.$store
              .dispatch('favor', { id: this.apartment._id })
              .catch((error) => {
                // eslint-disable-next-line 
                console.log(error);
                this.fav = !this.fav;
              });
          }
        },
        getPublisher() {
            // eslint-disable-next-line 
          console.log('fetch publisher');
        },
        nextImage() {
          this.imageNumber =
            this.imageNumber >= this.apartment.images.length - 1
              ? 0
              : this.imageNumber + 1;
        },
        previousImage() {
          this.imageNumber =
            this.imageNumber <= 0
              ? this.apartment.images.length - 1
              : this.imageNumber - 1;
        },
        openMap() {
            this.showMap = true;
        }
      },
      computed: {
        ...mapGetters(['isAuthenticated', 'isVerified']),
        image() {
          return this.apartment.images[0]
            ? this.apartment.images[this.imageNumber]
            : this.defaultImage;
        }
      },
      components: {
        AppAvatar,
        AppMap
      },
      created() {
        if (this.isAuthenticated) {
          this.fav = this.apartment._interested.includes(
            this.$store.getters.getUser._id
          );
        }
      },
    };
</script>

<style scoped>

</style>

<template>
<div>
  <v-card>
    <v-toolbar dense card height="40" color="grey lighten-3">
      <!-- <v-spacer/> -->
        <v-tooltip top class="mx-0">
          <span>Visit page</span>
          <v-btn icon slot="activator" @click="visitPage">
            <v-icon color="primary">mdi-door-open</v-icon>
          </v-btn>
        </v-tooltip>
      </v-toolbar>
    <app-image-dialog v-model="imageDialog" :images="apartment.images"/>
    <v-card-media contain height="200px" @click.native="imageDialog = (apartment.images.length > 0)" class="grey lighten-5" :style="{cursor: apartment.images.length > 0 ? 'pointer' : 'auto'}">
      <app-image-gallery v-model="apartment.images"/>
      <!-- <v-slide-x-transition>
        <div :key="image" class="card__media__background" :style="{background: `url(${image}) center center / contain no-repeat`}"></div>
      </v-slide-x-transition>
      <v-container fill-height fluid>
        <v-layout fill-height>
          <v-btn v-if="apartment.images.length > 0" :disabled="apartment.images.length === 1" icon @click.native="previousImage">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="apartment.images.length > 0" :disabled="apartment.images.length === 1" icon @click.native="nextImage">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-layout>
      </v-container> -->
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
        <v-card style="min-height:60px">
          <div v-if="fetchedPublisher">
          <v-list>
            <v-list-tile avatar  @click="$router.push({ name: 'AppUserProfile', params: { id: publisher._id } })">
              <v-list-tile-avatar>
                <app-avatar :image="publisher.image" :name="publisher.firstName" :size="40"></app-avatar>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ publisher.firstName.capitalize() }} {{ publisher.lastName.capitalize() }}</v-list-tile-title>
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
                {{ publisher.email }}
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-icon class="pr-1">phone</v-icon>
              <v-list-tile-title>
                <small class="pr-3">Phone</small>
                {{ publisher.mobilePhone || 'No Phone' }}
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
          <div v-else class="text-xs-center mt-3">
            <v-progress-circular indeterminate color="purple"></v-progress-circular>
          </div>
        </v-card>
      </v-menu>
      <v-menu offset-y :nudge-bottom="15" bottom :close-on-content-click="false" max-width="340" lazy>
        <v-tooltip top slot="activator">
          <v-btn icon slot="activator">
            <v-icon>share</v-icon>
          </v-btn>
          <span>Share</span>
        </v-tooltip>
        <v-card>
          <v-container grid-list-sm pa-2>
            <v-layout wrap row>
              <v-flex xs10>
                <v-text-field ref="apartmentLink" v-model="share.url" hide-details readonly class="pl-2" />
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <v-tooltip top slot="activator" :color="clipboard.color" :close-delay="clipboard.closeDelay">
                  <v-btn color="success" slot="activator" class="mt-2" style="min-width: 0;width:40px" @click="copyToClipboard">
                    <v-icon color="white-text">content_copy</v-icon>
                  </v-btn>
                  <div class="text-xs-center">{{ clipboard.text }}</div>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 py-2>
                <v-divider/>
              </v-flex>
              <v-flex>
                <app-social-sharing :id="apartment._id" :price="apartment.price" :address="getAddress()"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-menu>
    </v-card-actions>
    <v-card-actions class="subheading">
      <v-btn icon @click.native="openMap" class="pink--text mb-1">
        <v-icon>place</v-icon>
      </v-btn>
      {{ getAddress() }}
      <v-spacer></v-spacer>
      ${{ apartment.price }}

      <v-spacer></v-spacer>
      <v-btn icon @click.native="expandDetails">
        <v-icon>{{ expended ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>

    </v-card-actions>

    <v-slide-y-transition mode="out-in">

      <v-card-text ref="details" v-show="expended" class="pt-0">
        <v-divider class="mb-3"></v-divider>
        <transition name="slide-x-transition" mode="out-in" v-if="show">
          <div v-if="show === 'apartmentDetails'" ref='cardDetails' key="apartmentDetails">
            <strong>Entrance date:</strong> {{ new Date(apartment.entranceDate).toDateString() }}
            <app-attribute-list v-model="attributes"/>
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
          </div>

          <div v-else-if="show === 'comments'" :style="{'height': detailsHeight}" key="comments">
            <app-comments :comments="apartment.comments" :onComment="addComment"></app-comments>
          </div>

          <div v-else-if="show === 'favors'" :style="{'height': detailsHeight}" key="favors">
            <app-favors :favors="apartment._interested"></app-favors>
          </div>
        </transition>
        <v-divider/>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item v-if="show !== 'apartmentDetails'" @click.native="showApartmentDetails">
            &larr; Go back
          </v-breadcrumbs-item>
          <v-breadcrumbs-item v-if="show !== 'favors'" :disabled="false" v-show="true" @click.native="showFavores">
            {{ apartment._interested.length }} interested
          </v-breadcrumbs-item>
          <v-breadcrumbs-item v-if="show !== 'comments'" @click.native="showComments">
            {{ apartment.comments.length }} comments
          </v-breadcrumbs-item>
          <v-breadcrumbs-item :disabled="false" v-show="true" to="#">
            reviews
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import defaultApartmentImage from '../assets/apartment-default.jpg';
  import tagsList from '../assets/tags';
  import AppAvatar from './sub-components/AppAvatar';
  import AppMap from './sub-components/AppMap';
  import AppComments from './sub-components/AppComments';
  import AppFavors from './sub-components/AppFavors';
  import AppImageDialog from './sub-components/AppImageDialog';
  import AppSocialSharing from './AppSocialSharing';
  import AppImageGallery from './Galleries/AppImageGallery';
  import AppAttributeList from './Lists/AppAttributeList';

  export default {
    props: ['apartment'],
    data() {
      return {
        share: {
          url: null,
          title: null,
          description: null,
          quote: null,
          networks: [
            {
              name: 'email',
              icon: 'mdi-email',
              color: 'lime darken-4'
            },
            {
              name: 'facebook',
              icon: 'mdi-facebook-box',
              color: 'blue darken-3'
            },
            {
              name: 'googleplus',
              icon: 'mdi-google-plus-box',
              color: 'red darken-1'
            },
            {
              name: 'twitter',
              icon: 'mdi-twitter-box',
              color: 'light-blue'
            },
            {
              name: 'whatsapp',
              icon: 'mdi-whatsapp',
              color: 'teal darken-1'
            }
          ]
        },
        expended: false,
        show: 'apartmentDetails',
        fav: false,
        showMap: false,
        tags: tagsList,
        defaultImage: defaultApartmentImage,
        imageNumber: 0,
        imageDialog: false,
        interestedMessage: "I'm interested!",
        clipboard: {
          color: undefined,
          text: 'Copy link',
          closeDelay: 200,
          lastCopyTime: 0
        },
        e1: 'recent',
        fetchedPublisher: false,
        publisher: null
      };
    },
    methods: {
      getAddress() {
        return `${this.apartment.location.address.street.capitalize()} ${
          this.apartment.location.address.number
        }, ${this.apartment.location.address.city.capitalize()}`;
      },
      favorite() {
        if (!this.isAuthenticated) {
          this.interestedMessage = 'Please login first';
        } else if (!this.isVerified) {
          this.interestedMessage = 'Please verify account';
        } else {
          this.fav = !this.fav;
          this.$store
            .dispatch('favor', { id: this.apartment._id })
            .then((apartment) => {
              this.apartment._interested = apartment._interested;
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
              this.fav = !this.fav;
            });
        }
      },
      getPublisher() {
        if (!this.fetchedPublisher) {
          const id = this.apartment._createdBy;
          this.$store.dispatch('fetchUser', { id }).then((users) => {
            if (users[id]) {
              this.publisher = users[id];
            } else {
              this.publisher = {
                firstName: 'Some',
                lastName: 'User',
                email: 'user@example.com',
                mobilePhone: '+972-8711111'
              };
            }
            this.fetchedPublisher = true;
          });
        }
      },

      openMap() {
        this.showMap = true;
      },
      expandDetails() {
        if (this.expended) {
          this.expended = false;
        } else {
          this.expended = true;
        }
      },
      showApartmentDetails() {
        this.show = 'apartmentDetails';
        this.goToTopOfAdd();
      },
      showFavores() {
        this.show = 'favors';
        this.goToTopOfAdd();
      },
      showComments() {
        this.show = 'comments';
        this.goToTopOfAdd();
      },
      addComment(comment) {
        return this.$store.dispatch('addApartmentComment', {
          params: {
            id: this.apartment._id
          },
          payload: {
            text: comment.text
          }
        });
      },
      goToTopOfAdd() {
        this.$vuetify.goTo(this.$refs.details, {
          duration: 1100,
          offset: -200,
          easing: 'easeInOutCubic'
        });
      },
      copyToClipboard() {
        this.$refs.apartmentLink.$refs.input.select();
        document.execCommand('copy');
        this.clipboard.text = 'Copied!';
        this.clipboard.color = 'success';
        this.clipboard.closeDelay = 3000;
        const lastCopyTime = Date.now();
        this.clipboard.lastCopyTime = lastCopyTime;
        setInterval(() => {
          if (lastCopyTime === this.clipboard.lastCopyTime) {
            this.clipboard.text = 'Copy link';
            this.clipboard.color = undefined;
            this.clipboard.closeDelay = 200;
          }
        }, 5000);
      },
      visitPage() {
        this.$router.push({name: 'AppApartmentPage', params: {
          id: this.apartment._id,
          apartment: this.apartment, 
          publisher: this.publisher
        }});
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'isVerified']),
      image() {
        return this.apartment.images[0]
          ? this.apartment.images[this.imageNumber]
          : this.defaultImage;
      },
      detailsHeight() {
        return `${this.$refs.cardDetails.clientHeight}px`;
      },
      attributes() {
        return [
          {
            title: 'required roommates',
            value: this.apartment.requiredRoommates
          },
          {
            title: 'total roommates',
            value: this.apartment.totalRoommates // change model from currentlyNumberOfRoommates -> totalRoommates
          },
          {
            title: 'floor',
            value: this.apartment.floor
          },
          {
            title: 'total floors',
            value: this.apartment.totalFloors
          },
          {
            title: 'rooms number',
            value: this.apartment.numberOfRooms
          },
          {
            title: 'area (square meter)',
            value: this.apartment.area
          }
        ]
      }
    },
    mounted() {
      if (this.isAuthenticated) {
        this.fav = this.apartment._interested.includes(
          this.$store.getters.getUser._id
        );
      }
      this.share.url = `https://localhost:8080/${this.apartment._id}`;
      this.share.title = 'Sharing this apartment I found on Roommates with you';
      this.share.description = `Located in ${this.getAddress()}, price: ${
        this.apartment.price
      }`;
      this.share.quote =
        'This is an apartment that I thought might interest you.';
    },
    components: {
      AppAvatar,
      AppMap,
      AppComments,
      AppFavors,
      AppImageDialog,
      AppSocialSharing,
      AppImageGallery,
      AppAttributeList
    }
  };
</script>

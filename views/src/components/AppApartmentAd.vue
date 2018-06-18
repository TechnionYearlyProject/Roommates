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


    <v-card-actions class="pt-4">

      <v-flex>
        <span class="caption">
          <span class="body-2">published:</span>
          <span class="body-1">{{ new Date(apartment.createdAt).toDateString() }}</span>
        </span>
      </v-flex>
      <v-spacer></v-spacer>
      <app-favorite-icon v-model="apartment._interested" :apartment-id="apartment._id"/>
      <v-menu offset-x :close-on-content-click="false" :nudge-width="245" lazy>
        <v-tooltip top slot="activator">
          <v-btn icon slot="activator" @click.native="getPublisher">
            <v-icon>account_box</v-icon>
          </v-btn>
          <span>Publisher profile</span>
        </v-tooltip>
        <div v-if="fetchedPublisher">
          <app-publisher-details v-model="publisher"/>
        </div>
        <div v-else class="text-xs-center mt-3">
          <v-card>
            <v-progress-circular indeterminate color="purple"></v-progress-circular>
          </v-card>
        </div>
      </v-menu>
      <app-share-icon top :url="share.url" :title="share.title" :description="share.description" :quote="share.quote"
        email
        facebook
        googleplus
        twitter
        whatsapp/>
    </v-card-actions>
    <v-card-actions class="subheading">
      <app-map-icon :location="location" class="pb-3"/>
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
            <app-tag-list v-model="apartment.tags"/>

            

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
            <app-favor-list :favors="apartment._interested"></app-favor-list>
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
import AppAvatar from './sub-components/AppAvatar';
import AppComments from './Comments/AppComments';
import AppImageDialog from './sub-components/AppImageDialog';
import AppShareIcon from './Icons/AppShareIcon';
import AppImageGallery from './Galleries/AppImageGallery';
import AppAttributeList from './Lists/AppAttributeList';
import AppTagList from './Lists/AppTagList';
import AppMapIcon from './Icons/AppMapIcon';
import AppPublisherDetails from './Lists/AppPublisherDetails';
import AppFavorList from './Lists/AppFavorList';
import AppFavoriteIcon from './Icons/AppFavoriteIcon';

export default {
  props: ['apartment'],
  data() {
    return {
      share: null,
      expended: false,
      show: 'apartmentDetails',
      showMap: false,
      imageNumber: 0,
      imageDialog: false,
      e1: 'recent',
      fetchedPublisher: false,
      publisher: null
    };
  },
  methods: {
    getAddress() {
      return `${this.apartment.location.address.street.capitalize()} ${this.apartment.location.address.number}, ${this.apartment.location.address.city.capitalize()}`;
    },
    getPublisher() {
      if (!this.fetchedPublisher) {
        const id = this.apartment._createdBy;
        this.$store.dispatch('fetchUser', { id })
        .then((users) => {
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
    visitPage() {
      this.$router.push({
        name: 'AppApartmentPage',
        params: {
          id: this.apartment._id,
          apartment: this.apartment,
          publisher: this.publisher
        }
      });
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isVerified']),
    image() {
      return this.apartment.images[0] ? this.apartment.images[this.imageNumber] : this.defaultImage;
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
          value: this.apartment.totalRoommates
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
      ];
    },
    location() {
      return {
        longitude: this.apartment.location.geolocation[0],
        latitude: this.apartment.location.geolocation[1]
      };
    }
  },
  created() {
    this.share = {
      url: `https://localhost:8080/${this.apartment._id}`,
      title: 'Sharing this apartment I found on Roommates with you!',
      description: `Located in ${this.getAddress()}, price: ${this.apartment.price}`,
      quote: 'This is an apartment that I thought might interest you.'
    };
  },
  components: {
    AppAvatar,
    AppComments,
    AppFavorList,
    AppImageDialog,
    AppShareIcon,
    AppImageGallery,
    AppAttributeList,
    AppTagList,
    AppMapIcon,
    AppPublisherDetails,
    AppFavoriteIcon
  }
};
</script>

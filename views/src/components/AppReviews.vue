/**
 * @Modified by: Or Abramovich
 * @date: 06/18
 * Convert from static page to dynamic page i.e communicates and fetches data from the back-end
 */
<template>
    <div>
        <v-container>
            <AppReviewAddDialog v-show="dialog" @close="dialog=false;"></AppReviewAddDialog>
            <AppReviewSearchDialog v-show="search_review" @close="search_review=false;"></AppReviewSearchDialog>
            <div style="position: relative; height: 500px">
                <gmap-map :center="position" :zoom="15" map-type-id="roadmap" :style="{ width: '100%', height: '500px', position: 'absolute', bottom: 0 }">
                    <GmapMarker :position="position" />
                </gmap-map>
                <h1 class="address">
                    {{ curReviewAddress }}
                </h1>
            </div>
            <v-layout column class="fab-container">
              <v-btn small fab color="pink accent-1" dark  @click.native.stop="dialog = !dialog" v-if="isVerified">
              	<v-icon>add</v-icon>
            	</v-btn>
              <v-btn small fab color="pink accent-1" dark  @click.native.stop="search_review = !search_review">
                <v-icon>search</v-icon>
              </v-btn>
              <v-btn small fab color="pink accent-1" dark @click="$vuetify.goTo(0, scrollOptions)">
                <v-icon>keyboard_arrow_up</v-icon>
              </v-btn>
            </v-layout>
        </v-container>

        <v-container>
            <v-card>
                <v-card-title primary-title>
                    <h2>
                        Total Rating:
                        <span class="rating" :style="{ width: totalStatistics.generalRating * 28 + 'px' }">
                            <v-icon v-for="i in 5" :key="i" medium color="orange" class="star">star</v-icon>
                        </span>
                        <sub style="margin-left: 25px; vertical-align: super">(according to {{ reviews.length }} reviewers)</sub>
                    </h2>
                </v-card-title>
                <v-card-text>
                    <v-layout wrap row>
                        <v-flex style="text-align: center"tify >
                            Parking:
                            <span class="rating" :style="{ width: totalStatistics.parking * 24 + 'px' }">
                                <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                            </span>
                        </v-flex>
                        <v-flex style="text-align: center">
                            Public Transportation:
                            <span class="rating" :style="{ width: totalStatistics.publicTransport * 24 + 'px' }">
                                <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                            </span>
                        </v-flex>
                        <v-flex style="text-align: center">
                            Noise:
                            <span class="rating" :style="{ width: totalStatistics.noise * 24 + 'px' }">
                                <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                            </span>
                        </v-flex>
                        <v-flex style="text-align: center">
                            Commercial Service:
                            <span class="rating" :style="{ width: totalStatistics.commercialServices * 24 + 'px' }">
                                <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                            </span>
                        </v-flex>
                        <v-flex style="text-align: center">
                            Upkeep:
                            <span class="rating" :style="{ width: totalStatistics.upkeep * 24 + 'px' }">
                                <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                            </span>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container grid-list-lg>
            <v-layout wrap row>
                <v-flex xs12 sm6 md6 lg4 v-for="(review ,i) in reviews" :key="`review-${i}`">
                    <app-review-tile :review="review" :user="getPublisher(review)"></app-review-tile>
                </v-flex>
            </v-layout>
        </v-container>

    </div>

</template>

<script>
  import AppAvatar from './sub-components/AppAvatar';
  import AppReviewTile from './sub-components/AppReviewTile';
  import AppReviewAddDialog from './sub-components/AppReviewAddDialog';
  import AppReviewSearchDialog from './sub-components/AppReviewSearchDialog';
  import StarRating from 'vue-star-rating'
  import { mapGetters } from 'vuex';

  export default {
    name: 'AppReviews',
    data() {
      return {
       dialog: false,
       search_review: false,
        position: {
          lat: 32.776515,
          lng: 35.020568
        },
        defaultReviewStreet: 'Sderot David Rose',
        defaultReviewCity: 'haifa',
        curReviewAddress: '',
     	  reviews: [],
     	  locationData: [],
        usersList: []
      };
    },
    methods: {
	    loadReviews(long, lat, city, street){
	    	 this.$store.dispatch('getReviews', { long: long, lat: lat }).then((reviews) => {
          const id = reviews.map(review => review._createdBy);
          reviews.forEach(review => {
            review.ratedCharacteristics.generalRating = this.getReviewGeneralRating(review);
          });
          this.$store.dispatch('fetchUser', { id }).then((users) => {
            this.usersList = users;
            this.reviews = reviews;
            this.curReviewAddress = street.toUpperCase() + ", " + city.toUpperCase();
          });
	    	 });
	    },
      getReviewGeneralRating(review){
        return (review.ratedCharacteristics.parking + review.ratedCharacteristics.publicTransport + review.ratedCharacteristics.noise + review.ratedCharacteristics.commercialServices +review.ratedCharacteristics.upkeep)/5;
      },
      getPublisher(review) {
       return this.usersList[review._createdBy];
      },
	    setAddress(data) {
       		this.locationData = data;
          this.position.lat = data.latitude;
          this.position.lng = data.longitude; 
       		this.loadReviews(this.locationData.longitude, this.locationData.latitude, this.locationData.locality, this.locationData.route);
      },
    },
	beforeMount() {
    if(this.$route.query.lat !== undefined)
      this.position.lat = parseFloat(this.$route.query.lat);
    if(this.$route.query.lng !== undefined)
      this.position.lng = parseFloat(this.$route.query.lng);
    var street = this.defaultReviewStreet;
    var city = this.defaultReviewCity;
    if(this.$route.query.city !== undefined)
      city = this.$route.query.city;
    if(this.$route.query.street !== undefined)
      street = this.$route.query.street;
		this.loadReviews(this.position.lng, this.position.lat, city, street);
	},
	mounted() {
  },
    computed: {
      ...mapGetters(['isVerified', 'getUser']),
      totalStatistics() {
        var reviewsLength = Math.max(this.reviews.length, 1);
        return {
          parking:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.parking, 0) /
                reviewsLength,
          publicTransport:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.publicTransport, 0) /
                reviewsLength,
          noise:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.noise, 0) /
                reviewsLength,
          commercialServices:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.commercialServices, 0) /
                reviewsLength,
          upkeep:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.upkeep, 0) /
                reviewsLength,
          generalRating:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.generalRating, 0) /
                reviewsLength
        };
      }
    },
    components: {
      AppReviewTile,
      AppAvatar,
      StarRating,
      AppReviewAddDialog,
      AppReviewSearchDialog
    }
  };
</script>

<style scoped>
    .address {
        position: absolute;
        bottom: 0;
        background-color: #3f51b5;
        color: #fff;
        padding: 10px 30px;
        font-size: 26px;
        font-weight: normal;
        box-shadow: #999 1px -1px 5px 0;
    }

    .rating {
        padding: 2px 0 0;
        overflow: hidden;
        display: inline-block;
        white-space: nowrap;
        vertical-align: sub;
    }

  .fab-container {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index:99;
  }
</style>
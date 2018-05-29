<template>
    <div>
        <v-container>
            <div style="position: relative; height: 500px">
                <gmap-map :center="position" :zoom="15" map-type-id="roadmap" :style="{ width: '100%', height: '500px', position: 'absolute', bottom: 0 }">
                    <GmapMarker :position="position" />
                </gmap-map>
                <h1 class="address">
                    {{ address }}
                </h1>
            </div>
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
                    <app-review-tile :review="review"></app-review-tile>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import AppAvatar from './sub-components/AppAvatar';
  import AppReviewTile from './sub-components/AppReviewTile';

  export default {
    name: 'AppReviews',
    data() {
      return {
        position: {
          lat: 32.7825085,
          lng: 35.0157237
        },
        address: 'Menahem Begin 40, Holon',
        reviews: [
          {
            createdBy: 'Idan Yadgar',
            createdAt: new Date(2018, 4, 28).getTime(),
            ratedCharacteristics: {
              parking: 1,
              publicTransport: 2,
              noise: 3,
              commercialServices: 4,
              upkeep: 5,
              generalRating: 5,
            },
            pros: 'Pros Pros Pros Pros Pros Pros',
            cons: 'Cons Cons Cons Cons Cons Cons '
          },
          {
            createdBy: 'Idan Yadgar',
            createdAt: new Date(2018, 4, 28).getTime(),
            ratedCharacteristics: {
              parking: 1,
              publicTransport: 2,
              noise: 3,
              commercialServices: 4,
              upkeep: 5,
              generalRating: 5,
            },
            pros: 'Pros Pros Pros Pros Pros Pros',
            cons: 'Cons Cons Cons Cons Cons Cons '
          },
          {
            createdBy: 'Idan Yadgar',
            createdAt: new Date(2018, 4, 28).getTime(),
            ratedCharacteristics: {
              parking: 1,
              publicTransport: 2,
              noise: 3,
              commercialServices: 4,
              upkeep: 5,
              generalRating: 5,
            },
            pros: 'Pros Pros Pros Pros Pros Pros',
            cons: 'Cons Cons Cons Cons Cons Cons '
          }
        ]
      };
    },
    computed: {
      totalStatistics() {
        return {
          parking:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.parking, 0) /
                this.reviews.length,
          publicTransport:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.publicTransport, 0) /
                this.reviews.length,
          noise:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.noise, 0) /
                this.reviews.length,
          commercialServices:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.commercialServices, 0) /
                this.reviews.length,
          upkeep:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.upkeep, 0) /
                this.reviews.length,
          generalRating:
                this.reviews.reduce((t, c) => t + c.ratedCharacteristics.generalRating, 0) /
                this.reviews.length
        };
      }
    },
    components: {
      AppReviewTile,
      AppAvatar
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
</style>
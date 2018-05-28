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
                    <v-layout>
                        <v-flex style="text-align: center">
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
    </div>
</template>

<script>
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
            ratedCharacteristics: {
              parking: 1,
              publicTransport: 2,
              noise: 3,
              commercialServices: 4,
              upkeep: 5,
              generalRating: 5,
            },
            pros: '',
            cons: ''
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

    }
  };
</script>

<style scoped>
    .address {
        position: absolute;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        width: 100%;
        padding: 15px;
        font-size: 32px;
        font-weight: normal;
    }

    .rating {
        padding: 2px 0 0;
        overflow: hidden;
        display: inline-block;
        white-space: nowrap;
        vertical-align: sub;
    }
</style>
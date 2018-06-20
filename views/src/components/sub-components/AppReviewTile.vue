<template>
    <v-card>
        <v-card-title>
            <v-flex>
                <v-list-tile-avatar style="display: inline">
                    <app-avatar :img="user.image" :name="user.firstName" :size="40"></app-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content style="display: inline">
                    {{ user.firstName }} {{user.lastName}}
                </v-list-tile-content>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex style="text-align: right">{{ new Date(review.createdAt).toDateString() }}</v-flex>
        </v-card-title>
        <v-card-text>
            <v-btn flat block @click.native="expanded = !expanded" style="margin: 0; padding: 0;">
                <v-layout>
                    <v-flex xs12 style="font-size: 16px; padding-top: 13px; text-align: left">
                        Total Rating:
                    </v-flex>
                    <v-flex>
                    <span class="rating" :style="{ width: review.ratedCharacteristics.generalRating * 24 + 'px' }">
                        <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                    </span>
                    </v-flex>
                    <v-flex style="padding-top: 10px;">
                        <v-icon>{{ expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                    </v-flex>
                </v-layout>
            </v-btn>
            <v-slide-y-transition mode="out-in">
                <div v-show="expanded">
                    <v-list dense style="margin-left: 20px">
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-layout>
                                    <v-flex xs12 style="padding-top: 12px">
                                        Parking:
                                    </v-flex>
                                    <v-flex>
                                    <span class="rating" :style="{ width: review.ratedCharacteristics.parking * 22 + 'px' }">
                                        <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                                    </span>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-layout>
                                    <v-flex xs12 style="padding-top: 12px">
                                        Public Transportation:
                                    </v-flex>
                                    <v-flex>
                                    <span class="rating" :style="{ width: review.ratedCharacteristics.publicTransport * 22 + 'px' }">
                                        <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                                    </span>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-layout>
                                    <v-flex xs12 style="padding-top: 12px">
                                        Noise:
                                    </v-flex>
                                    <v-flex>
                                    <span class="rating" :style="{ width: review.ratedCharacteristics.noise * 22 + 'px' }">
                                        <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                                    </span>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-layout>
                                    <v-flex xs12 style="padding-top: 12px">
                                        Commercial Service:
                                    </v-flex>
                                    <v-flex>
                                    <span class="rating" :style="{ width: review.ratedCharacteristics.commercialServices * 22 + 'px' }">
                                        <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                                    </span>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-layout>
                                    <v-flex xs12 style="padding-top: 12px">
                                        Upkeep:
                                    </v-flex>
                                    <v-flex>
                                    <span class="rating" :style="{ width: review.ratedCharacteristics.upkeep * 22 + 'px' }">
                                        <v-icon v-for="i in 5" :key="i" color="orange" class="star">star</v-icon>
                                    </span>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </div>
            </v-slide-y-transition>
        </v-card-text>
        <v-card-text>
            <v-card>
                <v-tabs grow icons-and-text centered slider-color="grey" color="grey lighten-2">
                    <v-tab href="#pros" ripple class="green--text text--darken-3">
                        Pros
                        <v-icon color="green darken-3">thumb_up</v-icon>
                    </v-tab>
                    <v-tab href="#cons" class="red--text">
                        Cons
                        <v-icon color="red">thumb_down</v-icon>
                    </v-tab>
                    <v-tabs-items class="tabs-items">
                        <v-tab-item id="pros">
                            <div class="tab-item">
                                {{ review.Pros }}
                            </div>
                        </v-tab-item>
                        <v-tab-item id="cons">
                            <div class="tab-item">
                                {{ review.Cons }}
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script>
  import AppAvatar from './AppAvatar';

  export default {
    name: 'AppReviewTile',
    props: ['review', 'user'],
    data() {
      return {
        expanded: false,
      };
    },
    components: {
      AppAvatar
    }
  };
</script>

<style scoped>
    .rating {
        padding: 2px 0 0;
        overflow: hidden;
        display: inline-block;
        white-space: nowrap;
        vertical-align: sub;
    }

    .tab-item {
        padding: 10px;
        font-size: 16px;
    }
</style>
<template>
<v-container fluid grid-list-lg>
  <v-layout row wrap v-if="loaded">
    <v-flex xs12 sm12 md9 order-xs2 order-md1>
      <v-tabs icons-and-text centered dark color="primary">
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="(tab,i) in tabs" :href="`#tab-${i+1}`">
          {{ tab.title }}
          <v-icon>{{ tab.icon }}</v-icon>
        </v-tab>

        <v-tab-item id="tab-1">
          <v-card>
            <v-card-media contain :height="400" class="grey lighten-4">
              <app-image-gallery v-model="v.images"/>
            </v-card-media>
            <v-card-text>
              <v-layout wrap row >
                <v-flex xs12>
                  <v-card-title class="title">
                    <app-map-icon :location="location"/>
                    {{ address }}
                    <v-spacer/>
                    &#x24;{{ v.price }}
                  </v-card-title>
                  <v-divider/>
                </v-flex>
              <v-flex xs12 sm12 md7 mt-3>
                <v-layout wrap row>
                  <v-flex xs12>
                    <v-card>
                      <v-card-title><h4>Utilities</h4></v-card-title>
                      <v-divider/>
                      <app-tag-list v-model="v.tags"/>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 mt-3>
                    <v-card>
                      <v-card-title><h4>About</h4></v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <i>{{ about }}</i>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md4 offset-md1>
                <app-attribute-list v-model="attributes" />
              </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item id="tab-2">
          <v-card height="500">
          <app-favor-list :favors="v._interested"/>
          </v-card>
        </v-tab-item>

        <v-tab-item id="tab-3">
          <v-card height="500">
            <app-comments :comments="v.comments" :onComment="addComment"/>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-flex>
    <v-flex order-xs1 order-md2>
      <v-toolbar color="primary" dark :height="72"><v-toolbar-title>Publisher</v-toolbar-title></v-toolbar>
      <app-publisher-details v-model="p"/>
    </v-flex>
  </v-layout>
</v-container>
<!-- <v-container mt-5 grid-list-lg>
  <v-layout row wrap v-if="loaded">
    <v-flex xs12 sm12 md9>
      <v-card>
        <v-card-media contain height="400" class="grey lighten-5">
          <v-slide-x-transition>
            <div :key="image" class="card__media__background" :style="{background: `url(${image}) center center / contain no-repeat`}"></div>
          </v-slide-x-transition>
           <v-container fill-height fluid>
        <v-layout fill-height>
          <v-btn v-if="v.images.length > 0" :disabled="v.images.length === 1" icon @click.native="">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="v.images.length > 0" :disabled="v.images.length === 1" icon @click.native="">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
                      <gmap-map :center="position" :zoom="15" map-type-id="roadmap" :style="{ width: 'auto', height: '200px', bottom: 0 }">
            <GmapMarker :position="position" />
            </gmap-map justify-right>
        </v-layout>
                    <v-layout justify-end align-end>
                      <v-flex xs7>

            </v-flex>
            </v-layout>
      </v-container>
        </v-card-media>
        <v-list-tile-content>
          <v-btn icon @click.native="openMap" class="pink--text mb-1">
            <v-icon>place</v-icon>
          </v-btn>
          <div class="body-1">{{ address }}</div>
          <div class="body-1">$ {{ v.price }}</div>
          <div class="body-1">Entrance date: {{ v.entranceDate }}</div>
          <div></div>
        </v-list-tile-content>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md3>
      <v-card>
        <v-card-media>
          <v-layout align-center>
            <v-flex xs4 ml-3 mt-3>
            <app-avatar :src="p.image" :name="p.firstName" :size="70" class="text-xs-center mb-3"></app-avatar>
            </v-flex>
            <v-flex>
            <div class="title">{{ p.firstName }}</div>
            </v-flex>
          </v-layout>
        </v-card-media>
        <v-divider/>
        
          <transition name="slide-x-transition" mode="out-in">
            <div key="action" v-if="!share">
              <v-btn icon :class="fav ? 'red--text' : ''" @click.native="">
              <v-icon>favorite</v-icon>
            </v-btn>
            <v-btn icon  @click="share = true">
              <v-icon>share</v-icon>
            </v-btn>
            </div>
            <div v-if="share" key="share">
              <v-layout wrap row  align-center justify-center>
                <v-flex>
              <v-btn icon @click="share = false">&#x2190;</v-btn>
              </v-flex>
              <v-flex mr-3>
              <app-social-sharing :id="v._id" :price="v.price" :address="address"/>
              </v-flex>
              </v-layout>
              </div>
          </transition>
        <v-divider/>
        <v-list two-line>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">email</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="body-1">{{ p.email }}</v-list-tile-title>
              <v-list-tile-sub-title>E-mail</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">phone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ p.phone || '---'}}</v-list-tile-title>
              <v-list-tile-sub-title>Mobile</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
            </v-list-tile-action>
        </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex >
      <v-card> -->
        <!-- <v-carousel>
          <v-carousel-item
            v-for="(image, i) in v.images"
            :key="`image-${i}`"
            :src="image"
            hide-delimiters="true"
            reverse-transition="fade"
          ></v-carousel-item>
        </v-carousel> -->
        <!-- <v-card>
          <v-card-title>
            <span class="body-2"></span>
            <v-spacer/>
            <v-icon color="black" >home</v-icon>
          </v-card-title>
          <v-divider ></v-divider>
          <v-card-actions class="pt-4">
            <v-flex>
            <span class="caption">
              <span class="body-2">published:</span>
              <span class="body-1">{{ new Date(v.createdAt).toDateString() }}</span>
            </span>
            </v-flex>
            <v-spacer></v-spacer>
            <v-tooltip top slot="activator">
              <v-btn icon slot="activator" :class="fav ? 'red--text' : ''" @click.native="favorite">
                <v-icon>favorite</v-icon>
              </v-btn>
              <span>{{ interestedMessage }}</span>
            </v-tooltip>
            <v-tooltip top slot="activator">
              <v-btn icon slot="activator" @click.native="getPublisher">
                <v-icon>account_box</v-icon>
              </v-btn>
              <span>Publisher profile</span>
            </v-tooltip>
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
                      <v-layout justify-center wrap row justify-space-around>
                        <social-sharing v-for="(network, i) in share.networks" :key="`network-${i}`" :url="share.url" :title="share.title" :description="share.description" :quote="share.quote" inline-template>
                          <network :network="network.name" style="cursor:pointer">
                            <v-icon large :color="network.color">{{ network.icon }}</v-icon>
                          </network>
                        </social-sharing>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-menu>
          </v-card-actions>


          <v-card-actions class="subheading">
            <span  class="body-2" >Address:</span>
            {{ getAddress() }}
            <v-spacer/>
            <v-tooltip top slot="activator" justify-end>
              <v-btn icon slot="activator" @click.native="openMap" class="pink--text mb-1" >
                <v-icon>place</v-icon>
              </v-btn>
              <span>{{"Open in map"}}</span>
            </v-tooltip>
          </v-card-actions> -->

          <!--<v-card-actions class="subheading">-->
            <!--<span  class="body-2" >Price:</span>-->
            <!--${{ apartment.price }}-->
          <!--</v-card-actions>-->
          <!-- <v-divider></v-divider> -->
          <!-- <v-list subheader two-line>
            <v-list-group v-model="apartment.active" no-action :prepend-icon="apartment.icons[0]">
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span class="body-2">{{ "attributes" }}</span>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-container pt-1>
                <div v-for="(property, i) in apartment.properties" :key="`property-${i}`" class="pb-3">
                  <v-subheader>
                    {{ property.title }}
                    <v-spacer/>
                    <span v-if="property.isEditable" >
                      <v-btn icon v-if="!property.edit.active" @click="property.edit.active = true">
                        <v-icon color="info">edit</v-icon>
                      </v-btn>
                      <v-btn icon v-if="property.edit.active" @click="editProperty(property)">
                        <v-icon color="success">check</v-icon>
                      </v-btn>
                      <v-btn icon v-if="property.edit.active" @click="property.edit.active = false; property.value.current = property.value.previous, property.error = []">
                        <v-icon color="error">close</v-icon>
                      </v-btn>
                    </span>
                  </v-subheader>
                  <span v-if="!property.isEditable || !property.edit.active" class="body-1 pl-3">
                  {{ property.value.current }}
                  </span>
                  <span v-else>
                    <v-text-field
                      v-if="property.edit.kind === 'text'"
                      class="pt-0 px-3"
                      v-model="property.value.current"
                      :rules="property.edit.rules"
                      :multi-line="property.edit.isMultiline"
                      :error-messages="property.error"
                      />
                  </span>
                </div>
              </v-container>
            </v-list-group>

            <v-list-group  :prepend-icon="apartment.icons[1]" no-action >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span class="body-2">{{ "interested" }}</span>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-container>
                <span>omri</span>
              </v-container>
            </v-list-group>

            <v-list-group  :prepend-icon="apartment.icons[2]" no-action >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span class="body-2">{{ "groups" }}</span>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-container>
                <span>from a group!</span>
              </v-container>
            </v-list-group>

            <v-list-group  :prepend-icon="apartment.icons[3]" no-action >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span class="body-2">{{ "reviews" }}</span>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-container>
                <span>pros vs cons</span>
              </v-container>
            </v-list-group>

            <v-list-group  :prepend-icon="apartment.icons[4]" no-action >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span class="body-2">{{ "comments" }}</span>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-container>
                <div>
                  <app-comments :comments="apartment.comments" :onComment="addComment"></app-comments>
                </div>
              </v-container>
            </v-list-group>

          </v-list> -->
        <!-- </v-card> -->
      <!-- </v-card>
    </v-flex>
    <v-flex>
      <v-card height="200">

      </v-card>
    </v-flex>
  </v-layout>
</v-container> -->
</template>

<script>
  import { mapGetters } from 'vuex';
  import AppSocialSharing from './AppSocialSharing';
  import AppImageGallery from './Galleries/AppImageGallery'
  import AppAttributeList from './Lists/AppAttributeList'
  import AppTagList from './Lists/AppTagList'
  import AppMapIcon from './Maps/AppMapIcon'
  import AppPublisherDetails from './Lists/AppPublisherDetails';
  import AppFavorList from './Lists/AppFavorList';
  import AppComments from './Comments/AppComments'

    export default {
      props: {
        apartment: {
          type: Object,
          default: null
        },
        publisher: {
          type: Object,
          default: null
        }
      },
      data() {
        return {
          loaded: false,
          v: null,
          p: null,
          dialog: false,
          fav: false,
          share: false,
          tabs: [
            {
              icon: 'list_alt',
              title: 'Details'
            },
            {
              icon: 'favorite',
              title: 'Interested'
            },
            {
              icon: 'comment',
              title: 'Comments'
            },
            {
              icon: 'rate_review',
              title: 'Reviews'
            },
            {
              icon: 'group',
              title: 'Groups'
            }
          ],
          // expended: false,
          // show: 'apartmentDetails',
          // fav: false,
          // showMap: false,
          // tags: tagsList,
          
          // imageNumber: 0,
          // imageDialog: false,
          // interestedMessage: "I'm interested!",
          // clipboard: {
          //   color: undefined,
          //   text: 'Copy link',
          //   closeDelay: 200,
          //   lastCopyTime: 0
          // },
          // e1: 'recent',
          // fetchedPublisher: false,
        };
      },
      methods: {
        // favorite() {
        //   if (!this.isAuthenticated) {
        //     this.interestedMessage = 'Please login first';
        //   } else if (!this.isVerified) {
        //     this.interestedMessage = 'Please verify account';
        //   } else {
        //     this.fav = !this.fav;
        //   //   this.$store
        //   //     .dispatch('favor', { id: this.apartment._id })
        //   //     .then((apartment) => {
        //   //       this.apartment._interested = apartment._interested;
        //   //     })
        //   //     .catch((error) => {
        //   //       // eslint-disable-next-line
        //   //       console.log(error);
        //   //       this.fav = !this.fav;
        //   //     });
        //   }
        // },
        // editProperty(property) {
        //   if (property.value.current === property.value.previous) {
        //     property.edit.active = false;
        //     return;
        //   }
          
        //   if ( (property.value.current >= 0)) {
        //     property.value.previous = property.value.current;
        //     property.edit.active = false;
        //   }
        //   else{
        //     property.error.push("invalid value")
        //   }
        // },
        addComment(comment) {
          return this.$store.dispatch('addApartmentComment', {
            params: {
              id: this.v._id
            },
            payload: {
              text: comment.text
            }
          });
        },
        fetchApartment(id) {
          return this.$store.dispatch('searchApartments', { id })
          .then((apartment) => {
            this.v = apartment[0];
          });
        },
        fetchPublisher(id) {
          console.log(id);
          return this.$store.dispatch('fetchUser', { id })
          .then((users) => {
            console.log(users)
            this.p = users[id];
          });
        }
      },
      computed: {
        // ...mapGetters(['isAuthenticated', 'isVerified']),
        attributes() {
        return [
          {
            title: 'required roommates',
            value: this.v.requiredRoommates
          },
          {
            title: 'total roommates',
            value: this.v.totalRoommates // change model from currentlyNumberOfRoommates -> totalRoommates
          },
          {
            title: 'floor',
            value: this.v.floor
          },
          {
            title: 'total floors',
            value: this.v.totalFloors
          },
          {
            title: 'rooms number',
            value: this.v.numberOfRooms
          },
          {
            title: 'area (square meter)',
            value: this.v.area
          }
        ]
      },
      about() {
        return this.v.description || 'The owner hasn\'t added any additional details';
      },
      address() {
          return `${this.v.location.address.street.capitalize()} ${ this.v.location.address.number}, ${this.v.location.address.city.capitalize()}`;
      },
      location() {
        return { 
          longitude: this.v.location.geolocation[0],
           latitude: this.v.location.geolocation[1] 
        }
      }
        // image() {
        //   return this.apartment.images[0]
        //     ? this.apartment.images[this.imageNumber]
        //     : this.defaultImage;
        // },
        // detailsHeight() {
        //   return `${this.$refs.cardDetails.clientHeight}px`;
        // },
        // },
        // position() {
        //   return {
        //     lat: this.v.location.geolocation[1],
        //     lng: this.v.location.geolocation[0]
        //   }
        // }
      },
      created() {
        if (!this.apartment) {
          this.$store.commit('showLoading');
          this.fetchApartment(this.$route.params.id)
          .then(() => this.fetchPublisher(this.v._createdBy))
          .then(() => this.loaded = true)
          .catch(e => console.log(e))
          .then(() => this.$store.commit('hideLoading'));
        } else if (!this.publisher) {
          this.$store.commit('showLoading');
          this.v = this.apartment;
          this.fetchPublisher(this.v._createdBy)
          .then(() => this.loaded = true)
          .catch(e => console.log(e))
          .then(() => this.$store.commit('hideLoading'));
        } else {
          this.v = this.apartment;
          this.p = this.publisher;
          this.loaded = true;
        }
      },
      components: {
        // AppAvatar,
        AppImageGallery,
        AppSocialSharing,
        AppAttributeList,
        AppTagList,
        AppMapIcon,
        AppPublisherDetails,
        AppFavorList,
        AppComments
      },
      mounted() {
        // if (this.isAuthenticated) {
        //   this.fav = this.apartment._interested.includes(
        //     this.$store.getters.getUser._id
        //   );
        // }
        // this.share.url = `https://localhost:8080/${this.apartment._id}`;
        // this.share.title = 'Sharing this apartment I found on Roommates with you';
        // this.share.description = `Located in ${this.getAddress()}, price: ${
        //   this.apartment.price
        //   }`;
        // this.share.quote =
        //   'This is an apartment that I thought might interest you.';
      }
    };
</script>

<style scoped>

</style>

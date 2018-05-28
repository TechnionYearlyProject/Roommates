<template>
  <v-layout row warp pt-0>
    <v-flex xs12 sm12 md6 offset-md3 :class="{'my-5': $vuetify.breakpoint.mdAndUp}">
      <v-card>
        <v-carousel>
          <v-carousel-item
            v-for="(photo,i) in apartment.photos"
            :key="i"
            :src="photo.src"
            hide-delimiters="true"
            reverse-transition="fade"
          ></v-carousel-item>
        </v-carousel>
        <!--<v-card-media-->
          <!--height="200px"-->
          <!--src="https://vuetifyjs.com/static/doc-images/cards/docks.jpg"-->
        <!--&gt;-->
          <!--<v-container fill-height fluid>-->
            <!--<v-layout column class="media">-->
              <!--<v-card-title primary-title>-->
                <!--<div class="display-1 white&#45;&#45;text ml-3">{{ apartment.title }}</div>-->
              <!--</v-card-title>-->
            <!--</v-layout>-->
          <!--</v-container>-->
        <!--</v-card-media>-->




        <v-card>
          <v-card-title>
            <span class="body-2">{{ apartment.title }}</span>
            <v-spacer/>
            <v-icon color="black" >home</v-icon>
          </v-card-title>
          <v-divider ></v-divider>
          <v-card-actions class="pt-4">
            <!--<v-card-title>-->
            <!--{{ apartment.title }}-->
            <!--<v-icon>home</v-icon>-->
            <!--</v-card-title>-->
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
          </v-card-actions>

          <!--<v-card-actions class="subheading">-->
            <!--<span  class="body-2" >Price:</span>-->
            <!--${{ apartment.price }}-->
          <!--</v-card-actions>-->
          <v-divider></v-divider>
          <v-list subheader two-line>
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

          </v-list>
        </v-card>


      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import defaultApartmentImage from '../assets/apartment-defalut.jpg';
  import tagsList from '../assets/tags';
  import AppAvatar from './sub-components/AppAvatar';
  import AppMap from './sub-components/AppMap';
  import AppComments from './sub-components/AppComments';
  import AppFavors from './sub-components/AppFavors';
  import AppImageDialog from './sub-components/AppImageDialog';
  import attributes from "../assets/attributes";

    export default {
      props: [],
      data() {
        return {
          apartment: {
            active: true,
            price: 1000,
            comments: [],
            icon: 'C:\\Users\\omrih\\WebstormProjects\\Roommates\\views\\static\\favicon\\android-chrome-192x192.png',
            title: 'Apartment Information',
            createdAt: new Date('2018-05-05').getTime(),
            icons: [
              'list',
              'favorite',
              'person',
              'check',
              'chat'
            ],
            properties: [
              {
                title: 'price ($)',
                value: {
                  current: 8,
                  previous: 8,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  rules: [v => v > 0 ],
                }
              },
              {
                title: 'required roommates',
                value: {
                  current: 2,
                  previous: 2,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  rules: [v => v > 0 && v < 12],
                }
              },
              {
                title: 'total roommates',
                value: {
                  current: 3,
                  previous: 3,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  rules: [v => v > 0 && v < 12],
                }
              },
              {
                title: 'floor',
                value: {
                  current: 2,
                  previous: 2,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  rules: [v => v >= 0 && v < 12],
                }
              },
              {
                title: 'total floors',
                value: {
                  current: 3,
                  previous: 3,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  // rules: [v => v >= 0 && v < 12 && v >= apartment.properties.floor],
                }
              },
              {
                title: 'rooms',
                value: {
                  current: 7,
                  previous: 7,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  rules: [v => v > 0 && v < 12],
                }
              },
              {
                title: 'area (square meter)',
                value: {
                  current: 2,
                  previous: 2,
                },
                error: [],
                isEditable: true,
                edit: {
                  active: false,
                  kind: 'text',
                  rules: [v => v > 0 ],
                }
              }
            ],

            photos: [
              {
                src: 'https://vuetifyjs.com/static/doc-images/carousel/squirrel.jpg'
              },
              {
                src: 'https://vuetifyjs.com/static/doc-images/carousel/sky.jpg'
              },
              {
                src: 'https://vuetifyjs.com/static/doc-images/carousel/bird.jpg'
              },
              {
                src: 'https://vuetifyjs.com/static/doc-images/carousel/planet.jpg'
              }
            ],
          },
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
          return 'Gilboa 35, Haifa';
          // return `${this.apartment.location.address.street.capitalize()} ${
          //   this.apartment.location.address.number
          //   }, ${this.apartment.location.address.city.capitalize()}`;
        },
        favorite() {
          if (!this.isAuthenticated) {
            this.interestedMessage = 'Please login first';
          } else if (!this.isVerified) {
            this.interestedMessage = 'Please verify account';
          } else {
            this.fav = !this.fav;
          //   this.$store
          //     .dispatch('favor', { id: this.apartment._id })
          //     .then((apartment) => {
          //       this.apartment._interested = apartment._interested;
          //     })
          //     .catch((error) => {
          //       // eslint-disable-next-line
          //       console.log(error);
          //       this.fav = !this.fav;
          //     });
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
        initApartment(){
          this.apartment.properties.push({
            title: 'price',
            value: 8,
            icon: 'dollar',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
          this.profile.properties.push({
            title: 'required roommates',
            value: 1,
            icon: 'people',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
          this.apartment.properties.push({
            title: 'total roommates',
            value: 2,
            icon: 'people',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
          this.apartment.properties.push({
            title: 'floor',
            value: 2,
            icon: '',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
          this.apartment.properties.push({
            title: 'total roommates',
            value: 3,
            icon: '',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
          this.apartment.properties.push({
            title: 'rooms',
            value: 7,
            icon: '',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
          this.apartment.properties.push({
            title: 'area (square meters)',
            value: 2,
            icon: '',
            error: [],
            isEditable: true,
            edit: {
              active: false,
              kind: 'number',
              rules: v => v >= 0 ,
              counter: 25,
            },
          });
        },
        editProperty(property) {
          if (property.value.current === property.value.previous) {
            property.edit.active = false;
            return;
          }
          // this.$store
          //   .dispatch('updateUser', property.getPayload())
          //   .then(() => {
          //     property.error = [];
          if ( (property.value.current >= 0)) {
            property.value.previous = property.value.current;
            property.edit.active = false;
          }
          else{
            property.error.push("invalid value")
          }

          //   })
          //   .catch((error) => {
          //     property.value.current = property.value.previous;
          //     property.error = 'An error occured!';
          //     // eslint-disable-next-line
          //     console.log(error); // show an error message
          //   }
          // );
        },
        openMap() {
          this.showMap = true;
        },
        addComment(comment) {
          // return this.$store.dispatch('addApartmentComment', {
          //   params: {
          //     id: this.apartment._id
          //   },
          //   payload: {
          //     text: comment.text
          //   }
          // });
        },
        expandDetails() {
          if (this.expended) {
            this.expended = false;
          } else {
            this.expended = true;
          }
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
        }
      },
      components: {
        AppAvatar,
        AppMap,
        AppComments,
        AppFavors,
        AppImageDialog
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

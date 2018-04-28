<template>
    <div>
        <app-drawer @search="search"></app-drawer>
        <v-parallax absolute :src="image">
            <v-container fill-height>
                <v-layout align-center align-content-center wrap row>
                    <v-flex text-xs-left xs12 pb-3>
                        <h3 :class="$vuetify.breakpoint.mdAndDown? 'display-2' : 'display-4'">FIND YOUR DREAM</h3>
                    </v-flex>
                    <v-flex text-xs-center text-xs-top align xs12>
                        <h3 :class="$vuetify.breakpoint.mdAndDown? 'display-2' : 'display-4'">APARTMENT HERE &#10083;</h3>
                    </v-flex>
                </v-layout>
            </v-container>
            <p class="text-xs-right" style="text-size:9px">
                <a class="black--text" style="text-decoration:none" href="http://www.freepik.com">Designed by Inbevel13 / Freepik</a>
            </p>
        </v-parallax>

        <v-container>
            <v-card style="margin-top:-104px; min-height: 500px;">
                <v-toolbar class="mb-1" card prominent color="secondary lighten-3">
                    <v-toolbar-title class="body-2">
                        <v-icon>sort</v-icon>Sort</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-breadcrumbs large>
                        <v-breadcrumbs-item v-for="sortOption in sortOptions" :key="sortOption.title" :disabled="loading" @click.native="sort(sortOption)" style="cursor: pointer;">
                            <span class="black--text">{{ sortOption.title }}</span>
                            <span style="width: 15px">
                                <v-icon v-if="sortOption.direction" medium>{{ sortOption.direction === 'up' ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
                            </span>
                        </v-breadcrumbs-item>
                    </v-breadcrumbs>
                    <!-- <div v-for="(sortOption, i) in sortOptions" :key="`sort-${i}`">

                        <v-btn flat @click="sort(sortOption)" :disabled="loading" :loading="loading" style="text-transform: none">
                            <v-icon left>{{ sortOption.icon }}</v-icon>
                            <span class="hidden-xs-only pr-1">{{ sortOption.title }}</span>
                            <v-icon v-if="sortOption.direction" small>{{ sortOption.direction === 'up' ? 'arrow_upward' : 'arrow_downward' }}</v-icon>
                        </v-btn>
                    </div> -->
                </v-toolbar>
                <v-container grid-list-lg>
                    <v-layout wrap row>
                        <v-flex v-if="loading" class="text-xs-center" xs12>
                            <v-progress-circular indeterminate color="purple" class="ma-5" />
                        </v-flex>
                        <v-flex v-else-if="!apartments || apartments.length === 0" class="text-xs-center" xs12>
                            No results
                        </v-flex>
                        <transition-group name="scale-transition" tag="v-layout" class="wrap row">
                            <v-flex xs12 sm6 md6 lg4 v-for="(apartment,i) in apartments" :key="`apartment-${i}`">
                                <app-apartment-ad :apartment="apartment"></app-apartment-ad>
                            </v-flex>
                        </transition-group>
                    </v-layout>
                </v-container>
            </v-card>
        </v-container>
        <v-btn color="pink accent-1" dark fab fixed bottom right @click="$vuetify.goTo(0, scrollOptions)">
            <v-icon>keyboard_arrow_up</v-icon>
        </v-btn>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import AppMainSearchForm from './sub-components/AppMainSearchForm';
    import AppApartmentAd from './AppApartmentAd';
    import AppDrawer from './AppDrawer';
    import cityImage from '../assets/city-image.jpg';

    export default {
      data() {
        return {
          // apartments: null,
          scrollOptions: {
            duration: 500,
            offset: 10,
            easing: 'easeInOutCubic'
          },
          image: cityImage,
          loading: false,
          dialog: false,
          sortOptions: [
            {
              title: 'Price',
              direction: null,
              icon: 'toll',
              compareFunction: (x, y) => x.price - y.price
            },
            {
              title: 'Entrance date',
              direction: null,
              icon: 'event',
              compareFunction: (x, y) => x.entranceDate - y.entranceDate
            },
            {
              title: 'Interest',
              direction: null,
              icon: 'favorite',
              compareFunction: (x, y) => x._interested.length - y._interested.length
            }
          ]
        };
      },
      computed: {
        ...mapGetters({ apartments: 'getApartments' })
      },
      methods: {
        ...mapMutations(['setApartments']),
        search(filters) {
          this.setApartments([]);
          this.loading = true;
          this.$store
            .dispatch('searchApartments', filters)
            .catch(error =>
              // eslint-disable-next-line
              console.log(error)
            )
            .then(() => {
              this.loading = false;
            });
        },
        async sort(sortOption) {
          this.loading = true;
          await new Promise((resolve) => {
            const preserveOrder = (x, y) =>
              this.apartments.indexOf(x._id) - this.apartments.indexOf(y._id);
            if (sortOption.direction === null || sortOption.direction === 'down') {
              this.apartments.sort(
                (x, y) => sortOption.compareFunction(x, y) || preserveOrder(x, y)
              );
              sortOption.direction = 'up';
            } else {
              this.apartments.sort(
                (x, y) => sortOption.compareFunction(y, x) || preserveOrder(x, y)
              );
              sortOption.direction = 'down';
            }
            resolve();
          });
          this.loading = false;
        }
      },
      beforeMount() {
        if (this.$route.query.id) {
          this.search({ id: this.$route.query.id });
        } else if (!this.apartments) {
          this.search({});
        }
      },
      components: {
        AppMainSearchForm,
        AppApartmentAd,
        AppDrawer
      }
    };
</script>

<style >

</style>

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
          dialog: false
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
      },
      beforeMount() {
        if (!this.apartments) {
          this.search({});
        }
      },
      components: {
        AppMainSearchForm,
        AppApartmentAd,
        AppDrawer,
      }
    };
</script>

<style >

</style>

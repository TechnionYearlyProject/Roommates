<template>
  <b-container style="margin-top:5%">
          <h1 class="s-h1">
            You <strong>LOVED</strong> these
          </h1>
    <b-container class="mb-3">
    </b-container>
    <b-container>
      <b-card no-body>
        <div v-if="apartments.length === 0">
          <p style="padding: 3% 3%; margin: 0">You have yet to express interest in any apartment.</p>
        </div>
        <div v-else>
          <b-list-group>
            <b-list-group-item v-for="apartment in apartments" :key="apartment._id">
              <!-- :src="apartment.images[0]" -->
              <b-row>
                <b-col cols="1" class="banner">
                  <interested-banner></interested-banner>
                </b-col>
                <b-col cols="2">
                  <h5>{{ apartment.title }}</h5>
                  <p>{{ apartment.location.address.street.toFormal() }} {{ apartment.location.address.number }}, {{ apartment.location.address.city.toFormal() }}</p>
                </b-col>
                <b-col cols="3">
                  <ul>
                    <li v-for="i in apartment.tags" :key="i">
                      <b-badge variant="secondary" v-b-popover.hover.left="tags[i-1].name">
                        <icon :name="tags[i-1].vicon" />
                      </b-badge>
                    </li>
                  </ul>
                </b-col>
                <b-col cols="3" style="padding: 2% 2% 2% 5%">
                  <price-banner :price="apartment.price"></price-banner>
                </b-col>
                <b-col cols="3" style="padding: 2% 8%;">
                  <b-link :to="{ name: 'apartment-page', params: { id: apartment._id,apartmentP: apartment }}" class="btn btn-primary">View Page
                    <icon name="arrow-circle-right" class="arrow-icon"></icon>
                  </b-link>
                </b-col>
              </b-row>

            </b-list-group-item>
          </b-list-group>
        </div>

        </b-row>
      </b-card>
    </b-container>
  </b-container>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";
  import InterestedBanner from "@/components/interested/InterestedBanner.vue";
  import PriceBanner from "@/components/interested/PriceBanner.vue";
  import Tags from "@/../static/js/tags";

  export default {
    data() {
      return {
        tags: Tags,
        blankSrc: require("@/../static/images/apartments/default/default.png"),
        apartments: []
      };
    },
    methods: {
      showImage(apartment) {
        return apartment.images[0] ? apartment.images[0] : this.blankSrc;
      }
    },
    mounted() {
      const id = this.$route.params.id;
      this.$http
        .get(`users/${id}/interested`)
        .then(res => {
          console.log(res.body);
          this.apartments = res.body.interested;
        })
        .catch(err => this.apartments.push(err.status));
    },
    components: {
      Icon,
      InterestedBanner,
      PriceBanner
    }
  };
</script>

<style scoped>
  h5 {
    margin: 15px 0 10px 0;
    letter-spacing: 1px;
    color: #d27e04;
    text-transform: uppercase;
  }

  p {
    font-size: 18px;
  }

  li:first-child {
    display: inline-block;
    margin: 10px 5px;
  }
  li {
    display: inline-block;
    margin: 5px;
  }

  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrow-icon {
    vertical-align: middle;
  }
</style>

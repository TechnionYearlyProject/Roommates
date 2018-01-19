<template>
<div>
  <b-container style="margin-top:5%" v-if="appliedSuccesfully === true">
     <UserPanelGeneralSuccess labelText="Your ad has been removed successfully!"></UserPanelGeneralSuccess>
  </b-container>
  <b-container style="margin-top:5%" v-if="appliedSuccesfully === false">
          <h1 class="s-h1">
            You <strong>PUBLISHED</strong> these
          </h1>
          <b-alert variant="danger" :show="errors">An error occured, could not save changes</b-alert>
    <b-container class="mb-3">
    </b-container>
    <b-container>
      <b-card no-body>
        <div v-if="apartments.length === 0">
          <p style="padding: 3% 3%; margin: 0">You have yet to publish any apartments.</p>
        </div>
        <div v-else>
          <b-list-group>
            <b-list-group-item v-for="apartment in apartments" :key="apartment._id">
              <!-- :src="apartment.images[0]" -->
              <b-row>
                <b-col>
                   <h5>{{ apartment.title }}</h5>
                </b-col>
                <b-col>
                  <p>{{ apartment.location.address.street.toFormal() }} {{ apartment.location.address.number }}, {{ apartment.location.address.city.toFormal() }}</p>
                </b-col>
                <b-col>
                	<p> Interested: {{ apartment._interested.length }} </p>
                	<p> Comments: {{ apartment.comments.length }} </p>
                </b-col>
                <b-col style="padding: 2% 8%;">
                  <b-link :to="`/apartments/${apartment._id}`" class="btn btn-primary">View
                    <icon name="arrow-circle-right" class="arrow-icon"></icon>
                  </b-link>
                  <b-link type="delete"  @click="(event) => { deleteApartment(event, `${apartment._id}`) }" class="btn btn-primary">Delete
                    <icon name="trash" class="trash"></icon>
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
</div>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";
  import UserPanelGeneralSuccess from "@/components/user-panel/UserPanelGeneralSuccess.vue";
  import loading from "vue-full-loading";

  export default {
    name: 'published-apartments',
    data() {
      return {
        apartments: [],
        errors: false,
        showLoading: false,
        appliedSuccesfully: false
      };
    },
    methods: {
      showImage(apartment) {
        return apartment.images[0] ? apartment.images[0] : this.blankSrc;
      },
      deleteApartment (evt, apartmentId) {
        evt.preventDefault();
        this.showLoading = true;
        this.errors = false;
        this.appliedSuccesfully = false;
        this.$http.delete(`apartments/${apartmentId}`,  {}, {headers: {'x-auth': this.$auth.getToken() }})
                          .then(res =>  {this.showLoading = false;this.appliedSuccesfully = true; } )
                          .catch(e => {console.log(e); this.errors = true;this.showLoading = false; });
      },
    },
    mounted() {
      const id = this.$route.params.id;
      this.$http
        .get(`users/${id}/published`)
        .then(res => {
          console.log(res.body);
          this.apartments = res.body.published;
        })
        .catch(err => this.apartments.push(err.status));
    },
    components: {
      Icon, UserPanelGeneralSuccess
    }
  };
</script>

<style scoped>
  h5 {
    letter-spacing: 1px;
    color: #d27e04;
    text-transform: uppercase;
  }

  .arrow-icon {
    vertical-align: middle;
  }

  .trash {
    vertical-align: middle;
  }
</style>

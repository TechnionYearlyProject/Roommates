<template>
  <v-container style="padding: 50px;">
    <h1>You ane one step away from getting your dream apartment</h1>

    <v-icon :color="agreedToS ? 'green' : 'grey lighten-1'" x-large style="margin-top: -15px">fa-check</v-icon>
    <span class="step">Step one:</span>
    <span class="step-content">Read and accept the</span>
    <v-dialog v-model="ToSDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-btn outline slot="activator" color="primary" dark>Terms of Service</v-btn>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="ToSDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Terms of Service</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="ToSClick">Agree</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <div><span class="title">1. Introduction</span><br> These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.
            </div>
            <div> <br> </div>
            <div><span class="title">2. Intellectual Property Rights.</span><br> Other than content you own, which you may have opted to include on this Website, under these Terms, Roommates and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved.
              You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website
            </div>
            <div> <br> </div>
            <div><span class="title">3. Restrictions</span><br> You are expressly and emphatically restricted from all of the following:<br>
              publishing any Website material in any media;<br>
              selling, sublicensing and/or otherwise commercializing any Website material;<br>
              publicly performing and/or showing any Website material;<br>
              using this Website in any way that is, or may be, damaging to this Website;<br>
              using this Website in any way that impacts user access to this Website;<br>
              using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;<br>
              engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;<br>
              using this Website to engage in any advertising or marketing;<br>
              Certain areas of this Website are restricted from access by you and Roommates may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion.  Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.</div>
            <div> <br> </div>
            <div><span class="title">4. No warranties.</span><br>This Website is provided “as is,” with all faults, and Roommates makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-dialog><br>

    <div style="margin-bottom: 10px"></div>

    <v-icon :color="agreedContract ? 'green' : 'grey lighten-1'" x-large style="margin-top: -15px">fa-check</v-icon>
    <span class="step">Step two:</span>
    <span class="step-content">Read and accept the</span>
    <v-dialog v-model="contractDialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="margin-right: 40px">
      <v-btn outline slot="activator" color="primary">Apartment Contract</v-btn>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="contractDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Contract</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="contractDialog = false; agreedContract = true">Agree</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-layout justify-center>
          <v-container>
            <br>
            <app-contract />
          </v-container>
        </v-layout>
      </v-card>
    </v-dialog>
    <br>
    <br>

    <div style="text-align: center; margin-top: 15px">
      <span class="checkout">And now you can checkout:</span>
      <div style="margin-top: 15px"></div>
      <app-paypal :amount="apartment.price" :disabled="!agreedContract || !agreedToS" @completed="paymentSuccess"></app-paypal>
    </div>
  </v-container>
</template>

<script>
import AppPaypal from './sub-components/AppPayPal';
import AppApartmentAd from './AppApartmentAd';
import AppContract from "./sub-components/AppContract";

export default {
  name: 'AppPayment',
  data() {
    return {
      ToSDialog: false,
      contractDialog: false,
      fetchedPublisher: false,
      agreedToS: false,
      agreedContract: false,
      publisher: {
        firstName: 'Some',
        lastName: 'User',
        email: 'user@example.com',
        mobilePhone: '+972-8711111'
      },
      alert: {
        show: false,
        message: '',
        type: 'error'
      },
      apartment: {}
    };
  },
  created() {
    const apartmentID = this.$route.query['id'];

    this.$store.commit('showLoading');
    this.$store.dispatch('fetchApartments', { apartmentID })
      .then(apartment => this.apartment = apartment[0])
      .then(() => this.$store.commit('hideLoading'));
  },
  methods: {
    paymentSuccess(payment) {
      if (payment.state === 'approved') {
        this.visitPage();
      } else {
        this.$store.commit('showSnackbar', 'Payment was not made, an error occurred');
      }
    },
    ToSClick() {
      this.ToSDialog = false;
      this.agreedToS = true;
    },
    visitPage() {
      this.$router.push({
        name: 'AppApartmentPage',
        params: {
          id: this.apartment._id,
          apartment: this.apartment,
          publisher: this.publisher
        }
      });
    }
  },
  components: {
    AppContract,
    AppPaypal,
    AppApartmentAd
  }
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Raleway');

  h1 {
    text-align: center;
    text-transform: uppercase;
    color: #999;
    letter-spacing: 5px;
    padding: 0 50px;
    font-family: 'Raleway', sans-serif;
    font-weight: 100;
    font-size: 36px;
    margin-bottom: 50px;
  }

  .step {
    text-transform: uppercase;
    color: #666;
    letter-spacing: 5px;
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    font-size: 22px;
    position: relative;
    bottom: -1px;
    width: 150px;
  }

  .step:first-of-type {
    margin-right: 6px;
  }

  .step-content, .checkout {
    text-transform: uppercase;
    color: #111;
    letter-spacing: 2px;
    font-family: 'Raleway', sans-serif;
  }

  .checkout {
    font-size: 22px;
    font-weight: bold;
    color: #777;
  }
</style>

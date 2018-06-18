<template>
    <v-layout row warp pt-0>
      <v-flex xs12 sm12 md6 offset-md3 :class="{'my-5': $vuetify.breakpoint.mdAndUp}">
        <v-card>
          <v-alert :type="alert.type" :value="alert.show" transition="scale-transition">
          {{ alert.message }}
          </v-alert>
          <v-card grid-list-lg style="min-height: 300px">
            <v-layout justify-center>
              <h3 style="margin-bottom: 20px">One step from Closing The Deal!</h3>
            </v-layout>
            <v-card-actions>
              <v-layout justify-center>
                <v-dialog v-model="ToSDialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="margin-left: 50px">
                  <v-btn slot="activator" color="primary" dark style="padding-left: 10px; padding-right: 10px">Terms of Service</v-btn>
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
                </v-dialog>
                <v-spacer/>
                <v-dialog v-model="contractDialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="margin-right: 40px">
                  <v-btn slot="activator" color="primary" dark>Apartment Contract</v-btn>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click.native="contractDialog = false">
                        <v-icon>close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Contract</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark flat @click.native="contractDialog = false">Agree</v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-layout justify-center>
                      <v-container>
                        <div><br></div>
                        <a href="https://www.google.com">Apartment Contract</a>
                      </v-container>
                    </v-layout>

                  </v-card>
                </v-dialog>
              </v-layout>
            </v-card-actions>
          </v-card>

          <v-container>
            <v-layout justify-center >
              <v-card>
                  <app-paypal :amount="amount" @completed="paymentSuccess"></app-paypal>
              </v-card>
            </v-layout>
          </v-container>
         </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
import AppPaypal from './sub-components/AppPayPal';
import AppApartmentAd from './AppApartmentAd';

export default {
  name: 'AppPayment',
  props: {
    price: {
      type: Number,
      required: false
    }
  },
  url: '',
  agreedToS: false,
  data() {
    return {
      amount: 100,
      ToSDialog: false,
      contractDialog: false,
      fetchedPublisher: false,
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
      apartment: [
        {
          _id: '5b154565bfc2730600d892c3',
          _createdBy: '',
          createdAt: Date.now(),
          price: 1000,
          entranceDate: new Date('12-29-2019').getTime(),
          location: {
            address: {
              state: 'israel',
              city: 'Tel-Aviv',
              street: 'Rothschild',
              number: 23
            },
            geolocation: [34.775313, 32.065887]
          },
          numberOfRooms: 3,
          floor: 1,
          totalFloors: 5,
          tags: [0, 7],
          requiredRoommates: 1,
          totalRoommates: 2,
          groups: []
        }
      ]
    };
  },
  methods: {
    paymentSuccess(payment) {
      if (payment.state === 'approved') {
        if (this.agreedToS === true) {
          if (this.agreedContract === true) {
            alert(`success!\nID: ${payment.id}`); // eslint-disable-line
            // redirect to group page where the user status will be changed to payed
          } else {
            this.alert.message = 'please read and agree to the Apartment Contract';
            this.alert.show = true;
          }
        } else {
          this.alert.message = 'please read and agree to the Terms of Service';
          this.alert.show = true;
        }
      } else {
        this.alert.message = 'payment not complete';
        this.alert.show = true;
      }
    },
    ToSClick() {
      this.ToSDialog = false;
      this.agreedToS = true;
    },
    getPublisher() {
      if (!this.fetchedPublisher) {
        const id = this.apartment._createdBy;
        this.$store.dispatch('fetchUser', { id })
        .then((users) => {
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
    AppPaypal,
    AppApartmentAd
  }
};
</script>

<style scoped>
</style>

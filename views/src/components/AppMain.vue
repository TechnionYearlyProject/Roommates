<template>
  <div>
    <app-drawer></app-drawer>
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
      <v-card style="margin-top:-104px;">
        <v-container grid-list-lg>
          <v-layout wrap row>
            <v-flex xs12 sm6 md6 lg4 v-for="(apartment,i) in apartments" :key="`apartment-${i}`">
              <app-apartment-ad :apartment="apartment"></app-apartment-ad>
            </v-flex>
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
  import AppMainSearchForm from './AppMainSearchForm';
  import AppApartmentAd from './AppApartmentAd';
  import AppDrawer from './AppDrawer';
  import cityImage from '../assets/city-image.jpg';

  export default {
    data() {
      return {
        apartments: [],
        scrollOptions: {
          duration: 500,
          offset: 10,
          easing: 'easeInOutCubic'
        },
        image: cityImage
      };
    },
    mounted() {

      this.apartments = [
        {
          _id: '5a5879a991ce7538e484130c',
          title: 'great place!',
          price: 1000,
          enteranceDate: 12345678,
          requiredNumberOfRoommates: 1,
          totalRoommates: 3,
          numberOfRooms: 4,
          floor: 2,
          totalFloors: 3,
          area: 100,
          _createdBy: '5a58794d91ce7538e4841308',
          createdAt: 1515747753079.0,
          comments: [
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516568639448.0,
              text: 'this is a test!',
              _id: '5a65003f8af5bb30e4a212ef'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570437663.0,
              text: 'test number two !',
              _id: '5a6507458af5bb30e4a212f1'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570538975.0,
              text: 'test number three !',
              _id: '5a6507aa8af5bb30e4a212f2'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570647247.0,
              text: 'test number four',
              _id: '5a6508178af5bb30e4a212f4'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516575941005.0,
              text: 'hi how are you ?',
              _id: '5a651cc58af5bb30e4a212f6'
            }
          ],
          tags: [1, 3, 6],
          description: 'Great place',
          images: [],
          location: {
            geolocation: [35.0164783, 32.7831797],
            address: {
              state: 'israel',
              city: 'haifa',
              street: 'gilboa',
              number: 35
            }
          },
          _interested: ['5a58794d91ce7538e4841308', '5a651d668af5bb30e4a212f7'],
          __v: 72,
          show: false,
          fav: false // this should be accourding to the objectId of the connected user
        },
        {
          _id: '5a5879a991ce7538e484130c',
          title: 'great place!',
          price: 1000,
          enteranceDate: 12345678,
          requiredNumberOfRoommates: 1,
          numberOfRooms: 4,
          floor: 2,
          totalFloors: 3,
          area: 100,
          _createdBy: '5a58794d91ce7538e4841308',
          createdAt: 1515747753079.0,
          comments: [
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516568639448.0,
              text: 'this is a test!',
              _id: '5a65003f8af5bb30e4a212ef'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570437663.0,
              text: 'test number two !',
              _id: '5a6507458af5bb30e4a212f1'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570538975.0,
              text: 'test number three !',
              _id: '5a6507aa8af5bb30e4a212f2'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570647247.0,
              text: 'test number four',
              _id: '5a6508178af5bb30e4a212f4'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516575941005.0,
              text: 'hi how are you ?',
              _id: '5a651cc58af5bb30e4a212f6'
            }
          ],
          tags: [1, 3, 6],
          description: 'Great place',
          images: [],
          location: {
            geolocation: [35.0164783, 32.7831797],
            address: {
              state: 'israel',
              city: 'haifa',
              street: 'gilboa',
              number: 35
            }
          },
          _interested: ['5a58794d91ce7538e4841308', '5a651d668af5bb30e4a212f7'],
          __v: 72,
          show: false,
          fav: false // this should be accourding to the objectId of the connected user
        },
        {
          _id: '5a5879a991ce7538e484130c',
          title: 'great place!',
          price: 1000,
          enteranceDate: 12345678,
          requiredNumberOfRoommates: 1,
          numberOfRooms: 4,
          floor: 2,
          totalFloors: 3,
          area: 100,
          _createdBy: '5a58794d91ce7538e4841308',
          createdAt: 1515747753079.0,
          comments: [
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516568639448.0,
              text: 'this is a test!',
              _id: '5a65003f8af5bb30e4a212ef'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570437663.0,
              text: 'test number two !',
              _id: '5a6507458af5bb30e4a212f1'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570538975.0,
              text: 'test number three !',
              _id: '5a6507aa8af5bb30e4a212f2'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570647247.0,
              text: 'test number four',
              _id: '5a6508178af5bb30e4a212f4'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516575941005.0,
              text: 'hi how are you ?',
              _id: '5a651cc58af5bb30e4a212f6'
            }
          ],
          tags: [1, 3, 6],
          description: 'Great place',
          images: [],
          location: {
            geolocation: [35.0164783, 32.7831797],
            address: {
              state: 'israel',
              city: 'haifa',
              street: 'gilboa',
              number: 35
            }
          },
          _interested: ['5a58794d91ce7538e4841308', '5a651d668af5bb30e4a212f7'],
          __v: 72,
          show: false,
          fav: false // this should be accourding to the objectId of the connected user
        },
        {
          _id: '5a5879a991ce7538e484130c',
          title: 'great place!',
          price: 1000,
          enteranceDate: 12345678,
          requiredNumberOfRoommates: 1,
          numberOfRooms: 4,
          floor: 2,
          totalFloors: 3,
          area: 100,
          _createdBy: '5a58794d91ce7538e4841308',
          createdAt: 1515747753079.0,
          comments: [
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516568639448.0,
              text: 'this is a test!',
              _id: '5a65003f8af5bb30e4a212ef'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570437663.0,
              text: 'test number two !',
              _id: '5a6507458af5bb30e4a212f1'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570538975.0,
              text: 'test number three !',
              _id: '5a6507aa8af5bb30e4a212f2'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516570647247.0,
              text: 'test number four',
              _id: '5a6508178af5bb30e4a212f4'
            },
            {
              _createdBy: '5a58794d91ce7538e4841308',
              createdAt: 1516575941005.0,
              text: 'hi how are you ?',
              _id: '5a651cc58af5bb30e4a212f6'
            }
          ],
          tags: [1, 3, 6],
          description: 'Great place',
          images: [],
          location: {
            geolocation: [35.0164783, 32.7831797],
            address: {
              state: 'israel',
              city: 'haifa',
              street: 'gilboa',
              number: 35
            }
          },
          _interested: ['5a58794d91ce7538e4841308', '5a651d668af5bb30e4a212f7'],
          __v: 72,
          show: false,
          fav: false // this should be accourding to the objectId of the connected user
        }
      ];
    },
    components: {
      AppMainSearchForm,
      AppApartmentAd,
      AppDrawer
    }
  };
</script>

<style >
  #parallax-id img {
  }
</style>

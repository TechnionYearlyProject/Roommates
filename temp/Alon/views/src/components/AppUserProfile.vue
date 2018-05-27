<template>
  <v-layout row warp pt-0>
    <v-flex xs12 sm12 md6 offset-md3 :class="{'my-5': $vuetify.breakpoint.mdAndUp}">
      <v-card>
        <v-card-media :src="user.image? user.image : defaultImage" height="300px">
          <v-layout column class="media">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn dark icon class="mr-3">
                <v-icon color="accept">edit</v-icon>
              </v-btn>
            </v-card-title>
          </v-layout>
        </v-card-media>

        <v-list subheader two-line>
          <v-list-group v-model="item.active" v-for="(item,i) in items" :key="`item-${i}`" :prepend-icon="item.action" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <div v-if="item['ref'] === 'profile'">
              <v-list-tile v-for="(subItem,j) in profile" :key="`profile-${j}`">
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ subItem.title }}</v-list-tile-sub-title>
                  <span v-if="subItem.editMode" style="width:170px">
                    <v-text-field v-if="subItem.editKind === 'text'" :label="subItem.label? subItem.label : 'Edit'" :mask="subItem.mask" v-model="subItem.value" :counter="subItem.counter" :rules="subItem.rules" :multi-line="subItem.multi" single-line autofocus return-masked-value></v-text-field>
                    <v-radio-group v-else-if="subItem.editKind === 'radio'" v-model="subItem.value" row>
                      <v-radio v-for="(gender,i) in genderList" :key="`gender-${i}`" :label="gender.title" :value="gender.value"></v-radio>
                    </v-radio-group>
                  </span>
                  <span v-else>
                    {{ subItem.value.length > 150? subItem.value.slice(0,147) + '...' : subItem.value }}
                  </span>
                </v-list-tile-content>
                <v-list-tile-action class="pt-3">
                  <!-- edit -->
                  <v-btn icon class="mx-0" v-if="subItem.editable && !subItem.editMode" @click="subItem.editMode = true">
                    <v-icon color="accept">edit</v-icon>
                  </v-btn>
                  <div v-if="subItem.editable && subItem.editMode">
                    <v-btn icon class="mx-0" @click="subItem.editMode = false;subItem.prev = subItem.value;editItem(subItem);">
                      <v-icon color="accept">check</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="subItem.editMode = false;subItem.value = subItem.prev;">
                      <v-icon color="cancel">close</v-icon>
                    </v-btn>
                  </div>
                </v-list-tile-action>
              </v-list-tile>
            </div>
            <div v-if="item['ref'] === 'attributes'">
              <v-list-tile v-for="(subItem,j) in attributes" :key="`attributes-${j}`">
                <v-list-tile-content>
                  <span v-if="subItem.type === 'add-form'" style="width:100%" class="pb-2">
                    <v-select max-height="400" :items="attributeList" v-model="subItem.value" label="You can add more" :hint="attributeHint" persistent-hint autocomplete single-line></v-select>
                  </span>
                  <span v-else>
                    <v-list-tile-title>{{ subItem.value }}</v-list-tile-title>
                  </span>
                </v-list-tile-content>
                <v-list-tile-action class="pb-2">
                  <v-btn icon class="mx-0" v-if="subItem.addable" @click="addItem(subItem)">
                    <v-icon color="accept">add</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </div>
            <div v-if="item['ref'] === 'favorites'">
              <v-list-tile v-for="(subItem,j) in favorites" :key="`favorites-${j}`">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </div>
            <div v-if="item['ref'] === 'publishes'">
              <v-list-tile v-for="(subItem,j) in publishes" :key="`publishes-${j}`">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </div>
          </v-list-group>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import defaultUserImage from '../assets/user-default.png';
  import attrList from '../assets/attributes';

  export default {
    data() {
      return {
        dialog: false,
        profile: [],
        attributes: [
          {
            type: 'add-form',
            addable: true
          }
        ],
        favorites: [],
        publishes: [],
        items: [
          {
            action: 'person',
            title: 'Profile Information',
            ref: 'profile',
            active: true
          },
          {
            action: 'fitness_center',
            title: 'Attributes and Skills',
            ref: 'attributes'
          },
          {
            action: 'favorite',
            title: 'My Interests',
            ref: 'favorites'
          },
          {
            action: 'home',
            title: 'My Publishes',
            ref: 'publishes'
          }
        ],
        user: {
          _id: '5ac646c9859c292104f0b23c',
          email: 'alontalmor@gmail.com',
          firstName: 'Alon',
          birthdate: 1049902707763.0,
          gender: 'male',
          isVerified: true,
          _interestedApartments: [123, 321],
          _publishedApartments: [123, 321],
          hobbies: [1, 2, 3, 4, 5, 6, 7, 8],
          about: 'Hi, how are you? This is a test',
          image: '',
          mobilePhone: '97211111111',
          lastName: 'Talmor'
        },
        defaultImage: defaultUserImage,
        genderList: [
          {
            title: 'Male',
            value: 'male'
          },
          {
            title: 'Female',
            value: 'female'
          }
        ],
        attributeList: null,
        attributeHint: ''
      };
    },
    methods: {
      editItem() {
        console.log('editted!');
      },
      removeItem(i, j) {
        this.items[i].items.splice(j, 1);
      },
      addItem(item) {
        this.attributeHint = '';
        if (!item.value) {
          return;
        } else if (
          this.attributes.some((e, i) => e.value === item.value && i > 0)
        ) {
          this.attributeHint = 'already added';
          return;
        }
        this.attributes.splice(1, 0, {
          title: '',
          value: item.value,
          removable: true
        });
        item.value = '';
      }
    },
    created() {
      this.attributeList = attrList.map(x => x.name);
      this.profile.push({
        title: 'E-mail',
        value: this.user.email,
        editable: false
      });
      this.profile.push({
        title: 'Name',
        value: `${this.user.firstName} ${this.user.lastName}`,
        prev: `${this.user.firstName} ${this.user.lastName}`,
        editable: true,
        editKind: 'text',
        editMode: false,
        rules: [v => v.length <= 25 || ''],
        counter: 25
      });
      this.profile.push({
        title: 'Birthday date',
        label: '####-##-##',
        mask: '####-##-##',
        value: '2018-03-02',
        prev: '2018-03-02',
        editable: true,
        editKind: 'text',
        editMode: false
      });
      this.profile.push({
        title: 'Gender',
        value: this.user.gender,
        prev: this.user.gender,
        editable: true,
        editKind: 'radio',
        editMode: false
      });
      this.profile.push({
        title: 'Phone',
        value: this.user.mobilePhone,
        prev: this.user.mobilePhone,
        editable: true,
        editKind: 'text',
        mask: '##########',
        editMode: false
      });
      this.profile.push({
        title: 'About',
        value: this.user.about,
        prev: this.user.about,
        editable: true,
        editKind: 'text',
        editMode: false,
        rules: [v => v.length <= 147 || ''],
        counter: 147,
        multi: true
      });
      for (let i = 0; i < this.user.hobbies.length; i += 1) {
        this.attributes.push({
          title: '',
          value: this.user.hobbies[i],
          removable: true
        });
      }
      for (let i = 0; i < this.user._interestedApartments.length; i += 1) {
        this.favorites.push({
          title: this.user._interestedApartments[i],
          value: ''
        });
      }
      for (let i = 0; i < this.user._publishedApartments.length; i += 1) {
        this.publishes.push({
          title: this.user._publishedApartments[i],
          value: ''
        });
      }
    }
  };
</script>

<style scoped>

</style>

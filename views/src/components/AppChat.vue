<template>
    <v-container fill-height>
        <v-layout height="100%" width="100%">
            <v-flex xs4 class="side-panel">
                <div>
                    <v-text-field v-model="searchInput" label="Search" append-icon="search" />
                </div>
                <div>
                    <ul>
                        <li v-for="(contact, contactName) in contacts"
                            :class="{ 'active': activeContact.name === contactName }" @click="activeContactIndex = getIndexOfContact(contactName)">
                            {{ contactName }}<br />
                            {{ contact.conversations[contact.conversations.length - 1].content }}
                        </li>
                    </ul>
                </div>
            </v-flex>
            <v-flex xs12>
                <v-layout column>
                    <v-flex>
                        {{ activeContact.name }}<br />
                        {{ activeContact.active ? 'Active' : 'Not Active' }}
                    </v-flex>
                    <v-flex sm12>
                        <ul>
                            <li v-for="msg in activeContact.conversations" :class="{ incoming: msg.incoming, 'message-container': true }">
                                <span class="message-author">{{ msg.author }}</span>
                                <span class="message-date"> at {{ dateIntervalFormat(msg.date) }}</span>
                                <v-card class="message-content">
                                    {{ msg.content }}
                                </v-card>
                            </li>
                        </ul>
                    </v-flex>
                    <v-flex>
                        <v-text-field label="Write a message..." autofocus v-model="message" @keyup.native.enter="sendMessage" />
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    name: "AppChat",
    data() {
      return {
        searchInput: '',
        activeContactIndex: 0,
        allContacts: {
          'Alon Talmor': {
            active: true,
            conversations: [
              {
                incoming: true,
                author: 'Alon Talmor',
                content: 'Hi Idan',
                date: new Date(2018, 5, 3, 21, 23)
              },
              {
                incoming: false,
                author: 'Idan Yadgar',
                content: 'Hi Alon how are you today?',
                date: new Date(2018, 5, 3, 21, 47)
              }
            ]
          },
          'Or Abramovich': {
            active: false,
            conversations: [
              {
                incoming: false,
                author: 'Idan Yadgar',
                content: 'Hi Or, I would like to talk about the project tomorrow',
                date: new Date(2018, 5, 3, 21, 25)
              },
              {
                incoming: true,
                author: 'Or Abramovich',
                content: 'No problem, we\'ll meet at the office',
                date: new Date(2018, 5, 3, 21, 41)
              }
            ]
          }
        },
        message: ''
      };
    },
    computed: {
      activeContact() {
        let name = Object.keys(this.allContacts)[this.activeContactIndex];

        return {
          name,
          active: this.allContacts[name].active,
          conversations: this.allContacts[name].conversations
        }
      },
      contacts() {
        let searchInput = this.searchInput.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

        let contacts = {};
        for (let contactName in this.allContacts) {
          if (this.allContacts.hasOwnProperty(contactName) && new RegExp(searchInput, 'i').test(contactName)) {
            contacts[contactName] = this.allContacts[contactName];
          }
        }

        return contacts;
      }
    },
    methods: {
      sendMessage() {
        this.activeContact.conversations.push({
          incoming: false,
          author: 'Idan Yadgar',
          content: this.message,
          date: Date.now()
        });

        this.message = '';
      },
      getIndexOfContact(contactName) {
        return Object.keys(this.allContacts).indexOf(contactName);
      },
      dateIntervalFormat(date) {
        const time = (Date.now() - date) / 1000;
        if (time < 60) {
          return 'Just now';
        } else if (time >= 60 && time < 3600) {
          return `${Math.floor(time / 60)} minutes ago`;
        } else if (time >= 3600 && time < 86400) {
          return `${Math.floor(time / 3600)} hours ago`;
        }
        return `${Math.floor(time / 86400)} days ago`;
      }
    }
  }
</script>

<style scoped>
    .active {
        background-color: gray;
    }

    .message-container.incoming {
        direction: rtl;
    }

    .message-content {
        display: inline-block;
    }
</style>
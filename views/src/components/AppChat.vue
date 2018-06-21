<template>
    <v-container fluid fill-height class="chat-container">
        <v-layout height="100%" width="100%" class="card">
            <v-flex xs4 class="side-panel">
                <v-layout column>
                    <v-flex class="search-contact-container">
                        <v-text-field hide-details v-model="searchInput" label="Search contact" append-icon="search" />
                    </v-flex>
                    <v-flex class="contacts-container">
                        <div class="contacts-scroll">
                            <ul>
                                <li v-for="(contact, contactName) in contacts" :key="contactName"
                                    :class="{ active: userById[activeContact.name] === contactName, contact: true }"
                                    @click="activeContactIndex = getIndexOfContact(contactName)">
                                    <v-layout>
                                        <div class="contact-avatar">
                                            <app-avatar :name="contactName" :size="35" />
                                        </div>
                                        <v-flex>
                                            <div class="contact-name">
                                                {{ contactName }}
                                            </div><br style="clear: both;" />
                                            <div class="contact-last-message" v-if="contact.conversations.length > 0">
                                                {{ contact.conversations[contact.conversations.length - 1].content }}
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </li>
                            </ul>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-layout column>
                    <v-flex>
                        <v-layout class="current-contact">
                            <div class="current-contact-avatar">
                                <app-avatar :name="userById[activeContact.name]" />
                            </div>
                            <div class="current-contact-name">
                                <router-link :to="{ name: 'AppUserProfile', params: { id: activeContact.name } }">
                                    {{ userById[activeContact.name] }}
                                </router-link>
                            </div>
                        </v-layout>
                    </v-flex>
                    <v-flex sm12 style="position: relative;">
                        <div class="messages-outer-container" ref="messagesScroller">
                            <ul class="messages-inner-container">
                                <li v-for="msg in activeContact.conversations" :class="{ incoming: msg.incoming, 'message-container': true }">
                                    <div class="message-author">
                                        <app-avatar :name="userById[msg.author]" />
                                    </div>
                                    <div class="message-data-content">
                                        <v-tooltip top>
                                            <span slot="activator" class="message-date">{{ dateIntervalFormat(msg.date) }}</span>
                                            <span>{{ msg.date.toLocaleString() }}</span>
                                        </v-tooltip><br />
                                        <v-card class="message-content" v-html="nl2br(msg.content)" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </v-flex>
                    <v-flex class="message-field-container">
                        <v-text-field hide-details multi-line auto-grow :rows="1" label="Write a message..." append-icon="send" :append-icon-cb="sendMessage" autofocus v-model="message" @keypress.native.enter.exact.prevent="sendMessage" />
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios';
  import AppAvatar from "./sub-components/AppAvatar";

  export default {
    name: "AppChat",
    components: { AppAvatar },
    data() {
      return {
        mutationObserver: new MutationObserver(() => this.$refs.messagesScroller.scrollTop = this.$refs.messagesScroller.scrollHeight),
        searchInput: '',
        activeContactIndex: 0,
        allContacts: {},
        userById: {},
        message: ''
      };
    },
    computed: {
      activeContact() {
        if (Object.keys(this.allContacts).length === 0) {
          return {};
        }

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
        for (let contactId in this.allContacts) {
          if (this.allContacts.hasOwnProperty(contactId)) {
            const contactName = this.userById[contactId];

            if (new RegExp(searchInput, 'i').test(contactName)) {
              contacts[contactName] = this.allContacts[contactId];
            }
          }
        }

        return contacts;
      }
    },
    created() {
      this.$store.dispatch('fetchSelfConversations')
        .then(conversations => {
          const ids = {};
          ids[this.$store.getters.getUser._id] = '';

          for (const conversation of conversations) {
            const participants = conversation._participants.filter(p => p !== this.$store.getters.getUser._id);
            for (const p of participants) {
              ids[p] = '';
            }

            const contact = participants.join(', ');
            const messages = conversation.messages.map(message => {
              ids[message._sentBy] = '';

              return this.createLocalMessageFromServerMessage(message);
            });

            this.$set(this.allContacts, contact, {
              conversations: messages
            });
          }

          axios.get('http://localhost:3000/users', { params: { id: Object.keys(ids) } }).then(response => {
            Object.keys(response.data.users).forEach(id => {
              const user = response.data.users[id];
              response.data.users[id] = `${user.firstName} ${user.lastName}`;

            });

            this.userById = response.data.users;
          });
        });
    },
    mounted() {
      this.mutationObserver.observe(this.$refs.messagesScroller.children[0], { childList: true });
    },
    beforeDestroy() {
      this.mutationObserver.disconnect();
    },
    methods: {
      createLocalMessageFromServerMessage({ _sentBy, createdAt, content }) {
        return {
          incoming: _sentBy !== this.$store.getters.getUser._id,
          author: _sentBy,
          content: content,
          date: new Date(createdAt * 1000)
        }
      },
      sendMessage() {
        this.message = this.message.trim();

        if (this.message === '') {
          return;
        }

        this.$socket.emit('chat_message', {
          content: this.message,
          to: Object.keys(this.allContacts)[this.activeContactIndex]
        });

        this.activeContact.conversations.push({
          incoming: false,
          author: this.$store.getters.getUser._id,
          content: this.message,
          date: new Date()
        });

        this.message = '';
      },
      getIndexOfContact(contactName) {
        return Object.keys(this.allContacts).findIndex(id => this.userById[id] === contactName);
      },
      nl2br(str) {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
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
    },
    sockets: {
      chat_message(message) {
        const m = this.createLocalMessageFromServerMessage(message);

        if (!this.userById.hasOwnProperty(m.author)) {
          axios.get('http://localhost:3000/users', { params: { id: [ m.author ] } }).then(response => {
            const user = Object.values(response.data.users)[0];
            this.userById[m.author] = `${user.firstName} ${user.lastName}`;

            if (!this.allContacts.hasOwnProperty(m.author)) {
              this.$set(this.allContacts, m.author, {
                conversations: []
              });
            }

            this.allContacts[m.author].conversations.push(m);

          });
        }
        else {
          if (!this.allContacts.hasOwnProperty(m.author)) {
            this.$set(this.allContacts, m.author, {
              conversations: []
            });
          }

          this.allContacts[m.author].conversations.push(m);
        }
      }
    }
  }
</script>

<style scoped>
    ul, li {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .side-panel {
        border-right: solid 1px #ddd;
    }

    .search-contact-container {
        padding: 0 10px 10px;
        border-bottom: solid 1px #ddd;
    }

    .contacts-container {
        position: relative;
        height: 100%;
    }

    .contacts-scroll {
        overflow-y: scroll;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .contact {
        cursor: pointer;
        padding: 10px;
    }

    .contact:hover {
        background-color: #e8eaf56c;
    }

    .contact.active {
        background-color: #e8eaf5;
    }

    .contact-avatar, .contact-avatar ~ * {
        vertical-align: middle;
    }

    .contact-avatar {
        margin-right: 10px;
    }

    .contact-avatar:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }

    .contact-avatar > * {
        vertical-align: middle;
        display: inline-block;
    }

    .contact-avatar + div {
        position: relative;
    }

    .contact-name, .contact-last-message {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: absolute;
        width: 100%;
    }

    .contact-last-message {
        opacity: 0.6;
        font-size: 13px;
    }

    .current-contact {
        padding: 6px;
        border-bottom: solid 1px #ddd;
    }

    .current-contact > * {
        vertical-align: middle;
        padding-top: 5px;
    }

    .current-contact-avatar {
        margin: 0 10px;
        padding: 0;
    }

    .current-contact-name {
        font-size: 22px;
        margin-top: 4px;
    }

    .current-contact-name a {
        text-decoration: none;
        color: inherit;
    }

    .current-contact, .search-contact-container, .message-field-container {
        background-color: #e9ebf55c;
    }

    .messages-outer-container {
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: scroll;
    }

    .messages-outer-container:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: top;
    }

    .messages-inner-container {
        display: inline-block;
        vertical-align: bottom;
        width: 100%;
        padding: 15px;
    }

    .message-container {
        margin-top: 30px;
    }

    .message-container.incoming {
        direction: rtl;
        text-align: right;
    }

    .message-container.incoming > * {
        direction: ltr;
        text-align: left;
    }

    .message-container > div {
        vertical-align: middle;
        display: inline-block;
    }

    .message-data-content {
        margin-left: 15px;
        margin-top: -24px;
        text-align: right;
    }

    .message-date {
        display: inline-block;
        padding-top: 5px;
        font-size: 12px;
    }

    .message-content {
        display: inline-block;
        width: 100%;
        padding: 15px;
        text-align: left;
        background-color: #e8eaf56c;
        min-width: 100px;
    }

    .message-container:not(.incoming) .message-content {
        background-color: #33a1ce;
        color: #fff;
    }

    .message-container.incoming .message-data-content {
        margin-left: 0;
        margin-right: 15px;
    }

    .message-field-container {
        padding: 0 10px 10px;
        border-top: solid 1px #ddd;
    }
</style>
<template>
    <div id="chat">
        <ul>
            <li v-for="contact in contacts" @click="writeMessage(contact)">{{ contact }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "chat",
        data() {
            return {
                contacts: []
            }
        },
        sockets: {
            connect() {
                if (this.$auth.isAuthenticated()) {
                    this.$socket.emit('join', this.$auth.getToken());
                }
                else {
                    this.$socket.disconnect();
                }
            },
            welcome(contacts) {
                this.contacts = contacts;
                console.log(contacts);
            },
            message(message) {
                alert(`${message.from} says: ${message.content}`);
            },
            contactAdd(contact) {
                this.contacts.push(contact);
            },
            contactRemove(contact) {
                this.contacts.splice(this.contacts.indexOf(contact), 1);
            }
        },
        methods: {
            writeMessage(to) {
                this.$socket.emit('message', {
                    to,
                    content: prompt('Write your message:')
                });
            }
        }
    }
</script>

<style scoped>
    #chat {
        position: fixed;
        bottom: 0;
        right: 15px;
        border: 1px solid #000;
        border-bottom: none;
    }
</style>
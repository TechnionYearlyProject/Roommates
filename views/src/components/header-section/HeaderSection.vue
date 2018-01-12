<template>
    <header id="header" class="box">
        <div class="grid">
            <roommates-logo />

            <div class="pull-right">
                <b-button size="lg" variant="primary" :to="{ name: 'identification' }" v-if="!isAuth">Login</b-button>
                <b-button size="lg" variant="primary" :to="{ name: 'add-apartment-page' }" v-if="isAuth"
                          v-b-popover.hover.bottom="'Add Apartment'">
                    <icon name="plus" />
                </b-button>
                <b-button size="lg" class="logout-button" @click="logout" v-if="isAuth">Logout</b-button>
            </div>
            <br class="clear" />
        </div>
    </header>
</template>

<script>
    import bButton from "bootstrap-vue/es/components/button/button";
    import Icon from "vue-awesome/components/Icon";
    import RoommatesLogo from "@/components/roommates-logo/RoommatesLogo";
    import EventBus from "@/event-bus/EventBus";

    export default {
        name: "header-section",
        data() {
            return {
                isAuth: null
            }
        },
        methods: {
            logout() {
                this.$auth.destroyToken();
                this.isAuth = this.$auth.isAuthenticated();
                this.$router.push({ name: 'main-page' });
            }
        },
        created() {
            this.isAuth = this.$auth.isAuthenticated();
        },
        mounted() {
            EventBus.onLogin(() => {
                this.isAuth = this.$auth.isAuthenticated();
            });
        },
        components: {
            RoommatesLogo,
            bButton,
            Icon
        }
    };
</script>

<style scoped>
    header {
        border: none;
        border-bottom: #ddd solid 1px;
        padding: 10px 0;
        margin-bottom: 15px;
    }

    button:first-of-type {
        text-transform: uppercase;
    }

    .logout-button {
        cursor: pointer;
    }
</style>
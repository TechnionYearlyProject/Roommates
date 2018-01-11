<template>
    <header id="header" class="box">
        <div class="grid">
            <roommates-logo />

            <div class="pull-right">
                <b-button size="lg" variant="primary" :to="{ name: 'identification' }">Login</b-button>
                <b-button size="lg" variant="primary" :to="{ name: 'add-apartment-page' }"
                          v-b-popover.hover.bottom="'Add Apartment'">
                    <icon name="plus" />
                </b-button>
            </div>
            <br class="clear" />
        </div>
    </header>
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button'
    import Icon from 'vue-awesome/components/Icon'
    import RoommatesLogo from "@/components/roommates-logo/RoommatesLogo";

    export default {
        name: "header-section",
        components: {
            RoommatesLogo,
            bButton, Icon
        }
    }
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
</style>
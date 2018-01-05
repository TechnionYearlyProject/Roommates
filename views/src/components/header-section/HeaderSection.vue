<template>
    <div id="header" class="box">
        <div class="grid">
            <b-link id="logo" :to="{ name: 'main-page' }">Roommates</b-link>

            <div class="pull-right">
                <b-button size="lg" variant="primary">Login</b-button>
                <b-button size="lg" variant="primary" v-b-popover.hover.bottom="'Add Apartment'">
                    <icon name="plus" />
                </b-button>
            </div>
            <br class="clear" />
        </div>
    </div>
</template>

<script>
    import bLink from 'bootstrap-vue/es/components/link/link'
    import bButton from 'bootstrap-vue/es/components/button/button'
    import Icon from 'vue-awesome/components/Icon'

    export default {
        name: "header-section",
        components: {
            bLink, bButton, Icon
        }
    }
</script>

<style scoped>
    #header {
        border-bottom: #ddd solid 1px;
        padding: 10px 0;
        margin-bottom: 15px;
    }

    #logo {
        font-size: 20px;
        text-transform: uppercase;
        border: #fdc600 solid 3px;
        color: #000;
        display: inline-block;
        padding: 0 10px;
        font-weight: 500;
        position: relative;
        text-decoration: none;
    }

    #logo::before, #logo::after {
        content: '';
        display: inline-block;
        position: absolute;
        width: 55px;
        height: 3px;
        background-color: #fff;
    }

    #logo::before {
        right: 15px;
        top: -3px;
    }

    #logo::after {
        left: 15px;
        bottom: -3px;
    }

    #logo::first-letter {
        font-size: 28px;
        color: #fdc600;
    }

    button:first-of-type {
        text-transform: uppercase;
    }
</style>
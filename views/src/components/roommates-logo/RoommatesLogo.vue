<template>
    <b-link class="logo" :to="{ name: 'main-page' }">Roommates</b-link>
</template>

<script>
    import bLink from 'bootstrap-vue/es/components/link/link'

    export default {
        name: "roommates-logo",
        props: ['bgColor'],
        components: {
            bLink
        }
    }
</script>

<style scoped>
    .logo {
        font-size: 20px;
        text-transform: uppercase;
        border: #fdc600 solid 3px;
        color: #000;
        display: inline-block;
        padding: 0 10px;
        font-weight: 500;
        position: relative;
        text-decoration: none;
        background-color: #fff;
    }

    .logo::before, .logo::after {
        content: '';
        display: inline-block;
        position: absolute;
        width: 55px;
        height: 3px;
        background-color: #fff;
    }

    .logo::before {
        right: 15px;
        top: -3px;
    }

    .logo::after {
        left: 15px;
        bottom: -3px;
    }

    .logo::first-letter {
        font-size: 28px;
        color: #fdc600;
    }
</style>
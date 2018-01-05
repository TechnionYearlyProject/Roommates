<template>
    <b-button type="submit" />
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button'

    export default {
        name: "search-button",
        components: {
            bButton
        }
    }
</script>

<style scoped>
    button {
        display: inline-block;
        background: #fdc600 18px 15px no-repeat;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 2px solid #FFF;
        cursor: pointer;
    }

    button, button:active, button:focus {
        background-image: url('../../../static/images/icon-search.png') !important;
        border-radius: 50%;
    }
</style>
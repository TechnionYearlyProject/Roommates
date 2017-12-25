<template>
    <div id="app">
        <header-component></header-component>

        <router-view></router-view>
    </div>
</template>

<script>
    import Header from './components/Header'

    export default {
        name: 'app',
        components: {
            'header-component' : Header
        }
    }
</script>

<style>
    html {
        height: 100%;
    }

    body {
        font-family: 'Segoe UI';
        color: #505050;
        background-color: #fafafa;
    }

    .grid {
        width: 75%;
        min-width: 800px;
        margin: 0 auto;
    }
</style>

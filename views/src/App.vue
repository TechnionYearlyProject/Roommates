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
    body {
        background-color: #f3f3f3;
        font-family: 'Segoe UI';
        color: #505050;
    }

    .grid {
        width: 75%;
        min-width: 800px;
        margin: 0 auto;
    }
</style>

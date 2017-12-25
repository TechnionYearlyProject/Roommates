<template>
    <header>
        <div id="top-bar">
                    <span id="top-bar-links">
                        <router-link :to="{ name: 'sign-in-page' }">Sign in / Sign up</router-link>
                    </span>

            <div id="logo">
                <router-link :to="{ name: 'main-page' }">R<span>oo</span>mmates</router-link>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "header"
    }
</script>

<style scoped>
    header {
        font-size: 16px;
        background-color: #f3f3f3;
        padding-bottom: 5px;
    }

    #top-bar {
        padding: 0 15px;
        min-width: 800px;
    }

    #top-bar-links {
        float: left;
        width: 0;
        white-space: nowrap;
        z-index: 2;
        margin-top: 25px;
    }

    #top-bar-links a {
        color: #c72d2d;
        text-decoration: none;
    }

    #logo {
        text-align: center;
    }

    #logo a {
        font-size: 48px;
        font-weight: 800;
        letter-spacing: -4px;
        color: #c72d2d;
        font-family: arial;
        text-decoration: none;
    }

    #logo span {
        letter-spacing: -10px;
        display: inline-block;
    }

    #logo span:after {
        content: '-';
        display: inline-block;
        color: transparent;
        font-size: 48px;
    }
</style>
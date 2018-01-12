<template>
    <div id="search-results">
        <transition name="slide-fade" mode="out-in">
            <h1 v-if="value instanceof Array && value.length === 0">No Results</h1>
            <transition-group v-else-if="value instanceof Array" name="results-list" tag="ul">
                <single-result v-for="(apartment, index) in value" :key="index"
                               :apartment="apartment" />
            </transition-group>
        </transition>
    </div>
</template>

<script>
    import SingleResult from "@/components/search-results/SingleResult";

    export default {
        name: "search-results",
        props: ['value'],
        components: {
            SingleResult
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        text-transform: uppercase;
        color: #7d7d7d;
        padding-top: 20px;
        padding-left: 15px;
        letter-spacing: 8px;
        font-size: 35px;
    }
    
    ul {
        margin: 0;
        padding: 0;
    }

    li:not(:first-child) {
        margin-top: 30px;
    }

    #search-results {
        margin-top: 75px;
    }

    .slide-fade-enter-active {
        transition: all 1s ease;
    }

    .slide-fade-leave-active {
        transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(-50px);
        opacity: 0;
        height: 0;
    }

    .results-list-move {
        transition: transform 1s;
    }
</style>
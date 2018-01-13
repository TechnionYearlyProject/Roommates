<template>
    <div class="grid">
        <search-section @newResults="onNewResults" />
        <search-results v-model="apartments" />
    </div>
</template>

<script>
    import SearchSection from '@/components/search-section/SearchSection';
    import SearchResults from '@/components/search-results/SearchResults'

    export default {
        name: "main-page",
        components: {
            SearchSection, SearchResults
        },
        data() {
            return {
                apartments: null
            };
        },
        methods: {
            onNewResults(results) {
                this.apartments = results;
            }
        }
    }
</script>

<style scoped>

</style>
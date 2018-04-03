<template>
    <div class="grid">
        <search-section/>
        <search-results/>
    </div>
</template>

<script>
    import SearchSection from '@/components/search-section/SearchSection';
    import SearchResults from '@/components/search-results/SearchResults'

    export default {
        name: "main-page",
        components: {
            SearchSection, SearchResults
        }
    }
</script>

<style scoped>

</style>
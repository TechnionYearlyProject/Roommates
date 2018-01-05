<template>
    <div class="grid">
        <search-section />
        <search-resuls />
    </div>
</template>

<script>
    import SearchSection from '@/components/search-section/SearchSection';
    import SearchResuls from '@/components/search-results/SearchResults'

    export default {
        name: "main-page",
        components: {
            SearchSection, SearchResuls
        }
    }
</script>

<style scoped>

</style>
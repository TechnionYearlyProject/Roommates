<template>
    <div id="search-results">
        <ul>
            <single-result id="123"
                           address="address super duper shmuper"
                           description="Great place, we love it"
                           :price="1250"
                           :bedrooms="4"
                           :floor="5"
                           :bathrooms="2" />
        </ul>
    </div>
</template>

<script>
    import SingleResult from "@/components/search-results/SingleResult";

    export default {
        name: "search-results",
        components: {
            SingleResult
        }
    }
</script>

<style scoped>
    ul {
        margin: 0;
        padding: 0;
    }

    li:not(:first-child) {
        margin-top: 20px;
    }

    #search-results {
        margin-top: 75px;
    }
</style>
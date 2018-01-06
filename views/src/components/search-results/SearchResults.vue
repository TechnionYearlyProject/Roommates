<template>
    <div id="search-results">
        <ul>
            <single-result id="123"
                           address="address super duper shmuper"
                           description="Lorem ipsum dolor sit amet, aliquip civibus repudiare pro et, mel modus efficiantur id, posse altera explicari mei et. No his justo decore disputando, eos debitis molestie assentior in, quaestio antiopam cu nec. Mei nulla munere invenire te, mel falli salutandi euripidis ex. Dolor regione expetenda cu vel. Sed mollis regione atomorum at. Nibh oratio graeco cu mel, in elaboraret comprehensam his."
                           :price="1250"
                           :bedrooms="4"
                           :floor="5"
                           :bathrooms="2"
                           :images="3" />
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
        margin-top: 30px;
    }

    #search-results {
        margin-top: 75px;
    }
</style>
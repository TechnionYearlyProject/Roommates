<template>
    <v-footer height="auto" class="primary darken-1">
        <v-layout row wrap justify-center>
            <v-btn color="white" flat v-for="(link, i) in links" :key="`link-${i}`" @click="$router.push({name: link.ref})">
                {{ link.title }}
            </v-btn>
            <v-flex xs12 py-3 text-xs-center white--text>
                &copy;2018 —
                <strong>Roommates</strong>
            </v-flex>
        </v-layout>
    </v-footer>
</template>

<script>
    export default {
      data: () => ({
        links: [
            {
                title: 'Home',
                ref: 'AppMain'
            },
            {
                title: 'Reviews',
                ref: 'AppReviews'
            },
            {
                title: 'About Us',
                ref: 'AppAboutUs'
            }
        ]
      })
    };
</script>

<style>

</style>

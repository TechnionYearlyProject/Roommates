<template>
    <div class="grid">
        <search-box></search-box>

        <div id="search-results">
            <ul>
                <apartment-search-item
                    v-for="(apartment, index) in apartments"
                    :apartment="apartment"
                    :index="index"
                    :key="index"
                ></apartment-search-item>
            </ul>
        </div>

        <div id="search-results-pagination">
            <pagination
                :start="1"
                :end="5"
                :current="2"
            ></pagination>
        </div>
    </div>
</template>

<script>
    import SearchBox from './SearchBox';
    import ApartmentSearchItem from './ApartmentSearchItem'
    import Pagination from "./Pagination";

    export default {
        name: "main-page",
        components: {
            SearchBox,
            ApartmentSearchItem,
            Pagination
        },
        data() {
            return {
                apartments: [
                    {
                        id: 1,
                        address: 'Somewhere over the Rainbow',
                        description: 'Lorem ipsum dolor sit amet, habemus vivendo mei te, et eam ullum gloriatur.\n' +
                        'Vix quidam possim temporibus ne. Ex nam albucius vituperatoribus. Ad probo\n' +
                        'putant assentior mea, eos ei ferri volutpat gloriatur. No vix appetere\n' +
                        'legendos, ne per omnes offendit.',
                        price: 1200,
                        images: [
                            'Apartment-01.jpg',
                            'Apartment-02.jpg',
                            'Apartment-01.jpg'
                        ]
                    },
                    {
                        id: 2,
                        address: 'Somewhere in Nesher',
                        description: 'Lorem ipsum dolor sit amet, habemus vivendo mei te, et eam ullum gloriatur.\n' +
                        'Vix quidam possim temporibus ne. Ex nam albucius vituperatoribus. Ad probo\n' +
                        'putant assentior mea, eos ei ferri volutpat gloriatur. No vix appetere\n' +
                        'legendos, ne per omnes offendit.',
                        price: 1300,
                        images: [
                            'Apartment-02.jpg',
                            'Apartment-01.jpg',
                            'Apartment-02.jpg'
                        ]
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    #search-results {
        margin-top: 50px;
    }

    #search-results ul {
        margin: 0;
        padding: 0;
    }

    #search-results-pagination {
        margin-top: 20px;
        text-align: center;
    }
</style>
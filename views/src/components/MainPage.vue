<template>
    <div class="grid">
        <search-box></search-box>

        <div id="search-results">
            <ul>
                <ApartmentSearchItem v-for="(apartment, index) in apartments"
                    :apartment="apartment"
                    :index="index"
                ></ApartmentSearchItem>
            </ul>
        </div>

        <div id="search-results-pagination">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Prev</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SearchBox from './SearchBox';
    import ApartmentSearchItem from './ApartmentSearchItem'

    export default {
        name: "main-page",
        components: {
            SearchBox,
            ApartmentSearchItem
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

    #search-results > ul {
        margin: 0;
        padding: 0;
    }

    #search-results-pagination {
        margin-top: 20px;
        text-align: center;
    }

    #search-results-pagination .pagination {
        display: inline-flex;
    }

    #search-results-pagination a {
        color: #c72d2d;
    }

    #search-results-pagination .active a {
        background-color: #c72d2d;
        color: #fff;
        border: 1px solid #ddd;
    }
</style>
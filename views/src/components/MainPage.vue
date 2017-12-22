<template>
    <div class="grid">
        <search-box></search-box>

        <div id="search-results">
            <ul>
                <li v-for="(apartment, apartmentIndex) in apartments">
                    <div class="apartment-details">
                        <h3 class="apartment-address">
                            <router-link :to="{ name: 'apartment-page', params: { id: apartment.id } }">{{ apartment.address }}</router-link>
                        </h3>
                        <p class="apartment-description">
                            {{ apartment.description }}
                        </p>

                        <div class="apartment-price">
                            {{ apartment.price }} <span class="currency">₪</span>
                        </div>
                    </div>

                    <div class="apartment-img-container">
                        <div :id="'carousel-' + apartmentIndex" class="carousel slide" data-ride="carousel">
                            <ul class="carousel-indicators">
                                <li v-for="(_, imageIndex) in apartment.images"
                                    :data-target="'#carousel-' + apartmentIndex"
                                    :data-slide-to="imageIndex"
                                    :class="{ active: imageIndex === 0 }"
                                ></li>
                            </ul>

                            <div class="carousel-inner">
                                <div v-for="(imageSrc, imageIndex) in apartment.images"
                                     :class="{ active: imageIndex === 0, 'carousel-item': true }">
                                    <img :src="'static/images/' + imageSrc" alt="" />
                                </div>
                            </div>

                            <a class="carousel-control-prev" :href="'#carousel-' + apartmentIndex" data-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </a>
                            <a class="carousel-control-next" :href="'#carousel-' + apartmentIndex" data-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </a>
                        </div>
                    </div>
                </li>
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
    import SearchBox from "./SearchBox";

    export default {
        name: "main-page",
        components: {
            SearchBox
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

    #search-results > ul > li {
        margin: 10px 0 0;
        padding: 0;
        display: flex;
        box-shadow: #c72d2d 0 0 1px;
        border-radius: 3px;
        border: solid 1px #c72d2d;
        height: 162px;
        overflow: hidden;
    }

    #search-results > ul > li {
    }

    #search-results li .apartment-details {
        flex: 1;
        padding: 10px;
        position: relative;
    }

    #search-results li .apartment-details h3 {
        margin: 0 0 5px;
        font-weight: bold;
    }

    #search-results li .apartment-details h3 a {
        color: #505050;
    }

    #search-results li .apartment-price {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 5px 4px 10px;
        color: #fff;
        background-color: #c72d2d;
        font-size: 20px;
        line-height: 1.2;
    }

    #search-results li .apartment-price .currency {
        font-size: 25px;
        margin-right: 5px;
        margin-top: -4px;
    }

    #search-results li .apartment-img-container {
        width: 260px;
        height: 160px;
        overflow: hidden;
        display: inline-block;
    }

    #search-results li .carousel {
        width: 260px;
        height: 160px;
    }

    #search-results li img {
        -webkit-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        -ms-transition: all 0.2s ease;
        -o-transition: all 0.2s ease;
        transition: all 0.2s ease;

        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);

        width: 260px;
        height: 160px;
        object-fit: cover;
    }

    #search-results li img:hover {
        -webkit-transform: scale(1.08);
        -moz-transform: scale(1.08);
        -ms-transform: scale(1.08);
        -o-transform: scale(1.08);
        transform: scale(1.08);
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
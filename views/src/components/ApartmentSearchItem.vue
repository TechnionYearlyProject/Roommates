<template>
    <li class="apartment">
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
            <b-carousel id="carousel1"
                        controls
                        indicators>
                <b-carousel-slide
                        v-for="image in apartment.images"
                        :img-src="'static/images/' + image" ></b-carousel-slide>
            </b-carousel>
        </div>
    </li>
</template>

<script>
    import bCarousel from 'bootstrap-vue/es/components/carousel/carousel'

    export default {
        name: "apartment-search-item",
        props: [ 'apartment', 'index' ],
        components: { bCarousel }
    }
</script>

<style scoped>
    li.apartment {
        margin: 10px 0 0;
        padding: 0;
        display: flex;
        box-shadow: #c72d2d 0 0 1px;
        border-radius: 3px;
        border: solid 1px #c72d2d;
        height: 162px;
        overflow: hidden;
        background-color: #fff;
    }

    .apartment-details {
        flex: 1;
        padding: 10px;
        position: relative;
    }

    .apartment-details h3 {
        margin: 0 0 5px;
        font-weight: bold;
    }

    .apartment-details h3 a {
        color: #505050;
    }

    .apartment-price {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 5px 4px 10px;
        color: #fff;
        background-color: #c72d2d;
        font-size: 20px;
        line-height: 1.2;
    }

    .apartment-price .currency {
        font-size: 25px;
        margin-right: 5px;
        margin-top: -4px;
    }

    .apartment-img-container {
        width: 260px;
        height: 160px;
        overflow: hidden;
        display: inline-block;
    }

    .carousel {
        width: 260px;
        height: 160px;
    }

    img {
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

    img:hover {
        -webkit-transform: scale(1.08);
        -moz-transform: scale(1.08);
        -ms-transform: scale(1.08);
        -o-transform: scale(1.08);
        transform: scale(1.08);
    }
</style>
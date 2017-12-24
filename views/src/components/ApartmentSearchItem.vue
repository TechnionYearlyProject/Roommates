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
            <div :id="'carousel-' + index" class="carousel slide" data-ride="carousel">
                <ul class="carousel-indicators">
                    <li v-for="(_, imageIndex) in apartment.images"
                        :data-target="'#carousel-' + index"
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

                <a class="carousel-control-prev" :href="'#carousel-' + index" data-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </a>
                <a class="carousel-control-next" :href="'#carousel-' + index" data-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </a>
            </div>
        </div>
    </li>
</template>

<script>
    export default {
        name: "apartment-search-item",
        props: [ 'apartment', 'index' ]
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
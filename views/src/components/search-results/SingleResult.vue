<template>
    <b-media tag="li" class="box">
        <b-carousel slot="aside" indicators controls>
            <b-carousel-slide img-src="https://technext.github.io/garo-estate/assets/img/demo/property-1.jpg" />
            <b-carousel-slide img-src="https://technext.github.io/garo-estate/assets/img/demo/property-2.jpg" />
            <b-carousel-slide img-src="https://technext.github.io/garo-estate/assets/img/demo/property-3.jpg" />
        </b-carousel>

        <b-container class="result-details h-100">
            <b-row no-gutters class="result-title">
                <b-col>
                    <b-link :to="{ name: 'apartment-page', params: { id: id }}">{{ address }}</b-link>
                    <price-tag v-model="price" class="result-price" />
                </b-col>
            </b-row>
            <b-row no-gutters>
                <b-col class="result-description">
                    {{ description }}
                </b-col>
            </b-row>
            <b-row no-gutters class="result-bottom-row">
                <b-col>
                    <b-badge variant="warning" v-b-popover.hover.top="'Bedrooms'">
                        <icon name="bed" scale="1.3" />
                        {{ bedrooms }}
                    </b-badge>
                    <b-badge variant="warning" v-b-popover.hover.top="'Floor'">
                        <icon name="building" scale="1.1" />
                        {{ floor }}
                    </b-badge>
                    <b-badge variant="warning" v-b-popover.hover.top="'Bathrooms'">
                        <icon name="bath" scale="1.1" />
                        {{ bathrooms }}
                    </b-badge>
                </b-col>
                <b-col cols="12" md="auto">
                    <b-button size="sm" variant="primary" :to="{ name: 'apartment-page', params: { id: id }}">More
                        Info
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </b-media>
</template>

<script>
    import bMedia from 'bootstrap-vue/es/components/media/media'
    import bCarousel from 'bootstrap-vue/es/components/carousel/carousel'
    import bCarouselSlide from 'bootstrap-vue/es/components/carousel/carousel-slide'
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bLink from 'bootstrap-vue/es/components/link/link'
    import bButton from 'bootstrap-vue/es/components/button/button'
    import bBadge from 'bootstrap-vue/es/components/badge/badge'
    import PriceTag from "@/components/search-results/PriceTag";
    import Icon from "vue-awesome/components/Icon";

    export default {
        name: "single-result",
        props: {
            id: String,
            address: String,
            description: String,
            price: Number,
            bedrooms: Number,
            floor: Number,
            bathrooms: Number
        },
        components: {
            Icon,
            bMedia, bCarousel, bCarouselSlide,
            bContainer, bRow, bCol, bLink, bButton, bBadge,
            PriceTag
        }
    }
</script>

<style scoped>
    li {
        position: relative;
    }

    a {
        color: #000;
        font-size: 20px;
        text-decoration: none;
        font-weight: 600;
        text-transform: uppercase;
    }

    .result-details {
        padding: 10px 0 0;
    }

    .row {
        margin: 0 10px;
    }

    .result-price {
        position: absolute;
        top: -36px;
        right: -25px;
    }

    .result-title {
        border-bottom: #ccc dotted 1px;
        padding: 0 0 5px;
    }

    .result-description {
        margin-top: 10px;
        height: 152px;
    }

    .result-bottom-row {
        margin-right: 0;
    }

    .badge {
        font-size: 22px;
        vertical-align: middle;
        color: #fff;
    }

    .result-bottom-row a {
        color: #fff;
        float: right;
    }
</style>
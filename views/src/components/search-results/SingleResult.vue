<template>
    <b-media tag="li" class="box">
        <b-carousel slot="aside" indicators controls class="search-result-carousel">
            <b-carousel-slide v-for="img in apartment.images" :key="i"
                              :img-src="img" />

            <b-carousel-slide v-if="apartment.images.length === 0" class="d-block img-fluid w-100"
                              img-src="/static/images/apartments/default/default.png" />
        </b-carousel>

        <b-container class="result-details h-100">
            <b-row no-gutters class="result-title">
                <b-col>
                    <b-link :to="{ name: 'apartment-page', params: { id: apartment._id, apartmentP: apartment }}">{{ `${this.apartment.location.address.street} ${this.apartment.location.address.number}, ${this.apartment.location.address.city}, ${this.apartment.location.address.state}` }}
                    </b-link>
                    <div class="result-price">
                        <price-tag v-model="apartment.price" />
                    </div>
                </b-col>
            </b-row>
            <b-row no-gutters>
                <b-col class="result-description">
                    {{ apartment.description }}
                </b-col>
            </b-row>
            <b-row no-gutters class="result-bottom-row">
                <b-col>
                    <b-badge variant="warning" v-b-popover.hover.top="'Rooms'">
                        <icon name="bed" scale="1.3" />
                        {{ apartment.numberOfRooms }}
                    </b-badge>
                    <b-badge variant="warning" v-b-popover.hover.top="'Floor'">
                        <icon name="building" scale="1.1" />
                        {{ apartment.floor }}
                    </b-badge>
                    <b-badge variant="warning" v-b-popover.hover.top="'Area'">
                        <icon name="home" scale="1.212" />
                        {{ apartment.area }}
                    </b-badge>
                </b-col>
                <b-col cols="auto">
                    <b-button size="sm" variant="primary"
                              :to="{ name: 'apartment-page', params: { id: apartment._id }}">
                        More Info
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
            apartment: Object
        },
        components: {
            Icon,
            bMedia, bCarousel, bCarouselSlide,
            bContainer, bRow, bCol, bLink, bButton, bBadge,
            PriceTag
        },
        data() {
            return {
                address: `${this.apartment.location.address.street} ${this.apartment.location.address.number}, ${this.apartment.location.address.city}, ${this.apartment.location.address.state}`
            };
        }
    }
</script>

<style scoped>
    li {
        position: relative;
        height: 250px;
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
        transform: scale(1.2);
    }

    .result-title {
        border-bottom: #ccc dotted 1px;
        padding: 0 0 5px;
    }

    .result-description {
        margin-top: 10px;
        height: 140px;
    }

    .result-bottom-row {
        margin-right: 0;
    }

    .badge {
        font-size: 22px;
        vertical-align: middle;
        color: #fff;
        margin-top: 10px;
        padding: 5px 10px;
    }

    .badge svg {
        margin-right: 5px;
    }

    .result-bottom-row a {
        color: #fff;
        padding: 10px;
    }
</style>

<style>
    .search-result-carousel img {
        height: 250px;
        width: 300px !important;
    }
</style>
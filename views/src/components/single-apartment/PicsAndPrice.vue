
<template>

<div class="w-100" style="background-color: #eee;">

    <b-card border-variant="warning" >
    <b-carousel id="carousel1"
                style="text-shadow: 1px 1px 2px #333;"
                controls
                indicators
                background="#ababab"
                :interval="4000"
                img-width="1024"
                img-height="480"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd">
        <b-carousel-slide v-for="img in images" :key="img" :img-src="img" />
    </b-carousel>
    <b-row>
        <b-col fluid>
            <h2>rent is {{rent}} per month</h2>
            <hr>
            <h5>Arnona {{arnona}} bi-monthly</h5>
            <h5>building upkeep {{buildingCommity}}</h5>
        </b-col>
    </b-row>
    </b-card>
</div>
</template>

<script>
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bImg from 'bootstrap-vue/es/components/image/img';
    import bCard from 'bootstrap-vue/es/components/card/card';
    import bCardHeader from 'bootstrap-vue/es/components/card/card';
    import bCardFooter from 'bootstrap-vue/es/components/card/card';
    import bCardImg from 'bootstrap-vue/es/components/card/card';
    import bCardGroup from 'bootstrap-vue/es/components/card/card';
    import bCarousel from 'bootstrap-vue/es/components/carousel/carousel';
    import bCarouselSlide from 'bootstrap-vue/es/components/carousel/carousel-slide';
export default {
        name: "pics-and-price",
        props:['city', 'street', 'buildingNum', 'entranceNum', 'images', 'rent', 'arnona', 'buildingCommity'],
        components:{
            bContainer, bRow, bCol, bImg, bCard, bCardGroup, bCardImg, bCardFooter, bCardHeader
        },
        methods: {
            onSlideStart(slide) {
                this.sliding = true
            },
            onSlideEnd(slide) {
                this.sliding = false
            },
        },
}
</script>



<style scoped>

</style>
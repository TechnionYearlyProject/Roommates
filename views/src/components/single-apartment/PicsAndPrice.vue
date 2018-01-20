
<template>

<div class="w-100" style="background-color: #eee;">

    <b-card border-variant="light" >
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
    <br>
    <b-row>
        <b-col align="start">
            <!-- <div class="w-100" style="background-color: #eee;"> -->
                <!-- <b-card border-variant="light" > -->
                    <h1>
                        {{city}}, {{street}},
                        {{buildingNum}}/{{entranceNum}}
                    </h1>
                <!-- </b-card> -->
            <!-- </div> -->
        </b-col>
        <b-col align="center">
            <h2>{{rent}}</h2>
            <!-- <hr> -->
            <!-- <h5>Arnona {{arnona}} bi-monthly</h5> -->
            <!-- <h5>Arnona 400 bi-monthly</h5> -->
            <!-- <h5>building upkeep {{buildingCommity}}</h5> -->
            <!-- <h5>building upkeep 55</h5> -->
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
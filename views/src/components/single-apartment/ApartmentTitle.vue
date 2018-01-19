<template>

    <div class="w-100 p-2" style="background-color: #eee;">
        <b-card border-variant="warning">
            <h1>
                {{city}}, {{street}},
                {{buildingNum}}/{{entranceNum}}
            </h1>
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
        name: "apartment-title",
        props:['city', 'street', 'buildingNum', 'entranceNum'],
        components:{
            bContainer, bRow, bCol, bImg, bCard, bCardGroup, bCardImg, bCardFooter, bCardHeader
        }
}
</script>



<style scoped>

</style>
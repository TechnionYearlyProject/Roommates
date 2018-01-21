
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
        <b-carousel-slide v-for="img in images" :key="img" :img-src="img" img-height="480" img-width="auto"/>
    </b-carousel>
    <br>
    <b-row >
        <b-col align="start">
            <h1>
                {{city}}, {{street}},
                {{buildingNum}}/{{entranceNum}}
            </h1>
        </b-col>
        <b-col align="end">
            <h2>{{rent}}
                <b-img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO0AAADUCAMAAABH5lTYAAAAdVBMVEUAAAD///9tbW2+vr4yMjI4ODjPz8/S0tKwsLD09PTj4+NOTk6enp78/Pz5+fnw8PDp6ekKCgqQkJDc3NxVVVVmZma3t7fHx8cRERGmpqZ/f39fX19ycnIgICCJiYklJSWZmZlERERRUVFAQEAYGBgtLS1aWlqqwsjfAAAFHklEQVR4nO3d6XqqMBAG4FA33FGL+9qq93+JR23taV2+mYBKJpn5HZJ5H1AS0Iwxz4zeeLtdVTazdN5vxaNa0o6eHk/12MZm3io1nokuGngjKtN4EI72FPvJM8RFq0D0pqOAtMeYV0PSHs7wuh6Q9hDzRkhaY9IHeYt2cGP+kOu5aAU/WkFpzS7/5Vw0wSrWQWlNsxOS1ph888mis7eOUlBaMwlKm+dWVHTqWSI7t+jMM0UclNZkXQcWnXfGSILSLoLSmjQorRkGpTVZFrxF55w9ZkFpTYbnr0WnnCPGQWkzrA+KzjhXhKW1Xh7kGKuSL8q71Xack/tCre1QN6NdT2qlyXLfy5SC7WKoaO1PdAbx3DqFlVTtKZJ4ZpeD5dLPLe0h2sN3ixwsFwfOaQ+RLPlJ2D1gdlF7+BD3uUnYfU+5qY2iespLomnVq6vaKBrxsrBa+LmrjTobThZWl7LD2iji3ICtvpWd1kbTB6fhtpZzdmsW3Tmujeiphs1CyHVttKDSeLfozHlt45F5OK+NWlQeFj8+cV8blYk8LJ6jC9DWiDyW/K4EaKnv5Q2/Jwla6uTye5KgjSo4kS67IxHaGCfCn02J0HZwIvxlkAgt8T3VZ/cjQzuBibyx+5GhHcBEPtn9yNDiNPmvNoVo8QeX/Wc4IVr8xJX9JE6IdggzYa+ChGjx1xR7eiFEi+cX7N+bCNFG8P0uezIlRQuX9Oyfm0jRwve67MeOUrTwOTr7f0JStPCVLvtZjRQtfPI45fYiRQtXQXNuL1K08PGFd1o4dQxLy17OS9GWVKtaGKpVrWpfGap1UjuoguC+nxOjhb/P5P7pX4z2TbWqVa1qVata1apWtapVrWpVq1rVqla1qlWtalWrWtWqVrWqVa1qVata1apWtapVrWpVq1rVElr2TnhStN1q7X6wC0JJ0T4mVKta1TJDtap9QahWtV5o20Fp6ygTohoGdwx3tAnKhKh5wh3DHS3cr5fYupg7hjtauG/TzjctLApAbAjKHcMdLdxYoembFm6IQlSv4Y7hjhZu7QPTlKiFp4+ojcAdwx0t3ICMKFvDHcMdLeQQu8lzx3BGi4sBEJs0cwdxRou3wCQq9HAHcUaLC2jhDTLlaXHhg65fWrjeM4ZY/HJHcUWLP7aGeLDBHcUV7R5qmn5piQt56peWmD1M/NJijBl5pcVFAIxJvNISWEO14I7jhJYqRNr0SUtMC0/VO/zRkpXfSh5piacw5lRjyBctWfbtVADbEy38rdVXHPeb9kPLKaR7TMMLLbH0+Ypj+WsftKwK2B/HlvK1XVZ95K9iFuK11OT4HKeSO8K1JXJO8R2nC1m2dkhVG/0fQ+HaAbUKuCERqq31tzbWcykLedpk1CfeOt+Ixsu07LJNMDrdQTVev/FuN5dxLnz9Au2qnC92q4XdZXsd1ddpi4/NOU/czBPt+dQGof34yRO380P7v3IhbueF9lfZKNzQC+2vgqO4oQ/a35Mb3NID7Z8/AOKmHmj/FM7FTeVr//7bEbcVr70oNoobS9de1izErYVrZ5d54uaytc2rPHF70dprrMfaq8vYZ+3Noqr4ELna25Wf8TFitXcKtuODhGrfO3fyxIfJ1N6v1o6Pk6hN6/fzxEfK05arKE98rDTtgngvgY+WpS2T72Dw8ZK06Z27jofayuTeTcc7bbOVMPPE/bivLS9HrLMqXjuetUbg3uqNdpX245olVIy2N94uyp/7dL5cT0rVRhbmd/wDoKJ9MzId4cgAAAAASUVORK5CYII="
                height="20" width="auto"/>
            </h2>
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
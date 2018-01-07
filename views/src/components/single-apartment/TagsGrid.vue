<template>
        <b-container>
            <b-row>
                <b-col>
                    <b-img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png"
                        ></b-img>
                    <span class="property-info-label"><br>Area<br></span>
                    <span class="property-info-value">{{area}}<br><b><small> Sq meters</small></b></span>
                </b-col>
                <b-col>
                    <b-img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAADSCAMAAAASe47+AAAABlBMVEX////mjAhhQCAZAAADvklEQVR4nO3YwXbjMAxD0eT/f3p2c5pGtEgIgmgXXKq2n26dukleL4/H4/F4luf9fx7YfH/O5po4+f6ejbWoqStt9wmTw9RenzAZpHb6hMkwJf5j2JO8SJ3gsZtXKe3f+o7kZeoEj9u8TmkfZfzkJGVe6+YB3iyp5Gn/z5rXt3Ug+cd5xFQ2eXPew/8xSN8o/WkeNXWk2Y0nbJFTR5q9eMIYP3UkKdeJk3KdOKnGyZty3VdTF9tcGjVlSY+nwwyfzvInzJaZ0vjGfHI1WilxgLXiWlVXgnELXVloDQdmZaFlHdJVdSi6elfV4eiqXVGGhSuGRRkmrxLW8ii6QliUoeoKYU2FzcuWNRW6zjw9jwKrlDUV8/aENZVTPFHGvC1dUebGPNHbWySr6gS9wg6+z5b9NlFeZQcIj2FLhXrwMrXhabfgpXLjXwvMy/oAXmbnu3lJHYkHhXrevcS+k7y0DwpqeSsPl8M8sNSRl9h1mod9NdCTt/DqPMuDU/14iT0XeEnfLXj47TvGq6RuwEvsuMRDvrjS8rKl8dGteZVScHgnXma/pVh7XjYUHd+YVwmFJ/ThZXZbrDXnZTvxGW15lc7FKV14mb2Wc6152czV3prwEjtFegkf3lXzoIfL4PB8bYGXRl0Fe9y9xD6x4NyHh5d42cjsvIfxqq/O6QUKsbyOxpv58LKeB7w68fIKL9uYJs/zEntMT/n24ekFXjYxao628SBezTc/PZ/K6h7OyxbG0dE+2vCWbl799uHxm/LInxi+z8pjxtXRRprcvcWbV/7PjtdRXsGCV2W81+9DSpp59lIn5lWun8ye5v04alCsz+CSZ3mvnz+GWZ+VSVHKi4PApCoc3tdzY79uwVfawPjsbrzX7/NqlWpVznv9Oq1YKUYJPMxX3cHn8UJdlTffwWiRdnGtb3w1ToOj4/Iul83j81Z8G3ksnXm35i349vF4OvPSu3gWL7jUeoGoW/CZBwWoOtxnnnm7dbDPPPO261CfeT14pG97GLwdOvNUvGwsXmTNw3n7Pu9lW757vKJ5vFi8yBrzzANj8SJrzDMPjMWLrDHPPDAWL7Lm4Tx/YjAPjMWLrDHPPDAWL7LGPPPAWLzImofz/K7FPDAWL7LGPPPAWLzIGvPMA2PxImvMMw+MxYu0eTbv4XfPPPPAWLzIGvPMA2PxImvMuzPP71rMA2PxImvMMw+MxYu0Me/5PGGLkwqSk2VqbGvqMhmsUluT1R3N2U62t2il0dXnq7RWYpXcTC5TYsNVcsnj8dx7/gFpPkqNxWPGRAAAAABJRU5ErkJggg=="
                        style="width:30px;height:30px"></b-img>
                    <span class="property-info-label"><br>toilets<br></span>
                    <span class="property-info-value">{{toilets}}<br><b><small></small></b></span>
                </b-col>
                <b-col>
                    <b-img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png"
                        ></b-img>
                    <span class="property-info-label"><br>Garages<br></span>
                    <span class="property-info-value">{{garages}}</span>
                </b-col>
                <b-col>
                    <b-img src="data:image/png;base64,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"
                        style="width:30px;height:30px"></b-img>
                    <span> <br> gas connection <br></span>
                    <span>{{gas}}</span>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-img src="https://technext.github.io/garo-estate/assets/img/icon/bed-orange.png"
                        ></b-img>
                    <span class="property-info-label"><br>Bedrooms<br></span>
                    <span class="property-info-value">{{bedrooms}}</span>
                </b-col>
                <b-col>
                    <b-img src="https://technext.github.io/garo-estate/assets/img/icon/os-orange.png"
                        ></b-img>
                    <span class="property-info-label"><br>parking places<br></span>
                    <span class="property-info-value">{{parking}}</span>
                </b-col>
                <b-col>
                    <b-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbCfM3kBuqTyc23wOCrHbH2ifq8X4Pg9NghH1RqqygAtCJuaEW"
                        style="width:30px;height:30px"></b-img>
                    <span class="property-info-label"><br>pets<br></span>
                    <span class="property-info-value">{{pets}}</span>
                </b-col>
                <b-col></b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-img src="https://technext.github.io/garo-estate/assets/img/icon/shawer-orange.png"
                        ></b-img>
                    <span class="property-info-label"><br>showers<br></span>
                    <span class="property-info-value">{{showers}}</span>
                </b-col>
                <b-col>
                    <b-img src="data:image/png;base64,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"
                        style="width:30px;height:30px"></b-img>
                    <span class="property-info-label"><br>hot_water<br></span>
                    <span class="property-info-value"><img src="waterHeaterMethod" alt=""></span>
                </b-col>
                <b-col>
                    <b-img src="data:image/png;base64,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"
                        style="width:30px;height:30px"></b-img>
                    <span class="property-info-label"><br>elevator<br></span>
                    <span class="property-info-value">{{elevator}}</span>
                </b-col>
                <b-col></b-col>
            </b-row>
        </b-container>
        

</template>

<script>
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bImg from 'bootstrap-vue/es/components/image/img';

    export default {
        name: "tags-grid",
        props: ['area','toilets','garages','bedrooms','parking','pets','showers','waterHeaterMethod','elevator','gas'],
        components: {
            bContainer, bRow, bCol, bImg
        }
    }
</script>

<style scoped>
    #header {
        border-bottom: #ddd solid 1px;
        padding: 10px 0;
        margin-bottom: 15px;
    }

    #logo {
        font-size: 20px;
        text-transform: uppercase;
        border: #fdc600 solid 3px;
        color: #000;
        display: inline-block;
        padding: 0 10px;
        font-weight: 500;
        position: relative;
        text-decoration: none;
    }

    #logo::before, #logo::after {
        content: '';
        display: inline-block;
        position: absolute;
        width: 55px;
        height: 3px;
        background-color: #fff;
    }

    #logo::before {
        right: 15px;
        top: -3px;
    }

    #logo::after {
        left: 15px;
        bottom: -3px;
    }

    #logo::first-letter {
        font-size: 28px;
        color: #fdc600;
    }

    button:first-of-type {
        text-transform: uppercase;
    }
</style>
<template>
    <div class="w-100">
        <b-card border-variant="warning" fluid >
            <b-container>

                <b-row no-gutters v-for="rowIndex in Math.ceil(symbals.length / 4)" :key="rowIndex">
                    <b-col v-for="colIndex in 4" :key="colIndex"
                           v-if="(index = (rowIndex - 1) * 4 + colIndex - 1) < symbals.length">
                        <icon :name="symbals[index].vicon" scale="1.6"/>
                        <span>{{symbals[index].name}}</span>
                    </b-col>
                    <br><br><br>
                </b-row>
                <b-row no-gutters v-for="rowIndex in Math.ceil(apartmentTags.length / 4)" :key="rowIndex">
                    <b-col v-for="colIndex in 4" :key="colIndex"
                           v-if="(index = (rowIndex - 1) * 4 + colIndex - 1) < apartmentTags.length">
                        <icon :name="apartmentTags[index].vicon" scale="1.6"/>
                        <span>{{apartmentTags[index].name}}</span>
                    </b-col>
                    <br><br><br>
                </b-row>
            </b-container>
        </b-card>
    </div>
</template>

<script>
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bImg from 'bootstrap-vue/es/components/image/img';
    import Icon from 'vue-awesome/components/Icon'
    import bCard from 'bootstrap-vue/es/components/card/card';
   
   
    import Tags from '@/../static/js/tags'
    
    export default {
        name: "tags-grid",
        props: ['apartmentTags'],
        components: {
            bContainer, bRow, bCol, bImg, Icon, bCard
        },
        data(){
            return{
                symbals: Tags
            }
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
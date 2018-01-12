<template>
    <b-form action="#" @submit="onSubmit">
        <b-container class="box">
            <b-row>
                <b-col class="location-col">
                    <search-box v-model="fields.location" />
                </b-col>
            </b-row>
            <b-row class="ranges-row">
                <b-col v-for="(range, _, index) in fields.ranges" :key="index">
                    <range-selector :label="range.label" :interval="range.interval"
                                    v-model="range.value"
                                    :min="range.lowerBound" :max="range.upperBound" />
                </b-col>
            </b-row>
            <b-row class="more-options">
                <b-col>
                    <span>More Options</span>
                </b-col>
            </b-row>
            <b-form-check-box-group v-model="fields.selectedBinaryProps" class="binary-properties">
                <b-row v-for="rowIndex in Math.ceil(binaryProps.length / 4)" :key="rowIndex">
                    <b-col v-for="colIndex in 4" :key="colIndex"
                           v-if="(index = (rowIndex - 1) * 4 + colIndex - 1) < binaryProps.length">
                        <b-form-checkbox style="vertical-align: middle" :value="binaryProps[index].key"
                                         class="bin-prop-checkbox">
                            <icon :name="binaryProps[index].vicon" scale="1.4" />
                            <span class="binary-property-text">{{ binaryProps[index].name }}</span>
                        </b-form-checkbox>
                    </b-col>
                </b-row>
            </b-form-check-box-group>
            <b-row>
                <b-col class="search-button-col">
                    <search-button class="search-button" />
                </b-col>
            </b-row>
        </b-container>

        <!-- Google Maps Pop-up -->
        <b-modal id="google-maps-modal" size="lg" @shown="onModalShow"
                 title="Pick a location in the map:" @ok="onModalOK">
            <g-map-picker v-model="pickerLocation" />
        </b-modal>
    </b-form>
</template>

<script>
    import Vue from 'vue'
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bForm from 'bootstrap-vue/es/components/form/form'
    import bFormCheckBoxGroup from 'bootstrap-vue/es/components/form-checkbox/form-checkbox-group'
    import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
    import bModal from 'bootstrap-vue/es/components/modal/modal'
    import SearchBox from './SearchBox'
    import RangeSelector from "./RangeSelector"
    import SearchButton from "@/components/search-section/SearchButton"
    import GMapPicker from "@/components/gmap-picker/GMapPicker"
    import Icon from 'vue-awesome/components/Icon'

    import Tags from '@/../static/js/tags'

    const defaultLocation = {
        name: 'Technion - Israel Institute of Technology, Haifa, Israel',
        lat: 32.7767783,
        lng: 35.02312710000001
    };

    export default {
        name: "search-section",
        components: {
            bContainer, bRow, bCol,
            bForm, bFormCheckBoxGroup, bFormCheckbox, bModal,
            SearchBox, RangeSelector, SearchButton,
            GMapPicker, Icon
        },
        data() {
            return {
                fields: {
                    location: defaultLocation,
                    ranges: {
                        price: {
                            label: 'Price',
                            lowerBound: 0,
                            upperBound: 1000,
                            interval: 100,
                            value: {
                                min: 0,
                                max: 1000
                            }
                        },
                        bathrooms: {
                            label: 'Bathrooms',
                            lowerBound: 1,
                            upperBound: 3,
                            interval: 1,
                            value: {
                                min: 1,
                                max: 3
                            }
                        },
                        bedrooms: {
                            label: 'Bedrooms',
                            lowerBound: 1,
                            upperBound: 5,
                            interval: 1,
                            value: {
                                min: 1,
                                max: 5
                            }
                        },
                        floor: {
                            label: 'Floor',
                            lowerBound: -1,
                            upperBound: 12,
                            interval: 1,
                            value: {
                                min: -1,
                                max: 12
                            }
                        }
                    },
                    selectedBinaryProps: []
                },
                pickerLocation: defaultLocation,
                binaryProps: Tags
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();

                console.log({
                    location: {
                        lat: this.fields.location.lat,
                        lng: this.fields.location.lng
                    },
                    minPrice: this.fields.ranges.price.value.min,
                    maxPrice: this.fields.ranges.price.value.max,
                    minBathrooms: this.fields.ranges.bathrooms.value.min,
                    maxBathrooms: this.fields.ranges.bathrooms.value.max,
                    minBedrooms: this.fields.ranges.bedrooms.value.min,
                    maxBedrooms: this.fields.ranges.bedrooms.value.max,
                    minFloor: this.fields.ranges.floor.value.min,
                    maxFloor: this.fields.ranges.floor.value.max,
                    selected: this.fields.selectedBinaryProps
                });

                //this.$emit('newResults', []);
                this.$emit('newResults', [
                    {
                        id: '123',
                        address: 'Super Duper Address',
                        description: 'Lorem ipsum dolor sit amet, aliquip civibus repudiare pro et, mel modus efficiantur id, posse altera explicari mei et. No his justo decore disputando, eos debitis molestie assentior in, quaestio antiopam cu nec. Mei nulla munere invenire te, mel falli salutandi euripidis ex. Dolor regione expetenda cu vel. Sed mollis regione atomorum at. Nibh oratio graeco cu mel, in elaboraret comprehensam his.',
                        price: 1100,
                        bedrooms: 3,
                        floor: 2,
                        bathrooms: 1,
                        images: 3
                    },
                    {
                        id: '123',
                        address: 'Super Duper Address',
                        description: 'Lorem ipsum dolor sit amet, aliquip civibus repudiare pro et, mel modus efficiantur id, posse altera explicari mei et. No his justo decore disputando, eos debitis molestie assentior in, quaestio antiopam cu nec. Mei nulla munere invenire te, mel falli salutandi euripidis ex. Dolor regione expetenda cu vel. Sed mollis regione atomorum at. Nibh oratio graeco cu mel, in elaboraret comprehensam his.',
                        price: 1100,
                        bedrooms: 3,
                        floor: 2,
                        bathrooms: 1,
                        images: 3
                    }
                ]);
            },
            onModalShow() {
                Vue.$gmapDefaultResizeBus.$emit('resize');
            },
            onModalOK() {
                this.fields.location = this.pickerLocation;
            }
        }
    }
</script>

<style scoped>
    .container {
        background: #fff;
        padding: 20px 0;
        min-width: 900px;
    }

    .row {
        margin: 0 40px;
        padding: 0 10px;
    }

    .location-col {
        padding: 0 25%;
    }

    .ranges-row {
        margin-top: 45px;
    }

    .more-options {
        margin: 40px 0 20px;
        text-align: center;
    }

    .more-options span {
        display: inline-block;
        padding: 0 15px;
        background-color: #fff;
        font-size: 22px;
        color: #bbb;
        text-transform: uppercase;
    }

    .more-options::before {
        content: '';
        height: 1px;
        width: 100%;
        border-bottom: #ccc dashed 1px;
        position: relative;
        bottom: -18px;
    }

    .search-button-col {
        text-align: center;
        margin-top: 10px;
    }

    .search-button {
        margin-bottom: -60px;
    }

    .binary-properties {
        margin-top: 10px;
    }

    .binary-property-text {
        vertical-align: super;
        display: inline-block;
        margin-left: 3px;
    }
</style>
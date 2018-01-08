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
                        <b-form-checkbox :value="binaryProps[index].value" class="bin-prop-checkbox">
                            {{ binaryProps[index].text }}
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
                 title="Pick a location in the map:">
            <g-map-picker />
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

    export default {
        name: "search-section",
        components: {
            bContainer, bRow, bCol,
            bForm, bFormCheckBoxGroup, bFormCheckbox, bModal,
            SearchBox, RangeSelector, SearchButton,
            GMapPicker
        },
        data() {
            return {
                fields: {
                    location: '',
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
                binaryProps: [
                    { text: 'Kosher Kitchen', value: 'kosher' },
                    { text: 'Elevator', value: 'elevator' },
                    { text: 'Air Conditioning', value: 'air-conditioning' },
                    { text: 'Laundry Room', value: 'laundry' },
                    { text: 'TV', value: 'tv' },
                    { text: 'Furnished', value: 'furnished' },
                    { text: 'Balcony', value: 'balcony' },
                    { text: 'High Ceiling', value: 'high-ceiling' }
                ]
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();

                console.log({
                    location: this.fields.location,
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
            },
            onModalShow() {
                Vue.$gmapDefaultResizeBus.$emit('resize');
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
</style>
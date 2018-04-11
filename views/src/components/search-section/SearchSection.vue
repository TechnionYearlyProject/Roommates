<template>
    <b-form action="#" @submit="onSubmit">
        <b-container class="box">
            <b-row>
                <b-col class="text-input-col">
                    <span class="input-label">WHERE:</span>
                    <search-box v-model="fields.location" class="input-box" />
                </b-col>
            </b-row>
            <b-row>
                <b-col class="text-input-col">
                    <span class="input-label">WHEN:</span>
                    <div class="input-box">
                        <date-picker v-model="fields.latestEntranceDate" bootstrapStyling
                                     format="MMMM dsu yyyy (D)"
                                     placeholder="Pick Latest Wanted Entrance Date"
                                     calendarClass="date-calendar"
                                     inputClass="date-input"
                        />
                    </div>
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
                <b-row no-gutters v-for="rowIndex in Math.ceil(binaryProps.length / 4)" :key="rowIndex">
                    <b-col v-for="colIndex in 4" :key="colIndex"
                           v-if="(index = (rowIndex - 1) * 4 + colIndex - 1) < binaryProps.length">
                        <b-form-checkbox style="vertical-align: middle" :value="binaryProps[index].key"
                                         class="bin-prop-checkbox">
                            <icon :name="binaryProps[index].vicon" scale="1.6" />
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
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
    import bFormCheckBoxGroup from 'bootstrap-vue/es/components/form-checkbox/form-checkbox-group'
    import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
    import bModal from 'bootstrap-vue/es/components/modal/modal'
    import DatePicker from 'vuejs-datepicker'
    import SearchBox from './SearchBox'
    import RangeSelector from "./RangeSelector"
    import SearchButton from "@/components/search-section/SearchButton"
    import GMapPicker from "@/components/gmap-picker/GMapPicker"
    import Icon from 'vue-awesome/components/Icon'

    import Tags from '@/../static/js/tags'
    import { LOAD_APARTMENTS } from '@/vuex/constant-mutations';

    const defaultLocation = {
        name: 'Technion - Israel Institute of Technology, Haifa, Israel',
        lat: 32.7767783,
        lng: 35.02312710000001
    };

    export default {
        name: "search-section",
        components: {
            bContainer, bRow, bCol,
            bForm, bFormInput, bFormCheckBoxGroup, bFormCheckbox, bModal,
            DatePicker,
            SearchBox, RangeSelector, SearchButton,
            GMapPicker, Icon
        },
        data() {
            return {
                fields: {
                    location: defaultLocation,
                    latestEntranceDate: '',
                    ranges: {
                        price: {
                            label: 'Price (₪)',
                            lowerBound: 0,
                            upperBound: 1300,
                            interval: 100,
                            value: {
                                min: 0,
                                max: 1300
                            }
                        },
                        radius: {
                            label: 'Max Distance (km)',
                            lowerBound: 0,
                            upperBound: 3,
                            interval: 0.25,
                            value: 1.5
                        },
                        roommates: {
                            label: 'Roommates',
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
                let that = this;
                this.$http.get('apartments', {
                    params: {
                        latitude: this.fields.location.lat,
                        longitude: this.fields.location.lng,
                        minPrice: this.fields.ranges.price.value.min,
                        maxPrice: this.fields.ranges.price.value.max,
                        radius: this.fields.ranges.radius.value,
                        minRoommates: this.fields.ranges.roommates.value.min,
                        maxRoommates: this.fields.ranges.roommates.value.max,
                        minFloor: this.fields.ranges.floor.value.min,
                        maxFloor: this.fields.ranges.floor.value.max,
                        latestEntranceDate:this.getLastEntranceDateFilter(),
                        tags: this.fields.selectedBinaryProps
                    }
                }).then(payload => this.$store.commit(LOAD_APARTMENTS, payload.body.results))
                    .catch(e => console.error(e));
            },
            getLastEntranceDateFilter() {
                try{
                	return this.fields.latestEntranceDate.getTime();
                }catch(e){
                	return null;
                }
            },
            onModalShow() {
                Vue.$gmapDefaultResizeBus.$emit('resize');

                this.pickerLocation = this.fields.location;
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

    .text-input-col {
        padding: 0 25%;
        display: flex;
        margin-bottom: 15px;
    }

    .input-label {
        width: 55px;
        padding-top: 8px;
        text-align: right;
        color: #bbb;
    }

    .input-box {
        margin-left: 10px;
        flex: 1;
    }

    .ranges-row {
        margin-top: 25px;
    }

    .more-options {
        margin: 30px 0;
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
    }
</style>

<style>
    .date-input {
        border-radius: 0;
        background-color: #fff !important;
        font-size: 16px;
        height: 40px;
    }

    .date-calendar {
        width: 100% !important;
    }
</style>
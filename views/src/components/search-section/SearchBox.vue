<template>
    <div class="search-box">
        <gmap-auto-complete class="form-control"
                            placeholder="Enter Location"
                            v-model="value.name"
                            @place_changed="onPlaceChange" />
        <span>OR</span>
        <b-button variant="primary" v-b-modal.google-maps-modal
                  v-b-popover.hover.right="'Find in the map'">
            <icon label="Find in the map">
                <icon name="map-o" scale="1.74" />
                <g transform="translate(0, -5)">
                    <icon name="map-marker" scale="1" />
                </g>
            </icon>
        </b-button>
    </div>
</template>

<script>
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
    import bInputGroup from 'bootstrap-vue/es/components/input-group/input-group'
    import bInputGroupAddon from 'bootstrap-vue/es/components/input-group/input-group-addon'
    import bButton from 'bootstrap-vue/es/components/button/button'
    import Icon from 'vue-awesome/components/Icon'
    import GmapAutoComplete from 'vue2-google-maps/src/components/autocomplete'

    export default {
        name: "search-box",
        components: {
            Icon,
            bFormInput,
            bInputGroup, bInputGroupAddon,
            bButton, GmapAutoComplete
        },
        props: ['value'],
        data() {
            return {};
        },
        methods: {
            onPlaceChange(place) {
                this.$emit('input', {
                    name: place.name,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
            }
        }
    }
</script>

<style scoped>
    .search-box {
        display: flex;
        height: 40px;
    }

    .search-box > * {
        vertical-align: middle;
    }

    input {
        border-radius: 0;
    }

    span {
        display: inline-block;
        margin: 0 20px;
        padding-top: 9px;
        font-size: 15px;
    }

    button {
        cursor: pointer;
        background-color: #fdc600;
    }
</style>
<template>
    <div class="search-box">
        <b-form-input :value="value"
                      placeholder="Enter Location"
                      @input="updateValue"
                      type="text" />
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
    import Icon from "vue-awesome/components/Icon"

    export default {
        name: "search-box",
        components: {
            Icon,
            bFormInput,
            bInputGroup, bInputGroupAddon,
            bButton
        },
        props: ['value'],
        data() {
            return {}
        },
        methods: {
            updateValue(val) {
                this.$emit('input', val);
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
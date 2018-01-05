<template>
    <b-input-group>
        <b-form-input :value="value"
                      placeholder="Enter Location"
                      @input="updateValue"
                      type="text" />
        <b-input-group-addon @click="mapsClick" class="pointer" v-b-popover.hover.right="'Find in the map'">
            <icon label="No Photos">
                <icon name="map-o" scale="1.74" />
                <icon name="map-pin" scale="0.8" />
            </icon>
        </b-input-group-addon>
    </b-input-group>
</template>

<script>
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
    import bInputGroup from 'bootstrap-vue/es/components/input-group/input-group'
    import bInputGroupAddon from 'bootstrap-vue/es/components/input-group/input-group-addon'
    import bButton from 'bootstrap-vue/es/components/button/button'
    import Icon from "vue-awesome/components/Icon";

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
            mapsClick() {
                alert('This should open google maps');
            },
            updateValue(val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style scoped>
    .pointer {
        cursor: pointer;
        background-color: #fdc600;
    }

    .form-control:focus + .pointer {
        border-color: #fdc600;
    }

    input {
        border-radius: 0;
    }
</style>
<template>
    <div>
        <b-form-group :label="`${label}:`"
                      label-for="input-range">
            <vue-slider ref="slider"
                        v-model="computedVal"
                        :min="min" :max="max"
                        :interval="interval"
                        :process-style="processStyle"
                        :bg-style="bgStyle"
                        :tooltip-style="tooltipStyle"
                        tooltip="hover" />
        </b-form-group>
        <b class="pull-left">{{ min }}</b>
        <b class="pull-right">{{ max }}</b>
    </div>
</template>

<script>
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
    import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
    import vueSlider from 'vue-slider-component/src/vue2-slider'

    export default {
        name: "range-selector",
        components: {
            bFormInput, bFormGroup, vueSlider
        },
        props: ['label', 'min', 'max', 'value', 'interval'],
        data() {
            return {
                processStyle: {
                    'backgroundColor': '#fdc600'
                },
                bgStyle: {
                    'boxShadow': 'inset 0 0.5px 0 0 rgba(0, 0, 0, 0.3)',
                    'backgroundColor': '#e4e4e4',
                    'padding': '2px'
                },
                tooltipStyle: {
                    'backgroundColor': '#fdc600',
                    'borderColor': '#fdc600'
                }
            }
        },
        computed: {
            computedVal: {
                get() {
                    return [this.value.min, this.value.max];
                },
                set(val) {
                    this.$emit('input', {
                        min: Math.min.apply(null, val),
                        max: Math.max.apply(null, val)
                    });
                }
            }
        }
    }
</script>

<style scoped>
    b {
        margin-top: -20px;
        color: #7b7b7b;
    }
</style>
<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-4 offset-sm-1">
                <h2 class="s-h2 mt-3 mb-2">Upload images of your apartment</h2>
                <image-upload :isMultiple="true" :isReadOnly="isReadOnly" :images="info.images"
                              @imagesSelected="saveImages" />
            </div>
            <div class="col-sm-6 mt-3">
                <div role="group">
                    <label for="title">Title:</label>
                    <b-form-text style="float:right" id="inputTitleHelp">Required. At least 4 letters.</b-form-text>
                    <b-form-input
                            id="title"
                            type="text"
                            placeholder=""
                            v-model.trim.lazy="info.title"
                            :readonly="isReadOnly"
                            required />
                </div>
                <div role="group">
                    <label for="price">Monthly price:</label>
                    <b-form-text style="float:right" id="inputTitleHelp">Required.</b-form-text>
                    <b-form-input
                            id="price"
                            type="number"
                            placeholder=""
                            v-model.number.lazy="info.price"
                            :readonly="isReadOnly"
                            required />

                </div>
                <div role="group">
                    <label id="lblLocation">Location:</label>
                    <b-form-text style="float:right" id="inputTitleHelp">Required.</b-form-text>
                    <b-form-input
                            type="text"
                            placeholder="City"
                            aria-labelledby='lblLocation'
                            v-model.trim.lazy="info.address.city"
                            :readonly="isReadOnly"
                            required />

                    <div class="row mt-2">
                        <div class="col-md-8">
                            <b-form-input
                                    type="text"
                                    placeholder="Street"
                                    aria-labelledby='lblLocation'
                                    v-model.trim.lazy="info.address.street"
                                    :readonly="isReadOnly"
                                    required />
                        </div>
                        <div class="col-md-4">
                            <b-form-input
                                    type="number"
                                    placeholder="Number"
                                    aria-labelledby='lblLocation'
                                    v-model.number.lazy="info.address.number"
                                    v-bind:readonly="isReadOnly"
                                    required />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import bFormText from 'bootstrap-vue/es/components/form/form-text'
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'

    import ImageUpload from "@/components/image-upload/ImageUpload.vue";

    export default {
        props: ["info", "isReadOnly"],
        components: {
            bFormText, bFormInput,
            ImageUpload
        },
        data() {
            return {
                _info: this.info
            }
        },
        methods: {
            saveImages(images) {
                this._info.images = images;
            }
        }
    };
</script>

<style scoped>
    h2 {
        font-size: 20px;
    }
</style>

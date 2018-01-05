<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-4 offset-sm-1">
                <h2 class="s-h2 mt-3 mb-2">Upload images of your apartment</h2>
                <image-upload :isMultiple="true" :isReadOnly="isReadOnly" />
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Title</label>
                    <input name="title"
                           type="text"
                           class="form-control"
                           placeholder="Best place here !"
                           required
                           v-model.lazy="info.title"
                           v-bind:readonly="isReadOnly">
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input name="price"
                           type="number"
                           class="form-control"
                           placeholder="Per month"
                           required
                           v-model.number.lazy="info.price"
                           v-bind:readonly="isReadOnly">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input name="city"
                           type="text"
                           class="form-control"
                           placeholder="City"
                           required
                           v-model.lazy="info.city"
                           v-bind:readonly="isReadOnly">
                </div>

                <div class="row">
                    <div class="col-md-8">
                        <div class="form-group">
                            <input name="streetname"
                                   type="text"
                                   class="form-control"
                                   placeholder="Street name"
                                   required
                                   v-model.lazy="info.street"
                                   v-bind:readonly="isReadOnly">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <input name="streetnumber"
                                   type="number"
                                   class="form-control"
                                   placeholder="Street number"
                                   required
                                   v-model.number.lazy="info.streetNumber"
                                   v-bind:readonly="isReadOnly">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ImageUpload from "@/components/image-upload/ImageUpload.vue";

    export default {
        props: ['info', 'isReadOnly'],
        components: {
            ImageUpload
        }
    }
</script>

<style>


</style>

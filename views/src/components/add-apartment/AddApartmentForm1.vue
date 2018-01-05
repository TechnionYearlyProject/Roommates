<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-4 offset-sm-1">
        <h2 class="s-h2 mt-3 mb-2">Upload images of your apartment</h2>
        <image-upload :isMultiple="true" :isReadOnly="isReadOnly" />
      </div>
      <div class="col-sm-6 mt-3">
        <div role="group">
          <label for="title">Title</label>
          <b-form-text style="float:right" id="inputTitleHelp">Required</b-form-text>
          <b-form-input
          id="title"
          type="text"
          placeholder=""
          v-model.trim.lazy="info.title"
          :readonly="isReadOnly"
          required></b-form-input>
        </div>
        <div role="group">
          <label for="price">Monthly price</label>
          <b-form-text style="float:right" id="inputTitleHelp">Required</b-form-text>
          <b-form-input
           id="price"
           type="number"
           placeholder=""
           v-model.number.lazy="info.price"
           :readonly="isReadOnly" 
           required></b-form-input>

        </div>
        <div role="group">
          <label id="lblLocation">Location</label>
          <b-form-text style="float:right" id="inputTitleHelp">Required</b-form-text>
          <b-form-input
           type="text"
           placeholder="City"
           aria-labelledby='lblLocation'
           v-model.trim.lazy="info.address.city"
           :readonly="isReadOnly"
           required></b-form-input>
          
          <div class="row mt-2">
            <div class="col-md-8">
                <b-form-input
                type="text"
                placeholder="Street"
                aria-labelledby='lblLocation'
                v-model.trim.lazy="info.address.street" 
                :readonly="isReadOnly"
                required></b-form-input>
            </div>
            <div class="col-md-4">
                <b-form-input
                type="number"
                placeholder="Number"
                aria-labelledby='lblLocation'
                v-model.number.lazy="info.address.number"
                v-bind:readonly="isReadOnly"
                required></b-form-input>
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
  props: ["info", "isReadOnly"],
  components: {
    ImageUpload
  }
};
</script>

<style scoped>

</style>

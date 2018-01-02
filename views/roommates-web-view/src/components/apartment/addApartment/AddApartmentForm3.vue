<template>
<div>
  
  <div class="row">
    <div class="col-sm-3">
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input mt-3"
           type="checkbox"
           id="gridCheck1"
           value="Air Condition"
           v-model="info.tags"
           :disabled="isReadOnly">
          <label class="form-check-label" for="gridCheck1">
            <i class="ion-ios-snowy s-icon mr-3"></i>Air Condition
          </label>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input mt-3"
           type="checkbox"
           id="gridCheck2"
           value="Pets"
           v-model="info.tags"
           :disabled="isReadOnly">
          <label class="form-check-label" for="gridCheck2">
            <i class="ion-ios-paw s-icon mr-3"></i>Pets
          </label>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input mt-3"
           type="checkbox"
           id="gridCheck3"
           value="Elevetor"
           v-model="info.tags"
           :disabled="isReadOnly">
          <label class="form-check-label" for="gridCheck3">
            <i class="ion-arrow-up-a s-icon mr-3"></i>Elevetor
          </label>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input mt-3"
           type="checkbox"
           id="gridCheck4"
           value="Terrace"
           v-model="info.tags"
           :disabled="isReadOnly">
          <label class="form-check-label" for="gridCheck4">
            <i class="ion-ios-flame s-icon mr-3"></i>Terrace
          </label>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input mt-3"
           type="checkbox"
           id="gridCheck5"
           value="Parking"
           v-model="info.tags"
           :disabled="isReadOnly">
          <label class="form-check-label" for="gridCheck5">
            <i class="ion-android-car s-icon mr-2"></i>Parking
          </label>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input mt-3"
           type="checkbox"
           id="gridCheck6"
           value="Storage"
           v-model="info.tags"
           :disabled="isReadOnly">
          <label class="form-check-label" for="gridCheck6">
            <i class="ion-key s-icon mr-2"></i>Storage
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
export default {
  props: ['info', 'isReadOnly']
};
</script>

<style scoped>
input {
 vertical-align: middle;
}

.s-icon {
  display: inline-block;
  width: 30px;
  text-align: center;
  color: #777;
  font-size: 300%;
  margin-right: 10px;

  /* secrets to align text and icons */
  line-height: 120%;
  vertical-align: middle;
  margin-top: -5px;
}
</style>

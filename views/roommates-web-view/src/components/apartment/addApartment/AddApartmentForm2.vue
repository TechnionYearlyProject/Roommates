<template>
<div>
  <div class="row mt-4">
    <div class="col-sm-12">
      <div class="form-group">
        <label>Description:</label>
        <textarea name="descrition"
         class="form-control"
         style="white-space:pre;"
         v-model.trim.lazy="info.description"
         v-bind:readonly="isReadOnly"></textarea>
      </div>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-sm-4">
      <label>Apartment number</label>
      <input name="apartmentNumber"
        type="number"
        class="form-control"
        placeholder=""
        v-model.number.lazy="info.apartmentNumber"
        v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label>On floor:</label>
        <input name="floor"
          type="number"
          class="form-control"
          placeholder=""
          v-model.number.lazy="info.floor"
          v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label>Of total floors:</label>
        <input name="totalFloors"
          type="number"
          class="form-control"
          placeholder=""
          v-model.number.lazy="info.totalFloors"
          v-bind:readonly="isReadOnly">
    </div>
  </div>
  <div class="row mb-5">
      <div class="col-sm-2">
        <label>Number of rooms:</label>
        <input name="NumberOfRooms"
          type="number"
          class="form-control"
          placeholder="How many?"
          v-model.number.lazy="info.numberOfRooms"
          v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-2">
        <label>size:</label>
        <input name="area"
          type="number"
          class="form-control"
          placeholder="Square metre"
          v-model.number.lazy="info.area"
          v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label >Number of roommates I'm looking for:</label>
        <input name="requiredRoommates"
          type="number"
          class="form-control"
          placeholder="How many?"
          v-model.number.lazy="info.requiredRoommates"
          v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label>Number of roommates in the apartment:</label>
        <input name="totalRoommates"
          type="number"
          class="form-control"
          placeholder="How many?"
          v-model.number.lazy="info.totalRoommates"
          v-bind:readonly="isReadOnly">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info', 'isReadOnly']
};
</script>

<style>

</style>

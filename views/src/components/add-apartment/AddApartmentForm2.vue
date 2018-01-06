<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-sm-12">
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea name="description" class="form-control" style="white-space:pre;" v-model.trim.lazy="info.description" v-bind:readonly="isReadOnly"></textarea>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-sm-4">
        <label for="apartmentNumber">Apartment number</label>
        <input id="apartmentNumber" type="number" class="form-control" placeholder="" v-model.number.lazy="info.apartmentNumber" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-2">
        <label for="floor">On floor:</label>
        <input id="floor" type="number" class="form-control" placeholder="" v-model.number.lazy="info.floor" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-2">
        <label for="totalFloors">Of total floors:</label>
        <input id="totalFloors" type="number" class="form-control" placeholder="" v-model.number.lazy="info.totalFloors" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-2">
        <label for="NumberOfRooms">Number of rooms:</label>
        <input id="NumberOfRooms" type="number" class="form-control" placeholder="How many?" v-model.number.lazy="info.numberOfRooms" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-2">
        <label for="area">size:</label>
        <input id="area" type="number" class="form-control" placeholder="Square metre" v-model.number.lazy="info.area" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label for="enteranceDate">Enterance date</label>
        <b-form-text style="float:right" id="inputTitleHelp">Required.</b-form-text>
        <input id="enteranceDate" type="date" class="form-control" placeholder="" v-model.number.lazy="info.enteranceDate" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label for="requiredRoommates">Number of roommates I'm looking for:</label>
        <b-form-text style="float:right" id="inputTitleHelp">Required.</b-form-text>
        <input id="requiredRoommates" type="number" class="form-control" placeholder="How many?" v-model.number.lazy="info.requiredRoommates" v-bind:readonly="isReadOnly">
      </div>
      <div class="col-sm-4">
        <label for="totalRoommates">Number of roommates in the apartment:</label>
        <input id="totalRoommates" type="number" class="form-control" placeholder="How many?" v-model.number.lazy="info.totalRoommates" v-bind:readonly="isReadOnly">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["info", "isReadOnly"]
  };
</script>

<style>

</style>

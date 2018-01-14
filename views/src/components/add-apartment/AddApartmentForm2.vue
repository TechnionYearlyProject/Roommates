<template>
    <div class="container">
        <div class="row mt-4">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="description">Description:</label>
                    <b-form-text-area name="description" id="description" class="form-control" style="white-space:pre;"
                                      v-model.lazy="info.description" v-bind:readonly="isReadOnly" />
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-sm-4">
                <label for="apartmentNumber">Apartment number</label>
                <b-form-input id="apartmentNumber" type="number" class="form-control" placeholder=""
                              v-model.number.lazy="info.apartmentNumber" v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-2">
                <label for="floor">On floor:</label>
                <b-form-input id="floor" type="number" class="form-control" placeholder=""
                              v-model.number.lazy="info.floor"
                              v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-2">
                <label for="totalFloors">Of total floors:</label>
                <b-form-input id="totalFloors" type="number" class="form-control" placeholder=""
                              v-model.number.lazy="info.totalFloors" v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-2">
                <label for="NumberOfRooms">Number of rooms:</label>
                <b-form-input id="NumberOfRooms" type="number" class="form-control" placeholder="How many?"
                              v-model.number.lazy="info.numberOfRooms" v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-2">
                <label for="area">size:</label>
                <b-form-input id="area" type="number" class="form-control" placeholder="Square metre"
                              v-model.number.lazy="info.area" v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-4">
                <label for="enteranceDate">Enterance date</label>
                <b-form-text style="float:right" id="inputTitleHelp">Required.</b-form-text>
                <b-form-input id="enteranceDate" type="date" class="form-control" placeholder=""
                              v-model.date.lazy="info.enteranceDate" v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-4">
                <label for="requiredRoommates">Number of roommates I'm looking for:</label>
                <b-form-text style="float:right" id="inputTitleHelp">Required.</b-form-text>
                <b-form-input id="requiredRoommates" type="number" class="form-control" placeholder="How many?"
                              v-model.number.lazy="info.requiredRoommates" v-bind:readonly="isReadOnly" />
            </div>
            <div class="col-sm-4">
                <label for="totalRoommates">Number of roommates in the apartment:</label>
                <b-form-input id="totalRoommates" type="number" class="form-control" placeholder="How many?"
                              v-model.number.lazy="info.totalRoommates" v-bind:readonly="isReadOnly" />
            </div>
        </div>
    </div>
</template>

<script>
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
    import bFormText from 'bootstrap-vue/es/components/form/form-text'
    import bFormTextArea from 'bootstrap-vue/es/components/form-textarea/form-textarea'

    export default {
        props: ["info", "isReadOnly"],
        components: {
            bFormInput, bFormText, bFormTextArea
        }
    };
</script>

<style>

</style>

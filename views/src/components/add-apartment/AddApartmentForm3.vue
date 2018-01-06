<template>
    <div class="container">
        <div class="row ml-2" style="text-align:left">
            <div class="col-sm-3">
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input mt-3"
                               type="checkbox"
                               id="acGridCheck"
                               value="1"
                               v-model="info.tags"
                               :disabled="isReadOnly">
                        <label class="form-check-label" for="acGridCheck">
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
                               id="petsGridCheck"
                               value="2"
                               v-model="info.tags"
                               :disabled="isReadOnly">
                        <label class="form-check-label" for="petsGridCheck">
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
                               id="elevatorGridCheck"
                               value="3"
                               v-model="info.tags"
                               :disabled="isReadOnly">
                        <label class="form-check-label" for="elevatorGridCheck">
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
                               id="terraceGridCheck"
                               value="4"
                               v-model="info.tags"
                               :disabled="isReadOnly">
                        <label class="form-check-label" for="terraceGridCheck">
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
                               id="parkingGridCheck"
                               value="5"
                               v-model="info.tags"
                               :disabled="isReadOnly">
                        <label class="form-check-label" for="parkingGridCheck">
                            <i class="ion-android-car s-icon mr-2"></i>Parking
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="form-group custom-checkbox">
                    <div class="form-check">
                        <input class="form-check-input mt-3"
                               type="checkbox"
                               id="storageGridCheck"
                               value="6"
                               v-model="info.tags"
                               :disabled="isReadOnly">
                        <label class="form-check-label" for="storageGridCheck">
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
    label {
        margin-left: 20px;
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

    .form-check {
        width: 75%;
    }

    .form-check-input {
        vertical-align: middle;
        width: 20px;
        height: 20px;
        float: left;
    }
</style>

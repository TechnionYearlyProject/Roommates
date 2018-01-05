<template>
    <div class="container" style="margin-bottom:200px">
        <div class="container mb-5">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="s-h1">
                        <strong>publish</strong> your apartment
                    </h1>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <progression-bar :progression="progression" />
                </div>
            </div>
        </div>

        <div class="container mb-4">
            <transition name="slide-fade" mode="out-in">
                <div class="container s-apartment-add-container" v-if="progression === 1" key="1">
                    <h3 class="s-h3">
                        Let's start with some basic information.
                    </h3>
                    <add-apartment-form1 :info="form1Info" :isReadOnly="false" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 2" key="2">
                    <h3 class="s-h3">
                        Describe your apartmet a little.
                    </h3>
                    <add-apartment-form2 :info="form2Info" :isReadOnly="false" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 3" key="3">
                    <h3 class="s-h3">
                        Which properties does your apartment include?
                    </h3>
                    <add-apartment-form3 :info="form3Info" :isReadOnly="false" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 4" key="4">
                    <h3 class="s-h3">
                        You're almost there. Check you're information before submiting.
                    </h3>
                    <add-apartment-form4 :info1="form1Info" :info2="form2Info" :info3="form3Info" />
                </div>
            </transition>
        </div>

        <div class="container clearfix" style="margin-bottom:100px;margin-top:60px;">
            <button type="button"
                    class="btn btn-info s-btn-switch"
                    @click="goPreviousPage"
                    v-if="progression > 1">Previous
            </button>
            <button type="button"
                    class="btn btn-success s-btn-switch"
                    style="float:right"
                    @click="goNextPage"
                    v-if="progression < 4">Next
            </button>
            <button type="button"
                    class="btn btn-success s-btn-done"
                    style="float:right"
                    @click="submitApartment"
                    v-else>Done!
            </button>
        </div>
    </div>
</template>

<script>
    import ProgressionBar from "@/components/add-apartment/ProgressionBar.vue";
    import AddApartmentForm1 from "@/components/add-apartment/AddApartmentForm1.vue";
    import AddApartmentForm2 from "@/components/add-apartment/AddApartmentForm2.vue";
    import AddApartmentForm3 from "@/components/add-apartment/AddApartmentForm3.vue";
    import AddApartmentForm4 from "@/components/add-apartment/AddApartmentForm4.vue";

    export default {
        name: 'add-apartment',
        data() {
            return {
                progression: 1,
                form1Info: {
                    title: '',
                    price: '',
                    city: '',
                    street: '',
                    streetNumber: ''
                },
                form2Info: {
                    description: '',
                    apartmentNumber: '',
                    floor: '',
                    totalFloors: '',
                    numberOfRooms: '',
                    area: '',
                    requiredRoommates: '',
                    totalRoommtes: ''
                },
                form3Info: {
                    tags: []
                }
            };
        },
        methods: {
            goNextPage() {
                if (this.progression >= 5) {
                    return;
                }
                this.progression++;
            },
            goPreviousPage() {
                if (this.progression <= 1) {
                    return;
                }
                this.progression--;
            },
            submitApartment() {
                this.$http.get('users/tags')
                .then((res) =>
                console.log(JSON.stringify(res.body)));
            }
        },
        components: {
            ProgressionBar,
            AddApartmentForm1,
            AddApartmentForm2,
            AddApartmentForm3,
            AddApartmentForm4
        }
    };
</script>

<style>
    input[readonly].form-control,
    textarea[readonly].form-control {
        background-color: #f3f3f3;
        border: none;
        box-shadow: none;
    }

    .s-h1 {
        text-transform: uppercase;
        font-size: 180%;
        word-spacing: 2px;
        text-align: center;
        margin-bottom: 30px;
        letter-spacing: 1px;
        color: #777;
    }

    .s-h2 {
        font-size: 110%;
        margin-bottom: 10px;
        text-align: center;
        letter-spacing: 1px;
        color: #777;
        text-transform: uppercase;
    }

    .s-h3 {
        font-size: 90%;
        margin-bottom: 10px;
        text-align: center;
        letter-spacing: 1px;
        color: #777;
        text-transform: uppercase;
    }

    .s-btn-switch,
    .s-btn-done {
        text-transform: uppercase;
        width: 120px;
        cursor: pointer;
    }

    .s-btn-done {
        font-weight: bold;
        width: 150px;
    }

    .s-apartment-add-container {
        z-index: 3;
        padding: 10px 0;
        border: 1px solid #eee;
        overflow-x: hidden;
    }

    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>

<template>
    <div class="container" style="margin-bottom:200px;margin-top:5%">
        <div class="container mb-5" v-if="progression < 5">
            <div class="row">
                <div class="col-md-12">
                    <h1>
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
                <div class="container s-apartment-add-container" v-if="progression === 1">
                    <h3 class="s-h3">
                        Let's start with some basic information.
                    </h3>
                    <add-apartment-form1 :info="form1Info" :isReadOnly="false" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 2">
                    <h3 class="s-h3">
                        Describe your apartmet a little.
                    </h3>
                    <add-apartment-form2 :info="form2Info" :isReadOnly="false" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 3">
                    <h3 class="s-h3">
                        Which properties does your apartment include?
                    </h3>
                    <add-apartment-form3 :info="form3Info" :isReadOnly="false" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 4">
                    <h3 class="s-h3">
                        You're almost there. Check you're information before submiting.
                    </h3>
                    <add-apartment-form4 :info1="form1Info" :info2="form2Info" :info3="form3Info" />
                </div>
                <div class="container s-apartment-add-container" v-if="progression === 5">
                    <add-apartment-success :apartmentId="uploadedApartmentId" />
                </div>
            </transition>
        </div>

        <b-container>
            <b-alert show variant="danger" v-if="error">
                {{ error }}
            </b-alert>
        </b-container>

        <div class="container clearfix" style="margin-bottom:100px;margin-top:60px;">
            <b-button v-if="progression > 1" size="lg"
                      @click="goPreviousPage">
                Previous
            </b-button>
            <b-button v-if="progression < 4" class="go-right" size="lg"
                      :variant="isValidInput ? 'primary' : 'secondary'"
                      @click="goNextPage">Next
            </b-button>
            <b-button v-else class="go-right" variant="primary" size="lg"
                      @click="submitApartment">Done!
            </b-button>
        </div>

<loading :show="showLoading" label="Loading..."></loading>
    </div>
</template>

<script>
    import ProgressionBar from "@/components/add-apartment/ProgressionBar.vue"
    import AddApartmentForm1 from "@/components/add-apartment/AddApartmentForm1.vue"
    import AddApartmentForm2 from "@/components/add-apartment/AddApartmentForm2.vue"
    import AddApartmentForm3 from "@/components/add-apartment/AddApartmentForm3.vue"
    import AddApartmentForm4 from "@/components/add-apartment/AddApartmentForm4.vue"
    import AddApartmentSuccess from "@/components/add-apartment/AddApartmentSuccess.vue"
    import bButton from 'bootstrap-vue/es/components/button/button'
    import loading from 'vue-full-loading'

    export default {
        name: "add-apartment",
        data() {
            return {
                progression: 1,
                form1Info: {
                    title: "",
                    price: undefined,
                    address: {
                        state: "israel",
                        city: "",
                        street: "",
                        number: undefined
                    },
                    images: []
                },
                form2Info: {
                    description: "",
                    apartmentNumber: "",
                    floor: "",
                    totalFloors: "",
                    numberOfRooms: "",
                    area: "",
                    requiredRoommates: 1,
                    totalRoommates: "",
                    enteranceDate: new Date().toISOString().slice(0, 10)
                },
                form3Info: {
                    tags: []
                },

                showLoading: false,
                uploadedApartmentId: null,
                error: ""
            };
        },
        methods: {
            goNextPage() {
                if (this.progression >= 6) {
                    return;
                }

                if (!this.isValidInput) {
                    this.validMessage = "Please fill up the fields!";

                    return;
                }

                this.validMessage = "";
                this.progression++;
            },
            goPreviousPage() {
                if (this.progression <= 1) {
                    return;
                }
                this.progression--;
            },
            submitApartment() {
                if (!this.isValidInput) {
                    return;
                }
                this.showLoading = true;
                this.$http
                    .post("apartments", {
                        title: this.form1Info.title,
                        address: this.form1Info.address,
                        price: this.form1Info.price,
                        images: this.form1Info.images,
                        enteranceDate: Date.parse(this.form2Info.enteranceDate),
                        description: this.form2Info.description,
                        tags: this.form3Info.tags,
                        requiredNumberOfRoommates: this.form2Info.requiredRoommates,
                        currentlyNumberOfRommates: this.form2Info.totalRoommates,
                        numberOfRooms: this.form2Info.numberOfRooms,
                        floor: this.form2Info.floor,
                        totalFloors: this.form2Info.totalFloors,
                        area: this.form2Info.area
                    })
                    .then(res => {
                        console.log(JSON.stringify(res.body));
                        this.uploadedApartmentId = res.body.apartment._id;
                        this.showLoading = false;
                        this.goNextPage();
                    })
                    .catch(e => { 
                        console.log(e);
                        this.error = e.body.message;
                        this.showLoading = false;
                        });
            }
        },
        computed: {
            isValidInput() {
                return (
                    this.form1Info.title.length >= 4 &&
                    this.form1Info.price &&
                    this.form1Info.price > 0 &&
                    this.form1Info.address.state.length >= 2 &&
                    this.form1Info.address.city.length >= 2 &&
                    this.form1Info.address.street.length >= 2 &&
                    this.form1Info.address.number &&
                    this.form1Info.address.number > 0 &&
                    this.form2Info.requiredRoommates > 0 &&
                    this.form2Info.enteranceDate
                );
            }
        },
        components: {
            ProgressionBar,
            AddApartmentForm1,
            AddApartmentForm2,
            AddApartmentForm3,
            AddApartmentForm4,
            AddApartmentSuccess,
            bButton,
            loading
        }
    };
</script>

<style scoped>
    button {
        cursor: pointer;
    }

    .go-right {
        float: right;
    }

    input[readonly].form-control,
    textarea[readonly].form-control {
        background-color: #f3f3f3;
        border: none;
        box-shadow: none;
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
        padding: 20px 0 50px 0;
        border: 1px solid #e6e6e6;
        background-color: #fff;
        overflow-x: hidden;
    }

    .slide-fade-enter-active {
        transition: all 0.3s ease;
    }

    .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>

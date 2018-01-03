<template>
    <div class="apartPage">
        <div class="container">
            <div class="row">
                <div class="col-sm">
                  <div>
                    <b-carousel id="carousel1"
                                style="text-shadow: 1px 1px 2px #333;"
                                controls
                                indicators
                                background="#ababab"
                                :interval="4000"
                                img-width="1024"
                                img-height="480"
                                v-model="slide"
                                @sliding-start="onSlideStart"
                                @sliding-end="onSlideEnd"
                    >
                      <!-- <div v-for="img in apartment.images">
                        <b-carousel-slide
                          img-src="img"
                        ></b-carousel-slide>
                      </div> -->
                    </b-carousel>
                  </div>
                    <p><br></p>
                    <div class="single-property-header">                                          
                                <h1>{{apartment.address.city}}, {{apartment.address.street}},
                                    {{apartment.address.houseNumber}}/{{apartment.address.entranceNumber}}</h1>
                    </div>
                    <div >
                        <div class="row">
                            <div class="col-sm">
                                
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info icon-area">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Area</span>
                                        <span class="property-info-value">3500<b class="property-info-unit">Sq Ft</b></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                         <div class="row">
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-bed">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/bed-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Bedrooms</span>
                                        <span class="property-info-value">3</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-bed">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/cars-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Car garages</span>
                                        <span class="property-info-value">1</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                         <div class="row">
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-bath">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/os-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Bathrooms</span>
                                        <span class="property-info-value">{{apartment.numberO}}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-garage">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Garages</span>
                                        <span class="property-info-value">2</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class>

                        </div>
                        <div class="col-sm">



                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-garage">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/shawer-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Garages</span>
                                        <span class="property-info-value">2</span>
                                    </span>
                                </div>

                        </div>   
                        <div class="col-sm">





                        </div>

                    </div>
                    <div class="section">
                                <h4 class="s-property-title">Description</h4>
                                <div class="s-property-content">
                                    <p>{{apartment.description}}</p>
                                </div>
                    </div>
                </div>
                <div class="col-sm">





                    <div class="card" style="width: 20rem;">
                        <div class="card-header">
                            publisher
                        </div>
                        <img class="card-img-top"
                             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRzrsvYREQF2spJT1b4hc_SQmbnGEtPDGeoYlcdZDTf0FIpnNzHg"
                             alt="Card image cap" style="width:128px;height:128px">
                        <div class="card-body">
                            <h4 class="card-title">publisher info:</h4>
                            <ul class="list-group list-group-flush">
                                <i class="pe-7s-map-marker strong"> </i>
                                <li class="list-group-item">{{auther.firstName}} {{auther.lastName}}</li>
                                <li class="list-group-item">contact info:<br>
                                    cell number: {{auther.contactInfo.cellNumber}}<br>
                                    e-mail address: {{auther.contactInfo.eMail}}
                                </li>
                            </ul>
                            <p class="card-text"></p>
                        </div>
                    </div>
                    <div class="card" style="width: 20rem;">
                        <div class="card-header">
                            interested users:
                        </div>
                        <img class="card-img-top"/>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="user in users">{{user.firstName}} {{user.lastName}}
                                    <a href="#" class="btn btn-secondry btn-sm">user info</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="width: 60rem;">
                <div class="card-header">
                    description:
                </div>
                <div class="card-body">
                    <p class="card-text">{{apartment.description}}</p>
                </div>
            </div>

            <div class="card" style="width: 60rem;">
                <div class="card-header">
                    users comment:
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="comment in calCom">
                            {{comment.comment}} at: {{comment.writenAt}}
                        </li>
                    </ul>
                    <p class="card-text"></p>
                </div>
            </div>

            <ul class="pagination">
                <li class="page-item"><button v-on:click="changeCommentPage(1)">first</button></li>
                <li v-for="p in (Math.ceil(apartment.comments.length/5))"
                    :class="{ 'page-item': true, active:commentPage }"
                ><button v-on:click="changeCommentPage(p)">{{p}}</button>{{commentPage}}</li>
                <li class="page-item"><button v-on:click="lastCommentPage()">last</button></li>
            </ul>

            <ul class="pagination">
                <li class="page-item"><button v-on:click="changeCommentPage(1)">first</button></li>
                <li v-for="p in (Math.ceil(apartment.comments.length/5))"
                    :class="{ 'page-item': true, active:commentPage }"
                ><button v-on:click="changeCommentPage(p)">{{p}}</button>{{commentPage}}</li>
                <li class="page-item"><button v-on:click="lastCommentPage()">last</button></li>
            </ul>




        </div>
    </div>
</template>

<script>
import bCarousel from "./gallery/image-carousel/ImageCarousel.vue";
import bCarouselSlide from 	'bootstrap-vue/es/components/carousel/carousel-slide';
    export default {
        name: 'apartment-page',

        data() {
            return {
                calCom: [],
                commentPage: 1,
                title: 'hi there',
                auther: {
                    firstName: 'chanan',
                    lastName: 'ben tal',
                    _id: '1',
                    img: "https://images.pexels.com/photos/428339/pexels-photo-428339.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb",
                    contactInfo: {
                        cellNumber: '054-4204942',
                        eMail: 'chananbental@gmail.com'
                    }
                },
                users: [
                    {
                        firstName: 'chanan',
                        lastName: 'ben tal',
                        _id: '1'
                    },
                    {
                        firstName: 'hanan',
                        lastName: 'ben-tal',
                        _id: '2'
                    },
                    {
                        firstName: 'khanan',
                        lastName: 'ben tal',
                        _id: '3'
                    },
                    {
                        firstName: 'gabi',
                        lastName: 'ben-tal',
                        _id: '4'
                    },
                ],
                apartment: {
                    _id: '1',
                    createdBy: '1',
                    address: {
                        state: 'Israel',
                        city: 'chaifa',
                        street: 'shalom alychem',
                        houseNumber: 18,
                        entranceNumber: 1,
                    },
                    floor: 1,
                    totalFloors: 4,
                    description: "a very nice place",
                    price: 1200,
                    images : [
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4qUg397lGFM0dJpE9rA1DHzttbtfQiYXQULgqKRreYTUnQuCq",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUIzpQEzg9pExt10YWgJU4_6XGoXiD1FeUCkuV7ZEPG8wGi8SXHg",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPhqE9OKHQApVJLMlRBtg4Bb8fDCNjQIXce3DgJgHpGAJrru2EDg"
                    ],
                    comments: [
                        {
                            commentBy: '4', writenAt: "2017-01-01", comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01",comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4', writenAt: "2017-01-01", comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01",comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4', writenAt: "2017-01-01", comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01",comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4', writenAt: "2017-01-01", comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01",comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                    ]
                }
            }
        },
        components:{
          bCarousel, bCarouselSlide
        },
        methods:{
            changeCommentPage(newPage) {
                this.commentPage = newPage;
            },
            lastCommentPage(){
                this.commentPage = (Math.ceil(apartment.comments.length/5));
            }
        },
        computed:{
            calCom(){
                return this.apartment.images.slice(5*(this.commentPage)-4,5*(this.commentPage)+1);
            }
        }
    }
</script>

<style scoped>

</style>

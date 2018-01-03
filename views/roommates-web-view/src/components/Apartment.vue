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
                                <h1>{{apartment.location.address.city}}, {{apartment.location.address.street}},
                                    {{apartment.location.address.houseNumber}}/{{apartment.location.address.entranceNumber}}</h1>
                    </div>
                    <div >
                        <div class="row">
                            <div class="col-sm">
                                    <span class="property-info icon-area">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label"><br>Area<br></span>
                                        <span class="property-info-value">{{apartment.area}}<br><b><small> Sq meters</small></b></span>
                                    </span>                                
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info icon-area">
                                        <img src="data:image/png;base64,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"
                                           style="width:30px;height:30px">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label"><br>toilets<br></span>
                                        <span class="property-info-value">{{apartment.toilets}}<br><b><small></small></b></span>
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

                        </div>
                         <div class="row">
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
                            <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                <span class="property-info-icon icon-garage">
                                    <img src="data:image/jpeg;base64,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"
                                        style="width:30px;height:30px">
                                </span>
                                <span class="property-info-entry">
                                    <span class="property-info-label">Garages</span>
                                    <span class="property-info-value">2</span>
                                </span>
                            </div>
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
                    location:{
                        address: {
                            state: 'Israel',
                            city: 'chaifa',
                            street: 'shalom alychem',
                            houseNumber: 18,
                            entranceNumber: 1,
                        },
                        geoLocation:[0,0]
                    },
                    floor: 1,
                    totalFloors: 4,
                    description: "a very nice place",
                    price: 1200,
                    area: 100,
                    numRooms:4,
                    toilets:2,
                    showers:2,
                    roomatesNeeded: 3,
                    roomatesCurrently: 1,
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

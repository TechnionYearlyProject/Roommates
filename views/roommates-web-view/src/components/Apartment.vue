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


<!-- data:image/png;base64,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 -->
<!-- data:image/png;base64,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 -->


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

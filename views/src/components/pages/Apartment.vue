<template>
    <div class="apartPage grid">
        <b-container fluid>
            <b-row align="center">
                <b-col cols="7">
                    <PicsAndPrice
                        :city="apartment.location.address.city"
                        :street="apartment.location.address.street"
                        :buildingNum="apartment.location.address.houseNumber"
                        :entranceNum="apartment.location.address.entranceNumber"
                        :images="apartment.images"
                        :rent="apartment.rent"
                        :arnona="apartment.arnona"
                        :buildingCommity="apartment.houseCommity"
                        />
                </b-col>
                <b-col cols="5">
                        <auther-and-interested-users
                            :interstedUsers="apartment.interstedUsers"
                            :auther="auther"
                            />
                </b-col>
            </b-row>
            <hr>
            <b-row>
                <apartmentTags :area="apartment.area"
                               :toilets="apartment.toilets"
                               :garages="apartment.garages"
                               :bedrooms="apartment.bedrooms"
                               :parking="apartment.parking"
                               :pets="apartment.pets"
                               :showers="apartment.showers"
                               :waterHeaterMethod="apartment.waterHeaterMethod"
                               :elevator="apartment.elevator"
                               :gas="apartment.gas" />
            </b-row>
            <hr>
            <b-row>
                <b-col align="center">
                    <h4 class="s-property-title">Description:</h4>
                    <p>{{apartment.description}}</p>
                </b-col>
            </b-row>
            <b-row >
                <b-col align="center">
                    <div class="card" style="width: 60rem;">
                        <div class="card-header">
                            <b-container fluid>
                                <b-row>
                                    <b-col align="center">
                                        <h3>users comments</h3>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="comment in calCom">
                                    <b-container fluid>
                                        <b-row>
                                            <b-col align="center">
                                                {{comment.comment}} at: {{comment.writenAt}}
                                            </b-col>
                                        </b-row>
                                    </b-container>
                                </li>
                                <li class="list-group-item" v-for="p in (5-calCom.length)">
                                    <br>
                                </li>
                            </ul>
                            <p class="card-text"></p>
                        </div>
                    </div>
                </b-col>
                
            </b-row>
            <b-row>
                <b-col />
                <b-col>
                    <b-pagination align="center" :total-rows="apartment.comments.length"
                                  v-model="commentPage" :per-page="5">
                    </b-pagination>
                </b-col>
                <b-col />
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bCarousel from 'bootstrap-vue/es/components/carousel/carousel';
    import bCarouselSlide from 'bootstrap-vue/es/components/carousel/carousel-slide';
    import bPagination from 'bootstrap-vue/es/components/pagination/pagination';
    import ApartmentTags from '@/components/single-apartment/TagsGrid';
    import PicsAndPrice from '@/components/single-apartment/PicsAndPrice';
    import AutherAndInterestedUsers from '@/components/single-apartment/AutherAndInterested';
    import bLink from 'bootstrap-vue/es/components/link/link'

    export default {
        name: 'apartment-page',
        components: {
            bContainer, bRow, bCol,
            bCarousel, bCarouselSlide, bPagination, ApartmentTags, bLink, PicsAndPrice, AutherAndInterestedUsers
        },
        props:[
            'id'
        ],
        data() {
            return {
                slide: 0,
                sliding: null,
                commentPage: 1,
                auther: {
                    firstName: 'chanan',
                    lastName: 'ben tal',
                    _id: '1',
                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRzrsvYREQF2spJT1b4hc_SQmbnGEtPDGeoYlcdZDTf0FIpnNzHg",
                    contactInfo: {
                        cellNumber: '054-4204942',
                        eMail: 'chananbental@gmail.com'
                    }
                },
                apartment1: null,
                apartment: {
                    _id: '1',
                    createdBy: '1',
                    location: {
                        address: {
                            state: 'Israel',
                            city: 'chaifa',
                            street: 'shalom alychem',
                            houseNumber: 18,
                            entranceNumber: 1,
                        },
                        geoLocation: [0, 0]
                    },
                    floor: 1,
                    totalFloors: 4,
                    description: "a very nice place",
                    rent: 1200,
                    houseCommity: 50,
                    arnona: 400,
                    area: 100,
                    numRooms: 4,
                    bedrooms: 5,
                    toilets: 2,
                    showers: 2,
                    garages: 0,
                    parking: 'yes',
                    pet: "yes",
                    gas: "yes",
                    roomatesNeeded: 3,
                    roomatesCurrently: 1,
                    electricWaterHeater: true,
                    solarWaterHeater: false,
                    elevator: "yes",
                    images: [
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4qUg397lGFM0dJpE9rA1DHzttbtfQiYXQULgqKRreYTUnQuCq",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUIzpQEzg9pExt10YWgJU4_6XGoXiD1FeUCkuV7ZEPG8wGi8SXHg",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPhqE9OKHQApVJLMlRBtg4Bb8fDCNjQIXce3DgJgHpGAJrru2EDg"
                    ],
                    interstedUsers: [
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
                        {
                            firstName: 'chseanan',
                            lastName: 'ben tal',
                            _id: '5'
                        },
                        {
                            firstName: 'hangran',
                            lastName: 'ben-tal',
                            _id: '66'
                        },
                        {
                            firstName: 'khadfgnan',
                            lastName: 'ben tal',
                            _id: '7'
                        },
                        {
                            firstName: 'gaby',
                            lastName: 'ben-tal',
                            _id: '8'
                        },
                    ],

                    comments: [
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                    ]
                }
            }
        },

        created: {
            getApartmennt() {
                let that = this;
                this.$http
                    .get('apartments',{params:{id: this.id}})
                    .then(response => that.apartment1 = res.body.apartment)
                    .catch(e => console.error(e))
            }
        },
        computed: {
            calCom() {
                return this.apartment.comments.slice(5 * (this.commentPage) - 4, 5 * (this.commentPage) + 1);
            },

            waterHeaterMethod() {
                if (this.apartment.electricWaterHeater) {
                    if (this.apartment.solarWaterHeater) {
                        return "pic of sun and elctricty";
                    }
                    return "pic of electricty";
                }
                return "pic of sun";
            }
        }
    }
</script>

<style scoped>
    #header {
        border-bottom: #ddd solid 1px;
        padding: 10px 0;
        margin-bottom: 15px;
    }

    #logo {
        font-size: 20px;
        text-transform: uppercase;
        border: #fdc600 solid 3px;
        color: #000;
        display: inline-block;
        padding: 0 10px;
        font-weight: 500;
        position: relative;
        text-decoration: none;
    }

    #logo::before, #logo::after {
        content: '';
        display: inline-block;
        position: absolute;
        width: 55px;
        height: 3px;
        background-color: #fff;
    }

    #logo::before {
        right: 15px;
        top: -3px;
    }

    #logo::after {
        left: 15px;
        bottom: -3px;
    }

    #logo::first-letter {
        font-size: 28px;
        color: #fdc600;
    }

    button:first-of-type {
        text-transform: uppercase;
    }
</style>

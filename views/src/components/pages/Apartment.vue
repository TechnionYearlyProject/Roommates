<template>
    <div class="apartPage grid">
        <b-container fluid>
            <b-row>
                <b-col>
                    <div class="single-property-header">
                        <h1>
                            {{apartment.location.address.city}}, {{apartment.location.address.street}},
                            {{apartment.location.address.houseNumber}}/{{apartment.location.address.entranceNumber}}
                        </h1>
                    </div>
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
                                @sliding-end="onSlideEnd">
                        <b-carousel-slide v-for="img in apartment.images" :key="img" :img-src="img" />
                    </b-carousel>
                    <b-row>
                        <b-col fluid>
                            <h2>rent is {{apartment.price}} per month</h2>
                            <hr>
                            <h5>Arnona {{apartment.arnona}} bi-monthly</h5>
                            <h5>building upkeep {{apartment.vaadBayit}}</h5>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col>
                    <div class="card" style="width: 30rem;">
                        <div class="card-body">
                            <b-container fluid>
                                <b-row>
                                    <b-col cols="4">
                                        <img class="card-img-top rounded-circle"
                                             :src="auther.img"
                                             alt="Card image cap" style="width:110px;height:auto">
                                    </b-col>
                                    <b-col cols="7">
                                        <h4>{{auther.firstName}} {{auther.lastName}}</h4>
                                        <img src="data:image/png;base64,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"
                                             style="width:20px;height:auto"> {{auther.contactInfo.cellNumber}} <br>
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAAb1BMVEX///8AAABvb29cXFxUVFRsbGySkpIwMDD4+Pjr6+uBgYHv7+9+fn719fViYmJ4eHjk5OSHh4eenp7IyMgcHBzb29siIiINDQ2rq6u7u7tnZ2fS0tLBwcEUFBQ2NjYnJyeamppJSUk9PT2np6dHR0cL2y+QAAAEfUlEQVR4nO3da1viMBCG4XAQK1AQz+IJ1P//G1fQVWZyaEKTzLj7Ph8F295XSgtpRWMQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEELon2syHqlrfFcYvR4obFIYfSINdAU00EADDTTQQHvQw+WwbsuxPHpUeI1WZ0/y6MG48CpZ5xp278pqh1nmQFZR7TILHb2rqc+cqxc6ZVVSO8dZ7jxdRe0xV0SP6OmywpnLvW9XRS/Ma101M09+Vl9xpE1dNTOvzKkMmqkXJVdsmcXQ5plsybrcepl5agTRTF1srB1mQXRTZaxdZkG0aU7J9pyUWKnTLIk2zQvZomH+dbrNomg+1tnVM7dZFs3Hepl3jbNbsvT59wOyaNPclFP7xlkcbVqqnnt/PTlmPlyyNNq0dN5q6vv11Lz7tlGANi3dukzqkFkBushYB80a0HwLV/3XFTarQPNjTm/1jO471tFRBTqzmo2zfR7UgbbmNvqsqO0YZzVoPtY9NoaZXe93tKCzjXXbtW8bRehM6ohx1oTOom6vIsya0BnUUeOsC82vQ2xSVxFp1oXuqY7bt402dC91tFkbmqsv4pcfu28bfWhzfaS6TZiDUYc+Us3M4TlGfWiufotZeENfzx3zqgrRXB1x933SOOtEJ6ubNLNOtHlIUqft20YrOkmdfnVIKZqr7/3PZOaY64Ba0dHq1NfzLrVo8x6lZuN8FbVotejtgOVUM3PkHQ1a0dad2U4127d3xdzRoBQ9ss2DwSN/ljXOu37t0dtpttTsmn68WiV64TYztXOcd3Ve5daIDvyJy4HaM867uq5yK0QPCYDeePWjZndk0TqufOpDM7N5pJ6vzbyk8yRrdhwPXw1Th14yszH3bBhH09WcnarW1gxZUKMNPSeb/tLsfsbVVvtzM7ueE+IoQ0/Jht80nz/tUH+9C2NXaDf+tehCr6i5/fvzoPr7PRhT+2fXVKGp+an9eSSgPni3za4LeWfXNKEnZJNv28PH7iLM1qy5b+5BEZqZZ/RRz1iz95xxaj3oC7q9M/44m1X4zHrdRqnVoJn5zH5GQ0/hHz1f289iM6nOT+Fa0G+d5o/OyRltcel8UoRaCZodp869S3nYLLevz+/DzWXrewpTW5/CtaCjzVGxV7+tVoFmR2bHKzUtprZeBhrQuc2dagXo/OaPT550mQ/0UXn0Y3D7ji2oFkeXMYeXK40O74d9CrxqhNFdx9k+MfXBeVAWXdIcOPuLojvfRfTMp5ZEx3w26JfnHb0gurzZp5ZD1zB7PrGKoSNndnq3oevZz01IoWuZnWohNDNH3RV4bHTu7aqVQrO52oR7fY+JzaY3IuhFW9VsqQ++eKMeekuvpm8Kr9jwq0XvEiNNK73efdZEqiy6iplf9RZGZ/i74bjcahF0tm8D6M75peoS6Izf+9Cd654lAXRVs1NdH11x3/7M3sMFvhZ3XDsFaAUBDTTQQAMNNND7/sv/onRxUvl/MUS0LjTbjhBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQpL9AYUZSAL+6WzgAAAAAElFTkSuQmCC"
                                             style="width:30px;height:auto"> {{auther.contactInfo.eMail}}<br>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </div>
                    </div>
                    <div class="card" style="width: 30rem;">
                        <div class="card-header">
                            <b-container fluid>
                                <b-row>
                                    <b-col align="center">
                                        <h4>interested users:</h4>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </div>

                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="user in calUsers">
                                    <b-container fluid>
                                        <b-row>
                                            <b-col align="center">
                                                <b-link :to="{ name: 'user-profile', params: { id: user._id } }">
                                                    {{user.firstName}} {{user.lastName}}
                                                </b-link>
                                            </b-col>
                                        </b-row>
                                    </b-container>
                                </li>
                            </ul>
                        </div>

                        <b-pagination align="center" :total-rows="apartment.interstedUsers.length"
                                      v-model="usersPage" :per-page="5" />
                    </div>
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
            <b-row>
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
                        </ul>
                        <p class="card-text"></p>
                    </div>
                </div>
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
    import bLink from 'bootstrap-vue/es/components/link/link'

    export default {
        name: 'apartment-page',
        components: {
            bContainer, bRow, bCol,
            bCarousel, bCarouselSlide, bPagination, ApartmentTags, bLink
        },
        data() {
            return {
                slide: 0,
                sliding: null,
                commentPage: 1,
                usersPage: 1,
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
                    price: 1200,
                    vaadBayit: 50,
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
        methods: {
            onSlideStart(slide) {
                this.sliding = true
            },
            onSlideEnd(slide) {
                this.sliding = false
            },
        },
        created: {
            getApartmennt() {
                this.$http.get('/apartments/id').then(response => {
                    this.apartment = response.body;
                }, response => {

                })
            }
        },
        computed: {
            calCom() {
                return this.apartment.comments.slice(5 * (this.commentPage) - 4, 5 * (this.commentPage) + 1);
            },
            calUsers() {
                return this.apartment.interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1);
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

</style>

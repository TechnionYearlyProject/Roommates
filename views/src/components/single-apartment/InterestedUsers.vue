
<template>

<div class="w-100" style="background-color: #eee;">
    <b-card border-variant="light" >
        <b-container>
            <b-card-header v-if="interstedUsers.length==0">
                <h5>no interest in this apartment yet</h5>
            </b-card-header>
            <b-card-header v-if="interstedUsers.length==1">
                <h5>one other person likes this apartment</h5>
            </b-card-header>
            <b-card-header v-if="interstedUsers.length>1">
                <h5>{{interstedUsers.length}} other people like this apartment</h5>
            </b-card-header>
            <b-row>
                <b-col align="center">

                    <b-dropdown id="ddown1" text="Interested Users" ariant="primary" class="m-md-2">
                        <b-container>
                            <b-row>
                                <b-col align="center">
                                    <b-dropdown-item v-for="user in calUsers" :key="user._id">
                                        <b-link :to="{ name: 'user-profile', params: { id: user._id } }">
                                                {{user.firstName}} {{user.lastName}}
                                        </b-link>
                                    </b-dropdown-item>
                                    <b-dropdown-divider></b-dropdown-divider>
                                    <b-dropdown-item>
                                        <b-pagination align="center" :total-rows="interstedUsers.length"
                                                    v-model="usersPage" :per-page="5" :limit="0" />                                    </b-dropdown-item>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-dropdown>


                    <!-- <b-card v-if="interstedUsers.length!=0">
                            <b-container fluid>
                                <b-row align="center">
                                    <b-col align="center">
                                        <b-button v-b-toggle.collapse1 variant="primary" align="center" @click="hideAndShow">{{interestedText}}</b-button>
                                    </b-col>
                                </b-row>
                            </b-container>
                        <b-collapse id="collapse1" class="mt-2">
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item v-for="user in calUsers" :key="user">
                                            <b-link :to="{ name: 'user-profile', params: { id: user._id } }">
                                                <b-button>
                                                    {{user.firstName}} {{user.lastName}}
                                                </b-button>
                                            </b-link>
                                    </b-list-group-item>
                                    <b-list-group-item v-for="p in (5-calUsers.length)" :key="p"><br></b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                            <b-pagination align="center" :total-rows="interstedUsers.length"
                                        v-model="usersPage" :per-page="5" :limit="3" />
                        </b-collapse>
                    </b-card> -->
                </b-col>
            </b-row>
                <b-button  @click="interest" :pressed="intress" variant="link"  v-if="isAuth">
                    <b-img :src="interested"
                    alt="Responsive image" height="40" width="auto"/>
                </b-button>
        </b-container>
    </b-card>
</div>
</template>

<script>
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bImg from 'bootstrap-vue/es/components/image/img';
    import bCard from 'bootstrap-vue/es/components/card/card';
    import bCardHeader from 'bootstrap-vue/es/components/card/card';
    import bCardFooter from 'bootstrap-vue/es/components/card/card';
    import bCardImg from 'bootstrap-vue/es/components/card/card';
    import EventBus from "../../event-bus/EventBus";
    
export default {
        name: "interested-users",
        components:{
            bContainer, bRow, bCol, bImg, bCard, bCardImg, bCardFooter, bCardHeader
        },
        props:[
            'interstedUsers', 'apartmentId' 
        ],
        data(){
            return{
                isAuth: null,
                show: true,
                intress: false,
                usersPage : 1,
                user: [],
            }
        },
        methods:{
            hideAndShow(){
                if(this.show){
                    this.show = false;
                }else{
                    this.show = true;
                }
            },
            interest(){
                var id = this.apartmentId;
                if(this.intress){
                    this.intress = false;
                }else{
                    this.intress = true;
                }
                this.$http
                    .put(`apartments/${id}/interested`, {}, {headers: {'x-auth': this.$auth.getToken() }})
                    .then(res => {
                        console.log(res);})
                    .catch(e => console.log(e));                
            },
            setUserData(responseFromServer, pThis) {
                pThis.user = responseFromServer.body.self;
            }
        },
        computed:{
            interestedText(){
                if(this.show){
                    return 'show me interested users';
                }
                return 'hide interested users';
            },
            calUsers(){
                var CU = [];
                var tmp = this.interstedUsers.slice(5 * (this.usersPage - 1), 5 * (this.usersPage));
                for (let j = 0; j < tmp.length; j++) {
                    this.$http.get(`users/${tmp[j]}`).then(res=>{console.log(res);CU.push(res.body.user);}).catch(e => console.log(e));
                }
                // return this.interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1);
                // return this.interstedUsers.slice(5 * (this.usersPage - 1), 5 * (this.usersPage));
                return CU;
            },
            interested(){
                if(this.intress){
                    return "data:image/png;base64,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";
                }
                return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8QDw8PDhAQDw8QEBEQDxAQEhIPEBAPFRIWFhUTFRkYHyggGCYlGxUTITIiJSkrLi4uIyM1ODMtNygtLi0BCgoKDg0OGxAQGjAmHyYxLS0wLy8zNzArLTIwLi8vLS4tLS0tKy0tLS0tLS8tLSstLS0rLS0tLS0tLS0tLS0tLf/AABEIAKABOwMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAgUDBgcEAQj/xABKEAABAwIBBAwKBA8BAQEAAAABAAIDBBESBQYhkgcTFRYxMkFRYWJksRQiJDRxcnSBkbM1c7LBFyNCUlNUgoOTlKG00dLwM0Ml/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECAwQF/8QAKBEAAgIBAwMEAgMBAAAAAAAAAAECERIDMlETITEiQYHBBDMjQ/CR/9oADAMBAAIRAxEAPwDuKIvHlLKcNOAZXWJ4rRpc70BSk34Ibo9iKh3yg8FLUkchwJvk7LU6iv0p8Fc4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUTfJ2Wp1E6UuBnEvkVDvk7LU6ib5Oy1OonSlwM4l8iod8nZanUWWmzkhc4MkbJA48G2twg+/k99lHTlwTnEuURFQsFquSWCd8lXJ4znPLYr6cEY4Lf93ralrGa48mHrv71tpeGzOflFoinZLK9gginZLJYIIp2SyWCCKdkslgginZLJYIIp2SyWCCKdkslgginZLJYIIp2SyWCCKdkslgginZLJYIIp2SyWCCKdkslgginZLJYIIp2WsnPrJwkLDI8NDzHtxjdtGIG3H5ung5eBF38BujY0Um2IBFiDpBGkEc4X2yWCCKdkslggsNXSslYWSC4PxB5xzL02SyWDy5rTuMT4nnE6CR0QPO0cH3j4K6VDmvxqz2l6vljqbmWhtC1vNQeTD13962Ra7mmPJR67+9Whtfx9kS3ItrJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksELJZTslksHhyvLtdNUSA2LIJXg8xawn7lrWZuRYpMkxMewOa+K7geXFc/ep575SdKRkqlOKoqBaocNIp6Y8Yu6XDRbmPSL7Tk2ibBTsiaLNYwMb6GiwVm6iQlbNY2PJnCCekkJc6iqHwNJ4TDxoz9oegBbXZahmWCcoZZI4m20wHrCN+JblZJvuI+CFksp2SyrZJCyWU7JZLBVZscas9pf3lXyos2ePW+1P7yr1V1NwhtC1/NEeSj13962BUOZ48lHrv70jtfx9h7kXFksp2SyiyxCyWXL9k7L1ZT1zIoKiSKPweN+FhDRjL5ASeU6GhbxmXVyT5PpZZnF8j2HE82u4h7hc26AFpLTaipclVJN0XFksp2SyzssQsllzrZjnnY2kDHPZAdt2wtJawyeJhDiOjFYHpWfYemnfBU7Y57oRIzaS8lwxYXbYGk8nE4OVa9P+POymXqo3yV4a1z3GzWguceZoFyVQZIzzoKqZsEErjI/FgDopGB2FpcdJHMCdKucrjyao+ol+wVxXY0+laP8Aff28inTgpRk37CUqaR3KyWU7JZY2XIWSynZLJYIWSynZLJYIWSynZLJYIWSynZLJYIWSynZLJYIWSynZLJYIWSynZLJYIWWr51ZxSRyNoaBokrpW3JOllNGf/o/p5h7zyA7FlGsjp4ZJ5jhjiYXvPQOQc5PABzrVdjyhe9stfO38fWSOmN9JbGT+LYOgDg9KvGqyZV8Iss082WUjHOcTLPKcc0z9L5H8Nz8ToWfO3LbKOmfI7SQLNaOF7zxWj0q8XOM5q1keVoJcoMmFFTs2yJ7Y3SRGpJ0Ofb80aRy3HSkfXK2JeldjYcxsjyU1KXVHnNTI6pqB+a99rM9wA991sNlr8efOSncFZF+0Ht7wrWhyvSz/APhUQTHmjkY8/AG6iWV20FXhHrsllOyWVbLELJZTslksFLmzx632p/eVeqjza49b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";
            }
        },
        created() {
            this.isAuth = this.$auth.isAuthenticated();
        },
        async created() {
            this.isAuth = this.$auth.isAuthenticated();
            await this.$http
                .get("users/self", { headers: { 'x-auth': this.$auth.getToken() } })
                .then(res => this.setUserData(res, this))
                .catch(e => console.log(e));
        }
}
</script>



<style scoped>

</style>
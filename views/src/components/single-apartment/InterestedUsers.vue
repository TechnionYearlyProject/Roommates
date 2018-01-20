
<template>

<div class="w-100" style="background-color: #eee;">
    <b-card border-variant="light" >
        <b-container>
            <b-card-header v-if="interstedUsers.length==0">
                <h5>no interst in this apartment yet</h5>
            </b-card-header>
            <b-card-header v-if="interstedUsers.length==1">
                <h5>one other person likes this apartment</h5>
            </b-card-header>
            <b-card-header v-if="interstedUsers.length>1">
                <h5>{{interstedUsers.length}} other people like this apartment</h5>
            </b-card-header>
            <b-row>
                <b-col align="center">
                    <b-card v-if="interstedUsers.length!=0">
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
                                                {{user.firstName}} {{user.lastName}}
                                            </b-link>
                                    </b-list-group-item>
                                    <b-list-group-item v-for="p in (5-calUsers.length)" :key="p"><br></b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                            <b-pagination align="center" :total-rows="interstedUsers.length"
                                        v-model="usersPage" :per-page="5" :limit="3" />
                        </b-collapse>
                    </b-card>
                </b-col>
            </b-row>
            <b-card-footer v-if="isAuth">
                <b-button  @click="intres" :pressed="intress" variant="outline-primary"><b-img :src="interested" fluid alt="Responsive image" height="20" width="20"/></b-button>
            </b-card-footer>
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
            intres(){
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
                return this.interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1);
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
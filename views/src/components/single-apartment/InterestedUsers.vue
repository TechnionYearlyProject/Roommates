
<template>

<div class="w-100" style="background-color: #eee;">
    <b-card border-variant="warning" >
        <b-container>
            <b-card-header>
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
                <b-button  @click="intres" >interested{{interested}}</b-button>
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
            'interstedUsers' 
        ],
        data(){
            return{
                isAuth: null,
                show: true,
                intress: false,
                usersPage : 1
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
                if(this.intress){
                    this.intress = false;
                }else{
                    this.intress = true;
                }
                this.$http
                    .put(`apartments/${id}/interested`)
                    .then(res => console.log(res))
                    .catch(e => console.log(e));                
            }
        },
        computed:{
            interestedText(){
                if(this.show){
                    return 'show me interested users';
                }
                return 'hide interested users';
            },
            interested(){
                if(this.intress){
                    return '!!!!!';
                }
                return '?';
            },
            calUsers(){
                return this.interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1);
            }
        },
        created() {
            this.isAuth = this.$auth.isAuthenticated();
        },
        mounted() {
            EventBus.onLogin(() => {
                this.isAuth = this.$auth.isAuthenticated();
            });
        },
}
</script>



<style scoped>

</style>
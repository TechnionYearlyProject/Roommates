
<template>

<div class="w-100" style="background-color: #eee;">
    <b-card border-variant="light" >
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
            interested(){
                if(this.intress){
                    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACrCAMAAAAU5iNYAAAAtFBMVEX////t9fdFXJHc5Odkdatuf7NbbZzl7vCdp8Noeq6vuM9ccZ9gcZ/AzdxOZJdkdaLW3+V2iK1ecqbj5u7x8/dqeqVvf6jj6+5KYJPV2ub5+fvHzd1UaJl+kLLM1uPh5O2LmLm5wdVYbKG3v9OAjrpwhKqkscmXo8DBzdmLl7itu86tts3Bx9m3xNLR1eN5h7akrs6MmMCfn58yMjIKCgrNzc3e3t6VoMWQkJC6urpjY2NISEhBw3w7AAAJFUlEQVR4nNWde1viOBTGpdXKSG1hECgIiDqAo8jszO66t+//vbaFnLRpc5IQEpO+/y3jo/ntueTk5MLFxSdqvx2P0jhOR+vtfvaZf9iohos4CaiSePzcSpa7QRTUlMWb9qHs4jrGEWXqemAnajPnceSK71wP7SR1MY4gWLge2ym6xzmCqEXOdVcN82y82HQXlfQ1cj08dW1KisVtp9OZhGG4XMFn83vX41MWBRktOx0CEob9Mfk0dT0+Zb2RESedo67DIwl8/Oh6gKq6qYF0jiDhoG0mwUBe4POd6xEq6rkOMiEkvZYlrgYICZLwHRLX3vUQ1fRYBwHfCmE6Gbseopp2KAgk5mjoeoxKaoJAkEAGDlaux6ik+wwDoRm414qFSROE+hZk4KwVk6IApF3hvm+CUN/qQri3YYG1T3AQCPds43qUCuKAXFPfgrVKG2b3aROkDJJNi3xrOheAUN96dj1MuXggk4ZvrV0PUy4eyHXDt2LXw5TrgQNS+taSgMwfXI9TKjFICPXWjetxSsUFKYMEmhD+t+qGEQekGST+zyRDnkVK34LC0f9o51qkOZNE3pfyfJAySADE+2XiI6dE4aStxPt2dgozBd8g4bwlIDtYPHW5SYsurua+g1CDTLiOFYZZO0CoQTZ8x6Ix4nuNMiLj7F0jBmlJ1oKUFbxiBmnJPAIRkvJTb65pK2b2NxLJwS1mEFqieL1NMoOdgzGSenO9tqFo7IJBlphjla2tgevBCkQ3pge4QcIF+Zmt69EK9J2MMejjBglJOsg83oCDsjdYoZFeTuw+TyOwiE2GAoPANNJzPVpcOziCghYnhaCL4m/SmsFciBcnhWBH1N/ewwZS77vIIOHW91inqXctSL0h7Qb528SG7cFMlHrLpOVtgUIPm23FBoGk5eu8PoPDmBG2LiSCktHXXYUVRPqjMNJpyejrdPjAi3SeQaDS8jVEYH3LRDrPINAL8jREaPWOdYBKkR/0c0+BOlYqnNMLLb0OEahNmOUU3yCvPofIFhyrOoXwDRKSU7Pxzcl6vrfdB6OO1ZtIDRIKzmjLlM3jgU0WWvQyjRPEIH3RSBU0X9sLrgU4VnVZiIG8CIeposjWAalncBbGsTCQjXCQSprbOY5Dl+msY2Exsj4fxA5JGSDbTk3ced0Ah53TtgMIEGYqBKNcTw4yF+tE5k9EbqH1ni2bHByFy+XyVqJln6/XMQXJVoY5HumssJFDKIvrk4WWFKVndp08pYE+kA/vBGEgtHGRF6cmOYb0hl40kY/uBKEmKfvGJmu1kqOeec8WDtJn+613qzSOol4aS5SOUkz7CkdXPjRTILQrdpjfd73gbEUlh9kAKSTwLWi4FnsSN2dUoBz1zAaIBARmokWl6jYjxRnEFAjUBoOy929Ir/JxnSwBB4DkFjFrkEaJZRkEXGtlFmT+Lh+VWRCy5i+ylkGQhfk4L4Sskg8i64BiHiG59+mLhp6qGMmbFQyhQSD7FjM7mQCerjT0tcKx6suHpCWRQWDvophGUiMgyUvIWYEYkSD5wqGJQ4VC2rTJWSCL/LdaAhEY5AWWcYfO8dgAyHtoDwTngG1Usm1H3Cw7ByS0B4I7Fr3anxxXI/DffoJgFEu6pqI3T7o+g6AclXSZknUu3G3+4iEIGuivJUcMTVO47tgqEFgZVjjoxaEDiPqk/jmuhXdQyF+unLGFSxFfi5FdKutzQPDkC6FdHmGBoxZ+guDZF9oOZUsLqsaDa/kGgs/rpJFfub8Y+wyC+1bz7EfaThBY5JYH1qpVY5tAiAHKA9zjloKM6yBM1egbiKCIJ9NGREGYqtE3EMGqivztsn/d9RkE54AN4fK1iGePQQSeBQeQyq0Rpmr0DAT3LPruUFlssVWjXyAoRx8675Vzz1A1XvoHghuEnmyrHPRiqkavQPDlCHAEaXVnOvYVBON4oTs67JOCWlXjJ4Bg5oAd0KB+FFKrarQPgnBUz+Gk7P4602v0BgSzR4WjfhJy3FKQxjOoWlWjK5CywRg1zgFqVY3WQdDcC8NtHrHVqhrtBzs6G8Ik8lYH0aoa7YOgJoGeVuO1IaZqVM2/7uYR+uJm4yQNvH/lGwjqW6QT37jwx/Qa2wACd07qx820qkYfQBppS6fX6BKki1hEq2p0CUKKw+bbCswOtT8gGAdUKc23FXSqRofzCNS/zdc2dapGhzM7vZ7SANGpGt3VWrCu4rxso1M1Oqt+6cKKc0RWp2q0DYI5Fj3ukHAuyt34B4I5VrkvnXJO9uv0Gu2CIBz98r4J966FTtVoFYTvV8vKtZlkxeGg13BO6TXaBEHsUfmuD+TlU52q0SYIEugVjjFy9aXnFwhikZGUQ6fYshojfBD6XQz4XWvfQLCkBT1f9LqIRtVoN/0iJoHtNvTJDo2q0S4INq8T10Hf3dOoGp1MiDCxJ9jNQ3g+yhsQzLegpYVd0NWoGt2AwOIQe5+HqRrxieTq5uFu+PjDIQiJ9gz77iu1XuO3Y66Y/eUOhCxG0NdClXaoryDnzb5ZB8GCHc6fYOl3qFJsFQuZj4uPvDrYWwdB0u+tbEJUqhrz3P3nH7Pff+UmsQ6CGARqFPw5mGqvEUtbhTlnF4dy7crJeoRezU3w77mLFUByi3z8N/v3n/zHv9RAFoXWo4WpuzB8DrrMjfH76yMFkOfcBf+++PWR54a6a4GyrhGz8A1C2w6ipylVqkaatS5+AshlUFfPwL03PkfZdhC98qZUNf4kFv3tEgfJA/Fc/+KnXrqZGySixyqYqhGdEX/s8mDf/7ykIHXXOv6S1VA+2hM5lpV70cIHHZmqUbTYpf+Gg+T/z7bTiW6w8Diq7RPJw09M1ai0aheBUKA5qKes9YDVej1mbndH4q8YZXaolS5fcECSwL7mkncpNW/DsCDfzV6M50lij1rVqC42a+12Zm9iN5Sl0rebmF6jJki+SJhyvyrblKKt/EUapmrUBCkW0ncDa+41Hyg9pWXg/Yrjaud+ZANl3lsoPm6Wyn+Z9I+RZdt0NYojg4rT0Wqv/MzRQD5Qmfx4onB6vkN48pUC9Ok4XQlruU/UbHweSeLNa6SzbaSPksVGH4Y6U3ePXV3t/P7ukFbpf32YIgjrZZQLAAAAAElFTkSuQmCC";
                }
                return "data:image/png;base64,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";
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
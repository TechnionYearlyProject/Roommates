
<template>

<div class="w-100" style="background-color: #eee;">
    <b-card border-variant="warning" >
        <b-container>
            <!-- <b-row>
                <b-col align="center" cols="4">
                    <b-img :src="auther.img" rounded="circle" width="100" height="100" fluid alt="Responsive image" />
                </b-col>
                <b-col align="center" cols="8">
                    <h4>{{auther.firstName}} {{auther.lastName}}</h4>
                    <b-img src="data:image/png;base64,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"
                            style="width:20px;height:auto"/><br> {{auther.contactInfo.cellNumber}} <br>
                    <b-img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAAb1BMVEX///8AAABvb29cXFxUVFRsbGySkpIwMDD4+Pjr6+uBgYHv7+9+fn719fViYmJ4eHjk5OSHh4eenp7IyMgcHBzb29siIiINDQ2rq6u7u7tnZ2fS0tLBwcEUFBQ2NjYnJyeamppJSUk9PT2np6dHR0cL2y+QAAAEfUlEQVR4nO3da1viMBCG4XAQK1AQz+IJ1P//G1fQVWZyaEKTzLj7Ph8F295XSgtpRWMQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEELon2syHqlrfFcYvR4obFIYfSINdAU00EADDTTQQHvQw+WwbsuxPHpUeI1WZ0/y6MG48CpZ5xp278pqh1nmQFZR7TILHb2rqc+cqxc6ZVVSO8dZ7jxdRe0xV0SP6OmywpnLvW9XRS/Ma101M09+Vl9xpE1dNTOvzKkMmqkXJVdsmcXQ5plsybrcepl5agTRTF1srB1mQXRTZaxdZkG0aU7J9pyUWKnTLIk2zQvZomH+dbrNomg+1tnVM7dZFs3Hepl3jbNbsvT59wOyaNPclFP7xlkcbVqqnnt/PTlmPlyyNNq0dN5q6vv11Lz7tlGANi3dukzqkFkBushYB80a0HwLV/3XFTarQPNjTm/1jO471tFRBTqzmo2zfR7UgbbmNvqsqO0YZzVoPtY9NoaZXe93tKCzjXXbtW8bRehM6ohx1oTOom6vIsya0BnUUeOsC82vQ2xSVxFp1oXuqY7bt402dC91tFkbmqsv4pcfu28bfWhzfaS6TZiDUYc+Us3M4TlGfWiufotZeENfzx3zqgrRXB1x933SOOtEJ6ubNLNOtHlIUqft20YrOkmdfnVIKZqr7/3PZOaY64Ba0dHq1NfzLrVo8x6lZuN8FbVotejtgOVUM3PkHQ1a0dad2U4127d3xdzRoBQ9ss2DwSN/ljXOu37t0dtpttTsmn68WiV64TYztXOcd3Ve5daIDvyJy4HaM867uq5yK0QPCYDeePWjZndk0TqufOpDM7N5pJ6vzbyk8yRrdhwPXw1Th14yszH3bBhH09WcnarW1gxZUKMNPSeb/tLsfsbVVvtzM7ueE+IoQ0/Jht80nz/tUH+9C2NXaDf+tehCr6i5/fvzoPr7PRhT+2fXVKGp+an9eSSgPni3za4LeWfXNKEnZJNv28PH7iLM1qy5b+5BEZqZZ/RRz1iz95xxaj3oC7q9M/44m1X4zHrdRqnVoJn5zH5GQ0/hHz1f289iM6nOT+Fa0G+d5o/OyRltcel8UoRaCZodp869S3nYLLevz+/DzWXrewpTW5/CtaCjzVGxV7+tVoFmR2bHKzUtprZeBhrQuc2dagXo/OaPT550mQ/0UXn0Y3D7ji2oFkeXMYeXK40O74d9CrxqhNFdx9k+MfXBeVAWXdIcOPuLojvfRfTMp5ZEx3w26JfnHb0gurzZp5ZD1zB7PrGKoSNndnq3oevZz01IoWuZnWohNDNH3RV4bHTu7aqVQrO52oR7fY+JzaY3IuhFW9VsqQ++eKMeekuvpm8Kr9jwq0XvEiNNK73efdZEqiy6iplf9RZGZ/i74bjcahF0tm8D6M75peoS6Izf+9Cd654lAXRVs1NdH11x3/7M3sMFvhZ3XDsFaAUBDTTQQAMNNND7/sv/onRxUvl/MUS0LjTbjhBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQpL9AYUZSAL+6WzgAAAAAElFTkSuQmCC"
                            style="width:30px;height:auto"/><br> {{auther.contactInfo.eMail}}<br>                 
                </b-col>
            </b-row> -->
            <b-card-header>
                <h5>{{interstedUsers.length}} other people like this apartment</h5>
            </b-card-header>
            <b-row>
                <b-col align="center">
                    <b-card>
                            <b-container fluid>
                                <b-row>
                                    <b-col align="center">
                                        <b-btn v-b-toggle.collapse1 variant="primary" align="center" @click="hideAndShow">{{interestedText}}</b-btn>
                                    </b-col>
                                </b-row>
                            </b-container>
                        <b-collapse id="collapse1" class="mt-2">
                            <b-card-body>
                                <b-list-group>
                                    <b-list-group-item v-for="user in interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1)" :key="user">
                                            <b-link :to="{ name: 'user-profile', params: { id: user._id } }">
                                                {{user.firstName}} {{user.lastName}}
                                            </b-link>
                                    </b-list-group-item>
                                    <b-list-group-item v-for="p in (5-interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1).length)" :key="p"><br></b-list-group-item>
                                </b-list-group>
                            </b-card-body>
                            <b-pagination align="center" :total-rows="interstedUsers.length"
                                        v-model="usersPage" :per-page="5" limit='3' />
                        </b-collapse>
                    </b-card>
                </b-col>
            </b-row>
            <b-card-footer>
                <b-button>like it too</b-button>
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
    
export default {
        name: "auther-and-interested-users",
        components:{
            bContainer, bRow, bCol, bImg, bCard, bCardImg, bCardFooter, bCardHeader
        },
        props:[
            'interstedUsers', 'auther', 
        ],
        data(){
            return{
                show: true,
                interestedText: 'show me interested users',
                usersPage : 1
            }
        },
        methods:{
            hideAndShow(){
                if(show){
                    interestedText = 'hide interested users';
                    show = false;
                }else{
                    interestedText = 'show me interested users';
                    show = true;
                }
            }
        }
}
</script>



<style scoped>

</style>
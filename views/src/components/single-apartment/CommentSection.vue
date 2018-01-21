
<template>

<div class="w-70" style="background-color: #eee;">
    <b-card border-variant="light"  bg-variant="secondary">
        <b-container>
            <b-row>
                <b-col align="center">
                    <b-card bg-variant="light">
                        <b-card-header bg-variant="white">
                            <b-container fluid>
                                <b-row>
                                    <h3>users comments</h3>
                                </b-row>
                            </b-container>
                        </b-card-header>
                        <b-card-body v-if="comments.length==0" bg-variant="light">
                            <h1>
                                no comments yet....
                            </h1>
                        </b-card-body>
                        <b-card-body v-if="comments.length!=0" bg-variant="light">
                            <b-list-group>
                                <b-list-group-item v-for="comment in comments.slice(5 * (this.comPage) - 4, 5 * (this.comPage) + 1)" :key="comment">
                                    {{comment.comment}} at: {{comment.writenAt}}
                                </b-list-group-item>
                                <b-list-group-item v-for="p in (5-comments.slice(5 * (this.comPage) - 4, 5 * (this.comPage) + 1).length)" :key="p"><br></b-list-group-item>
                            </b-list-group>
                        </b-card-body>
                        <b-card-body v-if="comments.length!=0" bg-variant="light">
                            <b-pagination align="center" :total-rows="comments.length"
                                    v-model="comPage" :per-page="5" />
                        </b-card-body>
                        <b-card-footer v-if="isAuth" bg-variant="white">
                            <b-btn v-b-toggle.collapse1 variant="primary" align="center" >leave a comment</b-btn>
                            <b-collapse id="collapse1" class="mt-2">
                                <checked-form @updated="updateComment" label="Comment:" labelFor="email" inputType="text"></checked-form>
                                <b-button @click="addNewComment" v-if="newComment.length!=0">submit</b-button>
                            </b-collapse>
                        </b-card-footer>
                    </b-card>
                </b-col>
            </b-row>
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
    import bForm from "bootstrap-vue/es/components/form/form";
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
    import CheckedForm from "@/components/identification/CheckedForm.vue";
    import EventBus from "../../event-bus/EventBus";


export default {
        name: "comment-section",
        components:{
            bContainer, bRow, bCol, bImg, bCard, bCardImg, bCardFooter, bCardHeader,
            bForm, bFormInput, CheckedForm
        },
        props:[
            'comments', 'id'
        ],
        data(){
            return{
                isAuth: null,
                comPage : 1,
                newComment:''
            }
        },
        methods:{
            updateComment(newComment) {
                this.newComment = newComment;
            },
            addNewComment(){
                var iden = this.id
                this.$http
                    .put(`/apartments/${iden}/comment`, {headers: {'x-auth': this.$auth.getToken() }},{text: this.newComment})
                    .then(res => {
                        newComment = '';
                        console.log(res);})
                    .catch(e => console.log(e));
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
        computed:{
            calCom(){
                return comments.slice(5 * (this.comPage) - 4, 5 * (this.comPage) + 1);
            }
        }
}
</script>



<style scoped>

</style>
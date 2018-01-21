<template>
<bContainer>
<b-card>
<div id="user_profile_container" class="centralize_div">
      <h1> {{user.firstName}} {{user.lastName}} </h1>
      <p class="about_me"> {{user.about}} </p>
    <div id="user_profile_header" class="centralize_div">
      <profilePic :img_src=user.image></profilePic>
      <profileTags :tags="tags"></profileTags>
      <br>
      <profileGeneralDetails :user_details="user"></profileGeneralDetails>
    </div>
</div>
</b-card>
</bContainer>
</template>

<script>
    import bImg from 'bootstrap-vue/es/components/image/img';
    import profilePic from "@/components/user-profile/ProfilePicture.vue"
    import profileGeneralDetails from "@/components/user-profile/profileGeneralDetails.vue"
    import profileTags from "@/components/user-profile/ProfileTags.vue"
    import bContainer from 'bootstrap-vue/es/components/layout/container';
    import bCard from 'bootstrap-vue/es/components/card/card';

    export default {
        name: 'user-profile',
        props: [
          'id'
        ],
         data: function() {
            return {
              user: [],
              tags: []
            };
        },
        components:{
          bImg,profilePic, profileGeneralDetails, profileTags, bContainer, bCard
        },
        async created() {
          await this.$http
                          .get("users/tags")
                          .then(res => this.setTags(res, this))
                          .catch(e => console.log(e));
          await this.$http
                          .get("users/" + this.id)
                          .then(res => this.setProfile(res, this))
                          .catch(e => console.log(e));
        },
        methods: {
            setProfile(responseFromServer, pThis){
              pThis.user = responseFromServer.body.user;
              pThis.calcUserTags(pThis.user.hobbies, pThis.tags, pThis);
            },
            setTags(responseFromServer, pThis){
              pThis.tags = responseFromServer.body.tags;
            },
            calcUserTags(userTags, allTags, pThis){
              var userVerboseTags = [];
              allTags.forEach(function(tag) {
                  if(userTags.indexOf(tag._id) > -1){
                    userVerboseTags.push(tag);
                  }
              });
              pThis.tags = userVerboseTags;
            }
          }
    }
  
</script>

<style scoped>
bContianer{
  width: 80%;
}
.centralize_div{
  vertical-align:middle; 
  text-align:center;
}
.user_profile_header_element{
  width: 80%;
  display: inline-block;
}
</style>

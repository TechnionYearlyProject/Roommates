<template>
<div id="user_profile_container" class="centralize_div">
    <h1> {{user.firstName}} {{user.lastName}} </h1>
    <p> {{user.about}} </p>
    <div id="user_profile_header" class="centralize_div">
      <profilePic :img_src=user.image ></profilePic>
      <profileTags :tags="tags"></profileTags>
      <br>
      <profileGeneralDetails :user_details="user"></profileGeneralDetails>
    </div>
</div>
</template>

<script>
    import bImg from 'bootstrap-vue/es/components/image/img';
    import profilePic from "@/components/user-profile/ProfilePicture.vue"
    import profileGeneralDetails from "@/components/user-profile/profileGeneralDetails.vue"
    import profileTags from "@/components/user-profile/ProfileTags.vue"

    export default {
        name: 'user-profile',
         data: function() {
            return {
              user:
                {
                  firstName: 'Adi',
                  lastName: 'Omari',
                  birthdate: 1435479435,
                  gender: 'male',
                  mobilephone: '0542312213',
                  image: '@/../static/images/user-profile/avatar-image.png',
                  about: 'I am a mentor',
                  hobbies: [1,3],
                  _publishedApartments: [1],
                  _interestedApartments: [2],
                  email: 'adi@gmail.com'
                },
                tags: [
                    {
                       value: 1,
                       text: "Tag1"
                    },
                    {
                       value: 2,
                       text: "Tag2"
                    },
                    {
                       value: 3,
                       text: "Tag3"
                    },
                    {
                       value: 4,
                       text: "Tag4"
                    },
                    
                ]
            };
        },
        components:{
          bImg,profilePic, profileGeneralDetails, profileTags
        }
    }
  
</script>

<style scoped>
.centralize_div{
  vertical-align:middle; 
  text-align:center;
}
.user_profile_header_element{
  width: 80%;
  display: inline-block;
}
</style>

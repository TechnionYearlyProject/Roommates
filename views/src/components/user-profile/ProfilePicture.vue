<template>
<div>
      <b-img  v-if="img_src !== ''" center rounded="circle" width="150" height="150" :src=img_src alt="profile picture" class="m-1" /> 
      <b-img v-if="img_src === ''" center rounded="circle" width="150" height="150" src='@/../static/images/user-profile/avatar-image.png'  class="m-1" /> 
</div>
</template>

<script>
    import bImg from 'bootstrap-vue/es/components/image/img';
    export default {
         props: [
          'img_src'
        ],
        components:{
          bImg
        }
    }
</script>

<style scoped>

</style>
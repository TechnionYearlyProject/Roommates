<template>
<div>
      <b-img center rounded="circle" width="150" height="150" :src=img_src alt="img" class="m-1" />  
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
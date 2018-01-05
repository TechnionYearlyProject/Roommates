<template>
<div class="card-text">
      <icon name="mobile"/> {{user_details.mobilephone}} | <icon name="envelope"/> {{user_details.email}} | <icon name="birthday-cake"/> {{user_details.birthdate}} |
      <span v-if="user_details.gender === 'male'" ><icon name="male"/> Male</span>
      <span v-if="user_details.gender === 'female'" ><icon name="female"/> Female</span>
</div>
</template>

<script>
    import Icon from 'vue-awesome/components/Icon';
    export default {
         props: [
          'user_details'
        ],
        components:{
          Icon
        }
    }
</script>

<style scoped>
.card-text {
    background-color: #fdc600;
    border-color: #fdc600;
    text-transform: uppercase;
    line-height: 1.5;
    color: #fff;
    display: inline-block;
    text-align: left;
    white-space: nowrap;
}
</style>
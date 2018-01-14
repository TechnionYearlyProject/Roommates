<template>
<div class="card-text">
      <span v-if="user_details.mobilePhone !== ''"><icon name="mobile"/> {{user_details.mobilePhone}} | </span>
      <span v-if="user_details.email !== ''"><icon name="envelope"/> {{user_details.email}} | </span>
      <span v-if="user_details.birthdate !== ''"><icon name="birthday-cake"/> {{birthdate}} | </span>
      <span v-if="user_details.gender === 'male'" ><icon name="male"/> Male</span>
      <span v-if="user_details.gender === 'female'" ><icon name="female"/> Female</span>
</div>
</template>

<script>
    import Icon from 'vue-awesome/components/Icon';
    export default {
         props: [
          'user_details',
          'birthdate'
        ],
        components:{
          Icon
        },
        created() {
          this.birthdate = this.unixTsToReadableDate(this.user_details.birthdate);
        },
        methods: {
            unixTsToReadableDate(udate) {
              var d = new Date(udate);
              return (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
            }
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
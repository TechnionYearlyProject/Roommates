<template>
  <b-container>
    <b-row class="box">
      <b-button size="md" class="btn-interested" :style="{'background-color': expressedInterest? '#D5F500' :'#fdc600', border: 'none'}" v-b-popover.hover.left="popUpExpressInterest" @click="expressInterest">
        <interested-banner activeColor="#fff"></interested-banner>
      </b-button>

      <b-button class="interested-list btn-interested" @click="openInterestList">
        interested
        <b-badge variant="warning">{{ this.apartment._interested.length }}</b-badge>
        <interested-list :apartment="apartment"></interested-list>
      </b-button>
    </b-row>
  </b-container>
</template>

<script>
  import InterestedBanner from "@/components/interested/InterestedBanner.vue";
  import InterestedList from "@/components/apartment2/InterestedList.vue";

  export default {
    props: ["apartment", "expressedInterest", "isAuth"],
    methods: {
      async expressInterest() {
        console.log("expressedInterest");
        if (this.isAuth) {
          await this.$http
            .put(`apartments/${this.apartment._id}/interested`)
            .then(res => {
              this.$emit("interestedExpress", res.body.apartment);
              console.log(res.body.apartment);
            });
        }
      },
      popUpExpressInterest() {
        if (this.isAuth) {
          return this.expressedInterest ? "" : "Express Interest!";
        } else {
          return "You have to login in order to express interest";
        }
      },
      openInterestList() {

      }
    },
    components: {
      InterestedBanner,
      InterestedList
    }
  };
</script>

<style scoped>
  .box {
    background-color: #eee;
  }

  .interested-list {
    width: 80%;
    background-color: #eee;
    color: #000;
    border: 0;
  }

  .btn-interested{
    cursor: pointer;
  }
</style>

<template>
  <b-container>
    <b-row class="box">
      <b-button size="md" class="btn-interested" :style="{'background-color': expressedInterest? '#D5F500' :'#fdc600', border: 'none'}" v-b-popover.hover.left="popUpExpressInterest" @click="expressInterest">
        <interested-banner activeColor="#fff"></interested-banner>
      </b-button>

      <b-button class="interested-list btn-interested" @click="openInterestList">
        interested
        <b-badge variant="warning">{{ apartment._interested.length }}</b-badge>
      </b-button>
      <b-modal v-model="showList" id="modal-center" centered hide-footer :title="title">
        <b-list-group>
          <b-list-group-item v-for="user in inerestedList">
            <router-link :to="{ name: 'user-profile', params: { id: user._id} }">
              <div class="list-name">
                <icon name="address-card-o" scale="1.3" class="icon-big" />
                  {{ user.firstName }} {{ user.lastName }}
                  </div>
            </router-link>
          </b-list-group-item>
        </b-list-group>
      </b-modal>
    </b-row>
  </b-container>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";
  import InterestedBanner from "@/components/interested/InterestedBanner.vue";

  export default {
    props: ["apartment", "expressedInterest", "isAuth"],
    data() {
      return {
        title: "These people are interested in the apartment",
        inerestedList: [],
        showList: false
      };
    },
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
        if (!this.isAuth || this.apartment._interested.length <= 0) {
          this.showList = false;
          return;
        }
        this.$http
          .get(`apartments/${this.apartment._id}/interested`)
          .then(res => {
            this.inerestedList = res.body._interested;
            console.log(res);
            this.showList = true;
          });
      }
    },
    components: {
      InterestedBanner,
      Icon
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

  .btn-interested {
    cursor: pointer;
  }

  .list-name {
    text-align: center;
  }

  .icon-big {
    line-height: 120%;
    vertical-align: middle;
    margin-top: -5px;
    margin-right: 5px;
  }
</style>

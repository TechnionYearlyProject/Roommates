<template>
  <b-container>
    <b-row class="box">
      <b-col>
        <profilePic :img_src="publisher.image" class="image"></profilePic>
      </b-col>
      <b-col>
        <b-col cols="12" class="user-name">
          <router-link :to="{ name: 'user-profile', params: { id: publisher._id} }" class="user-name">
            {{ publisher.firstName }} {{ publisher.lastName }}
            <icon name="address-card-o" scale="2" class="icon-big"></icon>
          </router-link>

        </b-col>
        <b-col cols="12">
          <icon name="envelope-o" scale="1.5" class="icon" />
          <span class="user-info">{{ publisher.email }}</span>
        </b-col>
        <b-col cols="12">
          <icon name="phone" scale="1.7" class="icon" />
          <span class="user-info">{{ publisher.mobilePhone }}</span>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import profilePic from "@/components/user-profile/ProfilePicture.vue";
  import Icon from "vue-awesome/components/Icon";

  export default {
    props: ["publisher"],
    components: {
      profilePic,
      Icon
    }
  };
</script>

<style scoped>
  .box {
    background-color: #777;
    color: #fff;
    padding: 20px 0;
  }
  .image {
    margin: 0;
    margin-bottom: 15px;
  }
  .user-name {
    font-size: 20px;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 10px;
    color: #fff;
  }
  .icon-big,
  .icon {
    line-height: 120%;
    vertical-align: middle;
    margin-top: -5px;
  }
  .icon {
    padding-right: 8px;
    font-weight: 500;
    display: inline-block;
  }
  .user-info {
    line-height: 28px;
    font-size: 17px;
    font-weight: 300;

  }
</style>

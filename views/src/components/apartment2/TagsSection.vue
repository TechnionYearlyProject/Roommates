<template>
  <b-container class="tag-box">
    <b-row>
      <ul>
        <li v-for="(i, j) in apartment.tags" :key="j">
          <b-col sm="12">
            <icon :name="tags[i-1].vicon" scale="1.7" class="icon mr-3" />
            <span class="tag-info">{{ tags[i-1].name }}</span>
            </b-form-checkbox>
          </b-col>
        </li>
      </ul>
    </b-row>
  </b-container>
</template>

<script>
 import Icon from "vue-awesome/components/Icon";
 import Tags from "@/../static/js/tags";

  export default {
     props: ["apartment"],
     data() {
       return {
         tags: Tags
       }
     },
     components: {
       Icon
     }
  };
</script>

<style scoped>
ul {
  padding-left: 5px;
}
  li {
    padding-bottom: 15px;
    display: inline-block;
    width: 230px;
  }

.tag-box {
  padding: 20px 0px;
}
  .icon {
    width: 30px;
    text-align: left;
    color: #ffa500;
    font-size: 100px;
    margin: 0 10px;
    line-height: 120%;
    vertical-align: middle;
    margin-top: -5px;
  }

  .tag-info {
    font-weight: 300;
    color: #777;
  }

</style>

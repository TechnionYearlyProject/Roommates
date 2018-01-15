<template>
  <b-container>
    <b-row class="ml-2 mt-5" style="text-align:left">
      <ul>
        <li v-for="(tag, i) in tags" :key="tag.key">
          <b-col sm="12">
            <b-form-checkbox :id="tag.key+'CB'" v-model="info.tags" :value="i" :disabled="isReadOnly">
              <icon :name="tag.vicon" scale="1.7" class="icon mr-3" />
              </i>
              <span>{{ tag.name }}</span>
            </b-form-checkbox>
          </b-col>
        </li>
      </ul>
    </b-row>
  </b-container>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";
  import Tags from '@/../static/js/tags'

  export default {
    data() {
      return {
        tags: Tags
      };
    },
    props: ["info", "isReadOnly"],
    components: {
      Icon
    }
  };
</script>

<style scoped>
  label {
    margin-left: 20px;
  }

  li {
    display: inline-block;
    width: 300px
  }

  .icon {
    width: 30px;
    text-align: center;
    color: #777;
    font-size: 100px;
    margin: 0 10px;
    line-height: 120%;
    vertical-align: middle;
    margin-top: -5px;
  }

  .form-check {
    width: 75%;
  }

  .form-check-input {
    vertical-align: middle;
    width: 20px;
    height: 20px;
    float: left;
  }
</style>

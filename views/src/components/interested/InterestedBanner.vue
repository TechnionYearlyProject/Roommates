<template>
  <icon label="interested" :style="{ color: activeColor }">
    <icon name="circle-o" scale="3" />
    <icon name="star" scale="2" style="margin-top:5px;" />
  </icon>
</template>

<script>
  import Icon from "vue-awesome/components/Icon";
  export default {
    props: {
      activeColor: {
        type: String,
        default: "#ffc107"
      },
    },
    components: {
      Icon
    }
  };
</script>

<style>
  
</style>

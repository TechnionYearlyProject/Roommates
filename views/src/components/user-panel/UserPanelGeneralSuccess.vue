<template>
  <b-container>
    <div style="text-align: center">
      <h2>
      <icon name="check-circle" scale="3" class="big-icon" />
    </h2>
    <h3>
      {{labelText}}
    </h3>
    <b-button variant="primary" size="lg" :to="{ name: 'user-panel'}">Go to your control panel
    </b-button>
    </div>
    
  </b-container>

</template>

<script>
  import Icon from "vue-awesome/components/Icon";

  export default {
    props: ['userId', 'labelText'],
    components: {
      Icon
    }
  };
</script>

<style scoped>
h3 {
    word-spacing: 1px;
    text-align: center;
    margin-bottom: 30px;
    letter-spacing: 1px;
    color: #777;
}
 .big-icon {
   color: #d5f500;
 }
</style>

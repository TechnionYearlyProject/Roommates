<template>
  <b-container>
    <div style="text-align: center">
      <h2>
      <icon name="check-circle" scale="3" class="big-icon" />
    </h2>
    <h3>
      Your Apartment has been uploaded successfully!
    </h3>
    <b-button variant="primary" size="lg" :to="{ name: 'apartment-page', params: { id: apartmentId } }">Go check it out!
    </b-button>
    </div>
    
  </b-container>

</template>

<script>
  import Icon from "vue-awesome/components/Icon";

  export default {
    props: ['apartmentId'],
    methods: {
      toApartment() {

      }
    },
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

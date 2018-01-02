<template>
<div>
  <section>
    <app-apartment-list></app-apartment-list>
    <router-link to="/apartment/:id">view ad</router-link>
    <app-apartment-adder></app-apartment-adder>
  </section>
</div>
</template>

<script>
import ApartmentList from "./apartment/ApartmentList.vue";
import ApartmentAdder from "./apartment/ApartmentAdder.vue";

export default {
  components: {
    appApartmentList: ApartmentList,
    appApartmentAdder: ApartmentAdder
  }
};
</script>

<style>

</style>

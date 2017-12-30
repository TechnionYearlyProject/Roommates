<template>
<div>
  <section>
    <app-main-search-box></app-main-search-box>
  </section>
  <section>
    <app-apartment-list></app-apartment-list>
    <app-add-apartment></app-add-apartment>
  </section>
</div>
</template>

<script>
import MainSearchBox from "./MainSearchBox.vue";
import ApartmentList from "./ApartmentList.vue";
import AddApartment from "./AddApartment.vue";

export default {
  components: {
    appMainSearchBox: MainSearchBox,
    appApartmentList: ApartmentList,
    appAddApartment: AddApartment
  }
};
</script>

<style>

</style>

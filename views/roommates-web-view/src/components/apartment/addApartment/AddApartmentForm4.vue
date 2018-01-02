<template>
<div>
  <div class="container">
    <app-add-apartment-form1 :info="info1" :isReadOnly="true"></app-add-apartment-form1>
    <hr>
    <app-add-apartment-form2 :info="info2" :isReadOnly="true"></app-add-apartment-form2>
    <hr>
    <app-add-apartment-form3 :info="info3" :isReadOnly="true"></app-add-apartment-form3>
  </div>
</div>
</template>

<script>
import AddApartmentForm1 from "@/components/apartment/addApartment/AddApartmentForm1.vue";
import AddApartmentForm2 from "@/components/apartment/addApartment/AddApartmentForm2.vue";
import AddApartmentForm3 from "@/components/apartment/addApartment/AddApartmentForm3.vue";

export default {
  props: ['info1', 'info2', 'info3'],
  components: {
    appAddApartmentForm1: AddApartmentForm1,
    appAddApartmentForm2: AddApartmentForm2,
    appAddApartmentForm3: AddApartmentForm3
  }
};
</script>

<style scoped>
input {
 vertical-align: middle;
}

.s-icon {
  display: inline-block;
  width: 30px;
  text-align: center;
  color: #777;
  font-size: 300%;
  margin-right: 10px;

  /* secrets to align text and icons */
  line-height: 120%;
  vertical-align: middle;
  margin-top: -5px;
}
</style>

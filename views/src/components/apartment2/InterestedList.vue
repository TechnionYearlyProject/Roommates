<template>
  <div>
  <b-btn v-b-modal.modal-center>{{ title }}</b-btn>

  <!-- Modal Component -->
  <b-modal id="modal-center" centered :title="title">
    <b-list-group>
  <b-list-group-item v-for="user in interestedList">{{ user.firstName }} {{ user.lastName }}</b-list-group-item>
</b-list-group>
  </b-modal>
</div>
</template>

<script>
export default {
  props: ['interestedList'],
 data() {
   return {
     title: 'These people are interested in the apartment'
   }
 },
 mounted() {
   this.$http
            .get(`apartments/${this.apartment._id}/interested`).
 }
}
</script>

<style>

</style>

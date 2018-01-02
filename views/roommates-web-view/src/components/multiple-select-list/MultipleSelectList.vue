<template>
<div class="multiple_select_list_container">
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
        <label class="btn btn-secondary" v-for="item in items" v-bind:class="{ active: selected_items.indexOf(item._id) >= 0}">
          <input type="checkbox" autocomplete="off" :id=item._id> {{item.text}}
        </label>
    </div>
</div>
</template>

<script>
    export default {
         props: [
          'items',
          'selected_items'
        ]
    }
</script>

<style scoped>
.btn-secondary:not([disabled]):not(.disabled).active, .btn-secondary:not([disabled]):not(.disabled):active, .show>.btn-secondary.dropdown-toggle{
  background-color: orange;
  border-color: orange;
}
</style>

<template>
<div class="r-apartment-price">
   &#8362; {{ apartment.price }}
</div>
</template>

<script>
export default {
  props: [
    'apartment'
  ]
}
</script>

<style>
  .r-apartment-price {
  background-color: #f1c40f;
  padding: 5px 2px;
  width: 40%;
  overflow: hidden;
  font-size: 120%;
  text-align: center;
  color: #333;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  letter-spacing: 1px;
}
</style>

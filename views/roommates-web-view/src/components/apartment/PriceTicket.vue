<template>
<div class="s-apartment-price">
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
  .s-apartment-price {
  color: #f1c40f;
  padding: 5px 5px;

  overflow: hidden;
  font-size: 120%;
  text-align: center;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  letter-spacing: 1px;
}

@media only screen and (max-width: 768px) {
    .s-apartment-price {

      width: 100%;
      border-radius: 0;
      font-size: 130%;
  }
}
</style>

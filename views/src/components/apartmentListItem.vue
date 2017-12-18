<template>
    <li>
        Address: {{ address }}, Price: {{ price }}
      <img :src="img" alt="Error :-(" style="width: 100px; height: auto" />

        <router-link :to="{ path: '/apartment', query: { id: id }}">Go To Apartment</router-link>
    </li>
</template>

<script>
    export default {
        name: 'ap-list-item',
        props: ['itemId', 'itemAddress', 'itemPrice', 'itemImg'],
        data: function() {
            return {
                address: this.itemAddress,
                id: this.itemId,
                price: this.itemPrice,
                img: this.itemImg
            }
        },
        methods: {

        }
    }
</script>

<style>
  li {
    margin: 0 10px;
  }
</style>

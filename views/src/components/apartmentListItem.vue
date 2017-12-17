<template>
    <li>
        Address: {{ address }}, Price: {{ price }}

        <button>details</button>
    </li>
</template>

<script>
    export default {
        name: 'ap-list-item',
        props: ['itemIndex', 'itemAddress', 'itemPrice'],
        data: function() {
            return {
                address: this.itemAddress,
                index: this.itemIndex,
                price: this.itemPrice
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

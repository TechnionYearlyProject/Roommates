<template>
    <paypal
        :amount="`${amount}`"
        currency="USD"
        locale="en_US"
        :env="env"
        :client="client"
        @payment-completed="completed"></paypal>
</template>

<script>
  import Paypal from 'vue-paypal-checkout';

  export default {
    name: 'AppPayPal',
    props: {
      amount: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        client: {
          sandbox: 'AepL8u6CB1mzg62B53HXTtfboSZbe7d9lCbDnDbAo5nBS9q4nKx4YzdHUKoTnGa9PV1KPYxQX-BqDNuz',
          production: ''
        },
        env: 'sandbox'
      };
    },
    methods: {
      completed(data) {
        this.$emit('completed', data);
      }
    },
    components: {
      Paypal
    }
  };
</script>

<style scoped>

</style>
<template>
    <div>
        <v-container>
            <app-paypal :amount="amount"></app-paypal>
        </v-container>
    </div>
</template>

<script>
  import AppPaypal from './sub-components/AppPayPal';

  export default {
    name: "AppPayment",
    props: {
      price: {
        type: Number,
        required: false
      }
    },
    data() {
      return {
        amount: 100
      };
    },
    components: {
      AppPaypal
    }
  }
</script>

<style scoped>

</style>
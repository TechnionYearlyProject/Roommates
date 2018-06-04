<template>
    <div>
        <v-container>
            <app-paypal :amount="amount" @completed="paymentSuccess"></app-paypal>
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
    methods: {
      paymentSuccess(payment) {
        if (payment.state === 'approved') {
          alert(`success!\nID: ${payment.id}`);
        }
      }
    },
    components: {
      AppPaypal
    }
  }
</script>

<style scoped>

</style>
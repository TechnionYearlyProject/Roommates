<template>
    <div>
        <div :class="disabled ? 'to-hide' : ''">
            <paypal
                    :amount="`${amount}`"
                    currency="USD"
                    locale="en_US"
                    :env="env"
                    :client="client"
                    @payment-completed="completed"></paypal>
        </div>

        <div :class="disabled ? 'hider' : ''"></div>
    </div>
</template>

<script>
  import Paypal from 'vue-paypal-checkout';

  export default {
    name: 'AppPayPal',
    props: {
      amount: {
        type: Number,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
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
  .to-hide {
      z-index: 0;
      position: relative;
      filter: grayscale(100%);
  }

  .hider {
      width: 150px;
      height: 40px;
      z-index: 2;
      position: relative;
      margin: -40px auto 0;
  }
</style>
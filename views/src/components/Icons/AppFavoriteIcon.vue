<template>
    <v-tooltip top slot="activator">
        <v-btn icon slot="activator" :class="fav ? 'red--text' : ''" @click.native="favorite">
          <v-icon :large="large">favorite</v-icon>
        </v-btn>
        <span>{{ interestedMessage }}</span>
      </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    apartmentId: {
      type: String,
      required: true
    },
    large: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      interestedMessage: 'I\'m interested!'
    }
  },
  methods: {
    favorite() {
      if (!this.isAuthenticated) {
        this.interestedMessage = "Please login first";
      } else if (!this.isVerified) {
        this.interestedMessage = "Please verify account";
      } else {
        this.fav = !this.fav;
        this.$store
          .dispatch("favor", { id: this.apartmentId })
          .then(apartment => {
            this.$emit('input', apartment._interested)
            apartment._interested.slice();
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
            this.$emit('input', !this.value)
          });
      }
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isVerified']),
    fav() {
      const me = this.$store.getters.getUser;
      const id =  me ? me._id : 'nop'
      console.log(me._id)
      console.log(this.value)
      return this.value.includes(id);
    }
  }
};
</script>

<style>
</style>

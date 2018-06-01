<template>
  <div class="modal-backdrop">
    <v-card max-width="750px">
      <v-card-title primary-title> Search for a review </v-card-title primary-title>
      <v-layout wrap row>
        <v-flex>
          <v-text-field v-model="address" ref="address" @placechanged="setAddress" label="Street and City" prepend-icon="searcg"></v-text-field>
        </v-flex>
      </v-layout>
      <v-btn color="primary" @click.native="close();">Cancel</v-btn>                
      <v-btn color="primary" @click.native="search();">Search</v-btn>                
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'AppReviewSearchDialog',
    data() {
      return {
        address: '',
        searchData: '',
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchData);
        this.$emit('close');
      },
      close() {
        this.$emit('close');
      },
      setAddress(data) {
          this.address = data.full_name;
          this.searchData = data;
      },
    },
	 mounted() {
      this.$setAutocomplete(this.$refs.address, ['address']);

    }
  };
</script>

<style scoped>

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:99;
}


</style>
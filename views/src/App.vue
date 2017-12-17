<template>
  <div id="app">
    <nav class="navbar navbar-light bg-faded">
      <form class="form-inline">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" />
          <input class="btn btn-outline-success my-2 my-sm-0" type="submit" text="Search" />
      </form>
    </nav>

    <div>
       <ul>
           <li
               is="apartmentListItem"
               v-for="(apartment, index) in apartments"
               :item-index="index"
               :item-address="apartment.address"
               :item-price="apartment.price"
           ></li>
       </ul>
   </div>
  </div>
</template>

<script>
  import apartmentListItem from './components/apartmentListItem.vue'

  export default {
    name: 'app',
    components: {
      apartmentListItem
    },
    data() {
      return {
        apartments: []
      }
    },
    created: function() {
      var context = this;

      $.getJSON('put json address here ;-)', function(apartments) {
        context.apartments = apartments;
      });
    },
    methods: {

    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 200px;
    border: solid 0 #000000;
    border-width: 0 1px;
    padding-top: 60px;
  }
  form {
  }
</style>

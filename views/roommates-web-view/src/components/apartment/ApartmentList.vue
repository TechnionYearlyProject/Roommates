<template>


<b-container>
  <ul>
    <li is="ApartmentListItem" v-for="apartment in apartments"></li>
  </ul>
</b-container>


</template>

<script>
import ApartmentListItem from './ApartmentListItem'
import bRow from 'bootstrap-vue/es/components/layout/row';
import bCol from 'bootstrap-vue/es/components/layout/col';
import bContainer from 'bootstrap-vue/es/components/layout/container';

export default {
  data: function() {
    return {
      apartments: [
        {
          address: "Gilboa 35 a",
          price: 11111,
          images: [
            "src/assets/vendors/imgs/apartments/1.jpg",
            "src/assets/vendors/imgs/apartments/2.jpg"
          ]
        },
        {
          address: "Shderot Hahistadrut 5",
          price: 2,
          images: ["src/assets/vendors/imgs/apartments/1.jpg"]
        },
        {
          address: "Hamelachim 3",
          price: 3,
          images: []
        }
      ]
    };
  },
  components: {
    ApartmentListItem,
    bRow, bCol, bContainer
  }
};
</script>

<style>
.r-apartment-li {
  list-style: none;
  margin: 10px;
  margin-left: 5%;
}

.r-apartment-li:last-child {
  margin-bottom: 130px;
}

.r-apartment-box {
  border: 1px solid #eee;
  box-shadow: 0 2px 2px #bbb;
  padding: 0;
  background-color: rgba(238, 238, 238, 0.2);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 1px solid #eee;
}


@media only screen and (max-width: 768px) {
    .s-apartments-container {
      width: 100%;
  }

  .r-apartment-price {
          position: relative;
          margin: 0;
  }

  .r-apartment-image {
    padding: 0;
  }
}
</style>

<template>
<div class="container">
  <ul>
    <li class="r-apartment-li" v-for="apartment in apartments">
      <div class="row mb-5 r-apartment-box r-apartment-details">
        <div class="col-sm-8">
            <h5>
              {{ apartment.address }}
            </h5>
            <app-apartment-price :apartment="apartment"></app-apartment-price>
          </div>
        <div class="col-sm-4 pr-0 pl-10 r-apartment-image">
          <app-image-carusel :apartment="apartment"></app-image-carusel>
        </div>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
import ImageCarusel from './ImageCarusel.vue'
import ApartmentPrice from './ApartmentPrice.vue'

export default {
  data: function() {
    return {
      apartments: [
        {
          address: "Gilboa 35 a",
          price: 11111,
          images: [
            "src/assets/imgs/apartments/1.jpg",
            "src/assets/imgs/apartments/2.jpg"
          ]
        },
        {
          address: "Shderot Hahistadrut 5",
          price: 2,
          images: ["src/assets/imgs/apartments/1.jpg"]
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
    appImageCarusel: ImageCarusel,
    appApartmentPrice: ApartmentPrice
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
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.r-apartment-details {
  position: relative;
}

.r-apartment-details .r-apartment-price {
  position: absolute;
  bottom:0;
  left:0;
  margin-left: 3px;
  margin-bottom: 3px;
}

</style>

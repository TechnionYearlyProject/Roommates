<template>
<div class="container s-apartments-container">
  <ul>
    <li class="r-apartment-li" v-for="apartment in apartments">
      <transition appear enter-active-class="animated fadeInDown">
        <div class="row r-apartment-box">
        <div class="col-md-8 pl-0 pr-0">
          <div class="row" style="margin:20px;">
            <h5>
              {{ apartment.address }}
            </h5>
                      <router-link to="/apartment/:id"><br>view ad</router-link>

          </div>
          <div class="row r-apartment-price">
                <app-apartment-price :apartment="apartment"></app-apartment-price>
          </div>         
          </div>
        <div class="col-md-4 pr-0 r-apartment-image">
          <app-image-carusel :apartment="apartment"></app-image-carusel>
        </div>
      </div>
      </transition>
    </li>
  </ul>
</div>
</template>

<script>
import ImageCarusel from '../gallery/image-carusel/ImageCarusel.vue'
import ApartmentPrice from './PriceTicket.vue'

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
  position: relative;
  border: 1px solid #eee;
}

.r-apartment-price {
  position: absolute;
  bottom:0;
  left:0;
  margin-left: 3px;
  margin-bottom: 3px;
}

.s-apartments-container {
  width: 50%;
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

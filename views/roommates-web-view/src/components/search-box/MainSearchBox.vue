<template>
<div>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-9 r-main-search-box">
        <input class="form-control form-control-lg"
          type="search"
          placeholder="Find your next roommates now!"
          >
      </div>

      <div class="col-lg-3 pr-0" style="text-align:center;">
          <a href="#" class="btn s-btn-sun s-btn-search">
            <i class="ion-android-search"></i>
          </a>

          <a
            class="btn s-btn-ghost s-btn-filter"
            data-toggle="collapse"
            href="#collapse-filter"
            aria-expanded="false"
            aria-controls="collapse-filter">
              <i class="ion-android-funnel"></i>
          </a>
      </div>
    </div>

    <div class="row">
      <div class="offset-md-0 col-md-8 col-sm-10">
        <div class="collapse navbar-collapse r-main-search-filter-extend" id="collapse-filter">
          <div class="card card-body">

            <div class="filter-row">

              <div class="text" style="display: inline">
                Maximum Price: <div style="display: inline" class="price" v-show="sliderValue!==0">{{sliderValue}} </div>
              </div>

              <br />
              <b>₪ 0</b>
              <range-slider
                class="slider"
                min="0"
                max="5000"
                step="100"
                v-model="sliderValue">
              </range-slider>
              <b>₪ 5000+</b>

            </div>
            <div class="row">

              <div class="form-check form-check-inline col">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="Kosher"> Kosher Kitchen
                </label>
              </div>
              <div class="form-check form-check-inline col">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="Elevator"> Elevator
                </label>
              </div>
              <div class="form-check form-check-inline col">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="Air Conditioning"> Air Conditioning
                </label>
              </div>
            </div>
            <div class="row">

              <div class="form-check form-check-inline col">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox4" value="Laundry Room"> Laundry Room
                </label>
              </div>
              <div class="form-check form-check-inline col">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox5" value="Furnished"> Furnished
                </label>
              </div>
              <div class="form-check form-check-inline col">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox6" value="Balcony"> Balcony
                </label>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>

  </div>

</div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
export default {
  data () {
    return {
      sliderValue: 0
    }
  },
  components: {
    RangeSlider
  }
}
</script>


<style>

  .r-main-search-box {
    margin-bottom: 10px;
  }

  .s-btn-search,
  .s-btn-filter {
    padding: 12px 18px;
    margin-top: -1px
  }

  .s-btn-search {
      margin-right: 5px;
  }

  .r-main-search-filter-extend {
    margin-top: 10px;
    color: #eee;
  }

.r-main-search-filter-extend .card-body {
    background-color: #333;
    border-radius: 0;
}
  .filter-row {
    display: block;
    text-align: center;
  }
  .row{
    text-align: center;
  }
  .slider {
    width: 200px;
  }
  .range-slider-fill {
    background-color: #f1c40f;
  }
  .text.price{
    display: inline-block;
  }
  .form-check{
    display: inline-block;
    margin-top: 0;
    margin-bottom: 0;
    vertical-align: middle;
    position: relative;
    box-sizing: border-box;
  }




</style>

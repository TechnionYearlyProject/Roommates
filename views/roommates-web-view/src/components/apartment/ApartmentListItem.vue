<template>
  <b-container >
    <div class="apartment-box" >
      <b-row>
        <b-col cols="4">
          <b-carousel :apartment="apartment"></b-carousel>
        </b-col>
        <b-col cols="8">
          <b-container>
            <b-row>
              <b-col>
                <div style="border-bottom: #181818 dotted 1px">
                  <router-link to="/apartment/7" style="color:#000000">Apartment</router-link>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col col md="2">
                Area:120m
              </b-col>
              <b-col ></b-col>
              <b-col col md="2"  style="float: right; color:#FDC600">
                &#8362;3000
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div style="margin-bottom:10px; margin-top:10px">
                  Suspendisse ultricies Suspendisse ultricies Nulla quis dapibus nisl. Suspendisse ultricies commodo arcu nec pretium ...
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div style="background-color: #d6d6d6">
                  icons
                </div>
              </b-col>
            </b-row>

          </b-container>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
  import bCarousel from '../gallery/image-carousel/imageCarousel.vue'
  import bRow from 'bootstrap-vue/es/components/layout/row';
  import bCol from 'bootstrap-vue/es/components/layout/col';
  import bContainer from 'bootstrap-vue/es/components/layout/container';

  export default {
    data() {
      return {}
    },
    components: {
      bCarousel,
      bRow, bCol, bContainer
    }
  };
</script>

<style scoped>
  .apartment-box{
    border: 1px solid #D3D3D3;
    box-sizing: border-box;
    margin-bottom: 15px;
  }
</style>

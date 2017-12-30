<template>
  <div id="app">
    <app-header></app-header>
    <router-view/>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "./components/blocks/Header.vue";
import Footer from "./components/blocks/Footer.vue";

export default {
  name: "app",
  components: {
    appHeader: Header,
    appFooter: Footer
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  background-color: #f8f8f6;
}
</style>

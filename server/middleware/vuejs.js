const path = require('path');
const express = require('express');

const useVue = (app) =>
  app.use(express.static(path.resolve(__dirname, '../../views/dist'))); //register Vue.js


module.exports = {
  useVue
};
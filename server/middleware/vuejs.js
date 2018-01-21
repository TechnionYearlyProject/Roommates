const path = require('path');
const express = require('express');

/**
 * a middleware function.
 * set the app to use the vue.js build.
 *
 * @param {Express Object} app
 */
const useVue = (app) =>
  app.use(express.static(path.resolve(__dirname, '../../views/dist'))); //register Vue.js


module.exports = {
  useVue
};
const path = require('path');
const express = require('express');

/**
 * a middleware function.
 * set the app to use the vue.js build.
 *
 * @param {Express Object} app
 */
const vuePath = '../../views/dist';

const useVue = (app) => {
  app.use(express.static(path.resolve(__dirname, vuePath))); // register Vue.js

  app.use((req, res, next) => { // router special paths to application ui
    if (/^(\/App\/.*)$/.test(req.url)) {
      res.sendFile(path.resolve(__dirname, `${vuePath}/index.html`));
    } else {
      next();
    }
  });
};


module.exports = {
  useVue
};
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    SERVER_URI: '"http://localhost:3000"',
    BUCKET_URI: '"http://localhost:3000"'
})

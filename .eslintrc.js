module.exports = {
    "extends": "airbnb-base",

    rules: {
        "linebreak-style": 0,
        "no-console": 0,
        "comma-dangle": 0,
        "eol-last": 0,
        "arrow-parens": 0,
        "function-paren-newline": 0,
        "spaced-comment": 0,
        "func-names": 0,
        "no-underscore-dangle": 0,
        "no-plusplus": 0,
        "max-len": 0,
        "dot-notation": 0,
        "no-tabs": 0,
        "no-multi-spaces": 0,
        "no-use-before-define": ["error", { "variables": false }]
    },
    env: {
        "mocha": true
    }
};
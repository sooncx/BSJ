module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "eslint:recommended"],
  rules: {
    "global-require": 0,
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "import/no-dynamic-require": "off",
    "no-param-reassign": "off",
    quotes: "off",
    "linebreak-style": "off",
    "arrow-parens": "off",
    "comma-dangle": "off",
    "consistent-return": "off",
    "array-callback-return": "off",
    "no-return-assign": "off",
    radix: "off",
    "prefer-promise-reject-errors": "off",
    "space-before-function-paren": "off",
    "func-names": "off",
    "wrap-iife": "off",
    "prefer-rest-params": "off",
    "implicit-arrow-linebreak": "off",
    "no-plusplus": "off",
    "no-use-before-define": "off",
    "eqeqeq": "off",
    "no-useless-return": "off",
    "max-len": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  globals: {
    AMap: true
  }
};

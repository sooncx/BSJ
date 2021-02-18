module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "eslint:recommended"],
  rules: {
    "global-require": 0,
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": "off",
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
    "no-underscore-dangle": "off",
    "no-unused-vars": "off",
    "eqeqeq": "off",
    "max-len": "off",
    "object-shorthand": "off",
    "no-param-reassign": "off",
    "no-bitwise": "off",
    "operator-linebreak": "off",
    "no-console": "off",
    "prefer-template": "off",
    "no-useless-escape": "off",
    "no-else-return": "off",
    "object-curly-newline": "off",
    "no-unused-expressions": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  globals: {
    AMap: true
  }
};

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // Disable all the strict rules for now
    "no-unused-vars": "off",
    "object-curly-spacing": "off",
    "no-multi-spaces": "off",
    "no-trailing-spaces": "off",
  },
};
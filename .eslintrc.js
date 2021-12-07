module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "standard"
  ],
  globals: {
    jQuery: "readonly",
    TROUBLESHOOTING_MODE: "writable",
    IS_PRODUCTION: "writable",
    IS_QUES_PAGE: "writable",
    Qualtrics: "readonly",
    quesNumGlobal: "writable",
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {
    "quotes": ["warn", "double"],
    "semi": ["error", "always"],
    "quote-props": ["warn", "consistent"],
    "comma-dangle": ["warn", "only-multiline"],
    "no-multi-spaces": ["warn"],
    "no-multiple-empty-lines": ["warn"],
    "no-trailing-spaces": ["warn"],
    "dot-notation": ["warn"],
  }
};

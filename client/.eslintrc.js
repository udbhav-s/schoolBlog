module.exports = {
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },

  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "eslint:recommended",
    "@vue/prettier"
  ]
};

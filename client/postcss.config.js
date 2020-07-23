module.exports = {
  plugins: {
    tailwindcss: {},
    "vue-cli-plugin-tailwind/purgecss": {
      whitelist: ["pre"],
      whitelistPatterns: [/^ql/, /filepond/],
      whitelistPatternsChildren: [/^ql/, /filepond/, /prose/]
    },
    autoprefixer: {}
  }
};

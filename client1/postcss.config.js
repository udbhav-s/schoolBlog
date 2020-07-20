module.exports = {
  plugins: {
    tailwindcss: {},
    "vue-cli-plugin-tailwind/purgecss": {
      whitelistPatterns: [/^ql/, /^filepond/]
    },
    autoprefixer: {}
  }
};

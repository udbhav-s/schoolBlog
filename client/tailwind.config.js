module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        "foreground-primary": "var(--foreground-primary)",
        "foreground-dark": "var(--foreground-dark)",
        "foreground-light": "var(--foreground-light)",
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)"
      }
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")]
};

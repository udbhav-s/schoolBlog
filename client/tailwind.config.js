module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        "clr-text": "var(--clr-text)",
        "clr-text-dark": "var(--clr-text-dark)",
        "clr-text-light": "var(--clr-text-light)",
        "clr-text-lighter": "var(--clr-text-lighter)",

        "clr-bg": "var(--clr-bg)",
        "clr-bg-secondary": "var(--clr-bg-secondary)",

        "clr-primary": "var(--clr-primary)",
        "clr-primary-lightest": "var(--clr-primary-lightest)",

        "clr-input": "var(--clr-input)",
        "clr-input-active": "var(--clr-input-active)"
      }
    },
    typography: {
      default: {
        css: {
          color: "clr-text",
          strong: {
            color: "clr-text"
          },
          a: {
            color: "clr-text-light"
          },
          blockquote: {
            color: "clr-text-light"
          },
          h2: {
            color: "clr-text-dark"
          },
          h3: {
            color: "clr-text-dark"
          }
        }
      }
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")]
};

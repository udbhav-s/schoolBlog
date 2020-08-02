module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        "clr-text": "var(--clr-text)",
        "clr-text-dark": "var(--clr-text-dark)",
        "clr-text-light": "var(--clr-text-light)",

        "clr-bg": "var(--clr-bg)",
        "clr-bg-secondary": "var(--clr-bg-secondary)",
        "clr-bg-tertiary": "var(--clr-bg-tertiary)",

        "clr-primary": "var(--clr-primary)",
        "clr-primary-lightest": "var(--clr-primary-lightest)",

        "clr-input": "var(--clr-input)",
        "clr-input-hover": "var(--clr-input-hover)",
        "clr-input-active": "var(--clr-input-active)",
        "clr-input-text": "var(--clr-input-text)",

        "clr-input-success": "var(--clr-input-success)",
        "clr-input-success-active": "var(--clr-input-success-active)",

        "clr-input-danger": "var(--clr-input-danger)",
        "clr-input-danger-active": "var(--clr-input-danger-active)",

        "clr-quill-bg": "var(--clr-quill-bg)"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times", "serif"]
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
            color: "clr-text"
          },
          blockquote: {
            color: "clr-text"
          },
          h1: {
            color: "clr-text-dark"
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

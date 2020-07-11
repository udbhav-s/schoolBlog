export default {
  modules: {
    toolbar: [
      [{ header: [2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"]
    ],
    imageDropAndPaste: {
      handler: () => alert("The editor has not loaded completely")
    }
  },
  theme: "snow",
  formats: [
    "bold",
    "underline",
    "header",
    "italic",
    "blockquote",
    "code-block",
    "list",
    "link",
    "image"
  ]
};

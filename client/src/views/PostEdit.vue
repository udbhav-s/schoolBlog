<template>
  <div clas="post-edit-container">
    <hero-section>
      <h1 class="title" v-if="editMode">Edit Post</h1>
      <h1 class="title" v-else>Create Post</h1>
    </hero-section>

    <div class="section fixed-column">
      <div class="field">
        <div class="label">
          Title
        </div>
        <div class="control">
          <input
            class="input"
            type="text"
            name="title"
            v-model="form.title"
            placeholder="Title"
          />
        </div>
      </div>

      <div class="field" v-if="categories">
        <div class="control">
          <span class="select">
            <select v-model="form.categoryId">
              <option :value="null" selected>Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </span>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control file">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              @change="setThumbnail"
              name="thumbnail"
              ref="thumbnail"
              accept=".png, .jpg, .jpeg, .gif"
            />
            <span class="file-cta">
              Upload Thumbnail
            </span>
          </label>
        </div>
        <div class="control" v-if="form.thumbnail">
          <button @click="form.thumbnail = ''" class="button is-danger">Remove</button>
        </div>
      </div>
      <div class="field">
        <div class="image">
          <img v-if="form.thumbnail" :src="form.thumbnail" />
        </div>
      </div>

      <div class="field">
        <label class="label">
          Content
        </label>
        <div class="editor">
          <div ref="editor"></div>
        </div>
      </div>

      <div class="field">
        <div class="control has-text-centered">
          <button class="button is-primary" @click="submitPost">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { postService, categoryService } from "@/services/dataService.js";
import Vue from "vue";

export default {
  name: "PostEdit",
  props: ["editMode", "editId"],

  data() {
    return {
      editor: null,
      form: {
        title: "",
        thumbnail: "",
        body: "",
        categoryId: null,
      },
      categories: null,
    };
  },

  created() {
    this.loadCategories();
  },

  mounted() {
    this.createEditor();
    if (this.editMode) this.setPost(this.editId);
  },

  methods: {
    async loadCategories() {
      let result = await categoryService.getAll();
      if (!result.success) this.$toasted.error("Could not load category list");
      this.categories = result.data;
    },

    async submitPost() {
      // set contents of body from editor
      this.form.body = this.editor.root.innerHTML;
      // post the form
      let result;
      if (this.editMode) {
        result = await postService.update(this.editId, this.form);
      } else {
        result = await postService.create(this.form);
      }
      if (!result.success) {
        this.$toasted.error(result.message);
        throw result;
      } else {
        this.$toasted.success("Post edited!");
        this.$router.push(`/post/${result.data.id}`);
      }
    },

    async setPost(id) {
      // get post from server
      const result = await postService.getEditMode(id);
      if (!result.success) {
        this.$toasted.error("Error loading post data");
        throw result;
      }
      // set form data to post
      Vue.set(this.form, "title", result.data.title);
      Vue.set(this.form, "categoryId", result.data.categoryId);
      this.editor.root.innerHTML = result.data.body;
      // set thumbnail
      if (result.data.thumbnail) {
        Vue.set(this.form, "thumbnail", result.data.thumbnail);
      }
    },

    createEditor() {
      this.editor = new Quill(this.$refs.editor, {
        modules: {
          toolbar: [
            [{ header: [2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"]
          ]
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
      });
    },

    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    async setThumbnail() {
      // set thumbnail data from file
      if (this.$refs.thumbnail.files.length > 0) {
        const data = await this.fileToBase64(this.$refs.thumbnail.files[0]);
        Vue.set(this.form, "thumbnail", data);
      }
    }
  },
  components: {
    HeroSection
  }
};
</script>

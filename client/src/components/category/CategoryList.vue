<template>
  <div v-if="categories">
    <category
      v-for="category in categories"
      :key="category.id"
      :category="category"
      @categoryDeleted="categoryDeleted"
      @categoryEdited="categoryEdited"
    >
    </category>

    <div v-if="!showAddCategory" @click="showAddCategory = true" class="field">
      <div class="control has-text-centered">
        <button class="button is-small">New Category</button>
      </div>
    </div>
    <div v-else class="field is-grouped is-grouped-centered">
      <div class="control">
        <input v-model="form.name" type="text" class="input is-small" />
      </div>
      <div class="control">
        <button @click="addCategory" class="button is-primary is-small">
          Add
        </button>
      </div>
      <div class="control">
        <button
          @click="showAddCategory = false"
          class="button is-danger is-small"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { categoryService } from "@/services/dataService.js";
import Category from "@/components/category/Category.vue";
import Vue from "vue";

export default {
  name: "CategoryList",
  data() {
    return {
      categories: null,
      showAddCategory: false,
      form: {
        name: ""
      }
    };
  },

  created() {
    this.loadCategories();
  },

  methods: {
    async loadCategories() {
      const result = await categoryService.getAll();
      if (!result.success) {
        this.$toasted.error("Error getting categories");
        throw result.message;
      }
      this.categories = result.data;
    },

    async addCategory() {
      const result = await categoryService.create(this.form);
      if (!result.success) {
        this.$toasted.error("Error while adding category");
        throw result.message;
      }
      this.$toasted.success("Category created");
      this.showAddCategory = false;
      this.categories.push(result.data);
    },

    async categoryDeleted(id) {
      const result = await categoryService.delete(id);
      if (!result.success) {
        this.$toasted.error("Error while deleting category");
        throw result.message;
      }
      this.$toasted.success("Category deleted");
      this.categories = this.categories.filter(c => c.id !== id);
    },

    async categoryEdited(category) {
      const result = await categoryService.update(category.id, {
        name: category.name
      });
      if (!result.success) {
        this.$toasted.error("Error while updating category");
        throw result.message;
      }
      const index = this.categories.findIndex(c => c.id === category.id);
      Vue.set(this.categories, index, result.data);
    }
  },

  components: {
    Category
  }
};
</script>

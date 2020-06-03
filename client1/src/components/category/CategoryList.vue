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

<script lang="ts">
import { categoryService } from "@/services";
import CategoryComponent from "@/components/category/Category.vue";
import { defineComponent, ref, reactive } from "@vue/composition-api";
import { Category, CategoryCreate } from "@/types";

export default defineComponent({
  name: "CategoryList",
  components: {
    Category: CategoryComponent
  },

  setup(props, { root }) {
    const categories = ref<Category[]>([]);
    const showAddCategory = ref<boolean>(false);
    const form = reactive<CategoryCreate>({
      name: ""
    });

    const loadCategories = async () => {
      const result = await categoryService.getAll();
      if ("error" in result) {
        root.$toasted.error("Error getting categories");
        throw result.message;
      }
      categories.value = result.data;
    };

    const addCategory = async () => {
      const result = await categoryService.create(form);
      if ("error" in result) {
        root.$toasted.error("Error while adding category");
        throw result.message;
      }
      root.$toasted.success("Category created");
      showAddCategory.value = false;
      categories.value.push(result.data);
    };

    const categoryDeleted = async (id: number) => {
      const result = await categoryService.delete(id);
      if ("error" in result) {
        root.$toasted.error("Error while deleting category");
        throw result.message;
      } else {
        root.$toasted.success("Category deleted");
        categories.value = categories.value.filter(c => c.id !== id);
      }
    };

    const categoryEdited = async (category: Category) => {
      const result = await categoryService.update(category.id, {
        name: category.name
      });
      if ("error" in result) {
        root.$toasted.error("Error while updating category");
        throw result.message;
      }
      const index = categories.value.findIndex(c => c.id === category.id);
      categories.value[index] = category;
    };

    return {
      categories,
      showAddCategory,
      form,
      loadCategories,
      addCategory,
      categoryEdited,
      categoryDeleted
    };
  }
});
</script>

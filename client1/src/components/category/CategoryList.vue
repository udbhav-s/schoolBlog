<template>
  <div v-if="categories">
    <div class="table-list">
      <category
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @categoryDeleted="categoryDeleted"
        @categoryEdited="categoryEdited"
        class="p-3"
      >
      </category>
    </div>

    <div v-if="!showAddCategory" @click="showAddCategory = true" class="my-2">
      <div class="text-center">
        <button class="button">New Category</button>
      </div>
    </div>
    <div v-else class="flex items-center justify-center space-x-2">
      <div>
        <input v-model="form.name" type="text" class="input-border" />
      </div>
      <div>
        <button @click="addCategory" class="button">
          Add
        </button>
      </div>
      <div>
        <button @click="showAddCategory = false" class="button button-danger">
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
    loadCategories();

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

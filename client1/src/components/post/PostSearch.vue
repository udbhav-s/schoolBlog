<template>
  <div>
    <input
      v-model="options.search"
      type="text"
      class="w-full input-border p-2 flex-grow my-2"
      placeholder="Search (leave empty to search all)"
    />

    <div class="flex flex-wrap items-stretch text-xs md:text-base space-x-1">
      <select
        v-if="isModOrAbove"
        v-model="options.verified"
        class="input-border"
      >
        <option value="" selected>All</option>
        <option value="verified">Verified</option>
        <option value="unverified">Unverified</option>
      </select>

      <select
        v-if="categories"
        v-model="options.categoryId"
        class="input-border"
      >
        <option value="" selected>Category</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>

      <select v-model="options.orderBy" class="input-border">
        <option value="" selected>Sort by</option>
        <option value="createdAt">Date Created</option>
        <!-- <option value="updatedAt">Date Updated</option> -->
      </select>

      <select v-model="options.order" class="input-border">
        <option value="" selected>Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button @click="submit" class="button">
        Search
      </button>

      <button @click="close" class="button button-danger">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { categoryService } from "@/services";
import { defineComponent, computed, ref } from "@vue/composition-api";
import { PostQueryOptions, Category } from "../../types";
import { userStore } from "@/store";

export default defineComponent({
  name: "PostSearch",

  setup(props, { emit, root }) {
    const categories = ref<Category[]>(null);
    const isModOrAbove = computed<boolean>(userStore.getters.isModOrAbove);
    const options = ref<Partial<PostQueryOptions>>({
      verified: "",
      orderBy: "",
      order: "",
      search: "",
      categoryId: ""
    });

    const loadCategories = async () => {
      const result = await categoryService.getAll();
      if ("error" in result)
        root.$toasted.error("Could not load category list");
      else categories.value = result.data;
    };
    loadCategories();

    const submit = () => {
      const opts = { ...options.value };
      // remove empty properties
      for (const key in opts) {
        if (!opts[key as keyof PostQueryOptions])
          delete opts[key as keyof PostQueryOptions];
      }
      // convert to boolean
      if (opts.verified) opts.verified = opts.verified === "verified";
      // emit event
      emit("search", opts);
    };

    const close = () => emit("close");

    return {
      isModOrAbove,
      options,
      categories,
      loadCategories,
      submit,
      close
    };
  }
});
</script>

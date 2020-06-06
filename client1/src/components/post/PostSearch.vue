<template>
  <div class="post-search">
    <div class="field is-grouped is-grouped-centered">
      <div class="control" v-if="isModOrAbove">
        <span class="select is-small">
          <select v-model="options.verified">
            <option value="" selected>All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </span>
      </div>

      <div class="control is-expanded">
        <input
          v-model="options.search"
          type="text"
          class="input is-small"
          placeholder="Search (omit to load all)"
        />
      </div>
    </div>

    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
      <div class="control" v-if="categories">
        <span class="select is-small">
          <select v-model="options.categoryId">
            <option value="" selected>Category</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </span>
      </div>

      <div class="control">
        <span class="select is-small">
          <select v-model="options.orderBy">
            <option value="" selected>Sort by</option>
            <option value="createdAt">Date Created</option>
            <!-- <option value="updatedAt">Date Updated</option> -->
          </select>
        </span>
      </div>

      <div class="control">
        <span class="select is-small">
          <select v-model="options.order">
            <option value="" selected>Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </span>
      </div>

      <div class="control">
        <button @click="submit" class="button is-primary is-small">
          Search
        </button>
      </div>

      <div class="control">
        <button @click="close" class="button is-danger is-small">Cancel</button>
      </div>
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

<template>
  <div>
    <input
      v-model="search"
      type="text"
      class="w-full input-border p-2 flex-grow my-2"
      placeholder="Search (leave empty to search all)"
    />
    <div
      class="flex flex-wrap items-stretch justify-between text-xs md:text-base"
    >
      <list-query-options v-model="sortOptions" />

      <div class="space-x-1">
        <button @click="submit" class="button">
          Search
        </button>

        <button @click="close" class="button button-danger">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import { QueryOptions, PostQueryOptions, Category } from "../../types";
import { userStore, categoryStore } from "@/store";
import ListQueryOptions from "@/components/ListQueryOptions.vue";

export default defineComponent({
  name: "PostSearch",
  components: {
    ListQueryOptions
  },

  setup(props, { emit }) {
    const categories = computed<Category[]>(categoryStore.getters.categories);
    const isModOrAbove = computed<boolean>(userStore.getters.isModOrAbove);
    const search = ref<string>("");
    const sortOptions = ref<Partial<QueryOptions>>({
      orderBy: "createdAt",
      order: "desc"
    });

    // reload categories
    categoryStore.mutations.loadCategories();

    const submit = () => {
      const opts = {
        ...sortOptions.value,
        search: search.value
      } as Partial<PostQueryOptions>;
      // remove empty properties
      for (const key in opts) {
        if (!opts[key as keyof PostQueryOptions])
          delete opts[key as keyof PostQueryOptions];
      }
      // emit event
      emit("search", opts);
    };

    const close = () => emit("close");

    return {
      isModOrAbove,
      sortOptions,
      search,
      categories,
      submit,
      close
    };
  }
});
</script>

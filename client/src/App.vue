<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>

    <app-header />

    <router-view id="main" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import AppHeader from "@/components/AppHeader.vue";
import "@/assets/styles/index.css";
import { categoryStore, themeStore } from "./store";

export default defineComponent({
  name: "App",
  components: {
    AppHeader
  },

  setup() {
    // load categories into store
    categoryStore.mutations.loadCategories();
    // set title
    document.title = "The HPS Blog";
    // load theme
    themeStore.mutations.loadTheme();
    // add theme classes
    document.documentElement.classList.add("text-clr-text", "bg-clr-bg");
  }
});
</script>

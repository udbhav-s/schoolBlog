<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>

    <app-header v-if="isAuthenticated" />

    <div class="min-h-screen">
      <router-view id="main" />
    </div>

    <app-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import "@/assets/styles/index.css";
import { categoryStore, themeStore, userStore } from "./store";

export default defineComponent({
  name: "App",
  components: {
    AppHeader,
    AppFooter
  },

  setup() {
    const isAuthenticated = computed(userStore.getters.isAuthenticated);
    // load categories into store
    categoryStore.mutations.loadCategories();
    // set title
    document.title = "The HPS Blog";
    // load theme
    themeStore.mutations.loadTheme();
    // add theme classes
    document.documentElement.classList.add("text-clr-text", "bg-clr-bg");

    return {
      isAuthenticated
    };
  }
});
</script>

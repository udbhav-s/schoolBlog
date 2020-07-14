<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>

    <app-header />

    <transition name="fade" mode="out-in">
      <router-view id="main" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import AppHeader from "@/components/AppHeader.vue";
import "@/assets/styles/index.css";
import { categoryStore } from "./store";

export default defineComponent({
  name: "App",
  components: {
    AppHeader
  },

  setup() {
    // load categories into store
    categoryStore.mutations.loadCategories();
  }
});
</script>

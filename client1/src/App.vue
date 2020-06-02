<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <app-header />
    <transition name="fade" mode="out-in" v-if="cssLoaded">
      <router-view id="main" />
    </transition>

    <h1 v-else>Loading</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";
import AppHeader from "@/components/AppHeader.vue";
import "@/assets/styles/main.scss";

export default defineComponent({
  name: "App",
  components: {
    AppHeader
  },

  setup() {
    onMounted(() => {
      // class to add navbar spacing
      document.body.classList.add("has-navbar-fixed-top");
    });
  }
});
</script>

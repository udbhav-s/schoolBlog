<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <app-header />
    <transition name="fade" mode="out-in">
      <router-view id="main" />
    </transition>
  </div>
</template>

<script>
import "@/assets/styles/main.scss";
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "App",
  components: {
    AppHeader
  },
  mounted() {
    // class to add navbar spacing
    document.body.classList.add("has-navbar-fixed-top");
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=PT+Sans&display=swap");
</style>

<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <app-header />
    <transition name="fade" mode="out-in" v-if="cssLoaded">
      <router-view id="main"/>
    </transition>

    <h1 v-else>Loading</h1>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import '@/assets/styles/main.scss';

export default {
  name: "App",
  data() {
    return {
      cssLoaded: false
    }
  },

  components: {
    AppHeader
  },

  mounted() {
    // class to add navbar spacing
    document.body.classList.add("has-navbar-fixed-top");
    // theme
    let promise;
    if (localStorage.getItem('mode') === 'dark') {
      promise = import("@/assets/styles/dark.scss");
    }
    else promise = import("@/assets/styles/main.scss");
    promise.then(() => {
      this.cssLoaded = true;
    });
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=PT+Sans&display=swap");
</style>

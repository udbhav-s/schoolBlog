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

<script>
import AppHeader from "@/components/AppHeader.vue";
import "@/assets/styles/main.scss";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      cssLoaded: false
    };
  },

  computed: {
    ...mapGetters(["theme"])
  },

  components: {
    AppHeader
  },

  created() {
    // select theme
    let promise;
    if (this.theme === "dark") promise = import("@/assets/styles/dark.scss");
    else promise = import("@/assets/styles/main.scss");

    // load stylesheet
    promise.then(() => {
      this.cssLoaded = true;
    });
  },

  mounted() {
    // class to add navbar spacing
    document.body.classList.add("has-navbar-fixed-top");
  }
};
</script>

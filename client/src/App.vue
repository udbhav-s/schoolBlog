<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <app-header />
    <router-view id="main"/>
  </div>
</template>

<script>
import '@/assets/styles/main.scss'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  mounted() {
    // class to add navbar spacing
    document.body.classList.add("has-navbar-fixed-top")
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=PT+Sans&display=swap');
</style>

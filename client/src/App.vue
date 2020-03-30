<template>
  <div id="app">
    <app-header />
    <router-view id="main"/>
  </div>
</template>

<script>
import 'normalize.css';
import './styles/base.css';
import './styles/style.scss';
// import './styles/debug.css'; 

import AppHeader from '@/components/AppHeader.vue';

export default {
	name: 'App',
	components: {
		AppHeader
	}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=PT+Sans&display=swap');
</style>

<template>
  <div>
    <hero-section>
      <h1 class="title">THE HPS BLOG</h1>
    </hero-section>

    <section v-if="isModOrAbove" class="section fixed-column">
      <div class="tabs is-centered">
        <ul>
          <li 
            v-for="tab in tabs"
            :key="tab.name"
            :class="{
              'is-active': 
                ($route.path === tab.route) 
                || ($route.path === '/' && tab.name === 'Posts')
            }"
          >
            <router-link :to="tab.route">
              {{ tab.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </section>

    <section v-else class="section fixed-column">
      <post-list />
    </section>
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue";
import PostList from "@/components/post/PostList.vue";
import { mapGetters } from 'vuex';

export default {
  name: "Home",
  components: {
    PostList,
    HeroSection
  },
  data() {
    return {
      tabs: [
        {
          name: 'Posts',
          route: '/posts'
        },
        {
          name: 'Users',
          route: '/users'
        },
        {
          name: 'Comments',
          route: '/comments'
        },
        {
          name: 'Replies',
          route: '/replies'
        },
        {
          name: 'Categories',
          route: '/categories'
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['isModOrAbove'])
  }
};
</script>

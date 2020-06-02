<template>
  <div>
    <hero-section>
      <h1 class="title">THE HPS BLOG</h1>
    </hero-section>

    <section v-if="isModOrAbove" class="section fixed-column">
      <div class="tabs is-centered is-boxed is-small">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.name"
            :class="{
              'is-active':
                $route.path === tab.route ||
                ($route.path === '/' && tab.name === 'Posts')
            }"
          >
            <router-link :to="tab.route">
              {{ tab.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </section>

    <section v-else class="section fixed-column">
      <post-list />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "@vue/composition-api";
import HeroSection from "@/components/HeroSection.vue";
import PostList from "@/components/post/PostList.vue";
import { userStore } from "@/store";

export default defineComponent({
  name: "Home",
  components: {
    PostList,
    HeroSection
  },

  setup() {
    const isModOrAbove = computed(userStore.getters.isModOrAbove);
    const tabs = reactive([
      {
        name: "Posts",
        route: "/posts"
      },
      {
        name: "Users",
        route: "/users"
      },
      {
        name: "Comments",
        route: "/comments"
      },
      {
        name: "Replies",
        route: "/replies"
      },
      {
        name: "Categories",
        route: "/categories"
      }
    ]);

    return {
      tabs,
      isModOrAbove
    };
  }
});
</script>

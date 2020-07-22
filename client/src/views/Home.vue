<template>
  <div>
    <div class="text-center mb-6">
      <h1 class="title-text text-5xl md:text-6xl m-auto">THE HPS BLOG</h1>
    </div>

    <section v-if="isModOrAbove" class="fixed-column">
      <div class="flex justify-center">
        <div
          class="text-gray-700 text-xs md:text-base mx-auto inline-flex flex-wrap justify-center rounded mb-6"
        >
          <router-link
            :to="tab.route"
            v-for="tab in tabs"
            :key="tab.name"
            :class="{
              'is-active':
                $route.path === tab.route ||
                ($route.path === '/' && tab.name === 'Posts'),
              tab: true
            }"
          >
            {{ tab.name }}
          </router-link>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </section>

    <section v-else class="fixed-column">
      <post-list :searchable="true" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "@vue/composition-api";
import PostList from "@/components/post/PostList.vue";
import { userStore } from "@/store";

export default defineComponent({
  name: "Home",
  components: {
    PostList
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

<style lang="postcss">
@keyframes fade-down {
  0% {
    opacity: 0;
    transform: translate(0, -15%);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.tab {
  @apply border-b-2 px-4 py-2 cursor-pointer;
  transition: 0.2s;
}

.tab:hover,
.tab.is-active {
  @apply bg-blue-100 border-blue-700;
}

.title-text {
  animation: fade-down ease-in 0.3s;
}
</style>

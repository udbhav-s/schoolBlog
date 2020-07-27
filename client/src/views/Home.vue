<template>
  <div>
    <div class="text-center mb-6">
      <h1
        class="text-clr-text-dark animate-fade-down text-5xl md:text-6xl m-auto"
      >
        THE HPS BLOG
      </h1>
    </div>

    <section v-if="isModOrAbove" class="fixed-column">
      <div class="flex justify-center">
        <div
          class="text-xs md:text-base mx-auto inline-flex flex-wrap justify-center rounded mb-6"
        >
          <router-link
            :to="tab.route"
            v-for="tab in tabs"
            :key="tab.name"
            :class="{
              'is-active':
                $route.path === tab.route ||
                ($route.meta.postListTabs && tab.name === 'Posts')
            }"
            class="tab"
          >
            {{ tab.name }}
          </router-link>
        </div>
      </div>
    </section>

    <transition name="fade" mode="out-in">
      <router-view class="fixed-column" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "@vue/composition-api";
import PostListTabs from "@/components/post/PostListTabs.vue";
import { userStore } from "@/store";

export default defineComponent({
  name: "Home",
  components: {
    PostListTabs
  },

  setup() {
    const isModOrAbove = computed(userStore.getters.isModOrAbove);
    const tabs = reactive([
      {
        name: "Posts",
        route: "/"
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
/* router transition */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

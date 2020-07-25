<template>
  <div>
    <section>
      <div class="flex">
        <div
          class="text-clr-text-light text-xs md:text-base mx-auto inline-flex flex-wrap justify-center rounded mb-6"
        >
          <router-link
            :to="tab.route"
            v-for="tab in tabs"
            :key="tab.name"
            :class="{
              'is-active':
                $route.path === tab.route ||
                ($route.path === '/' && tab.name === 'All')
            }"
            class="tab"
          >
            {{ tab.name }}
          </router-link>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import PostList from "@/components/post/PostList.vue";
import { userStore, categoryStore } from "@/store";

export default defineComponent({
  name: "PostListTabs",
  components: {
    PostList
  },

  setup() {
    const categories = computed(categoryStore.getters.categories);
    const isModOrAbove = computed(userStore.getters.isModOrAbove);

    const tabs = computed(() => {
      const arr = [
        {
          name: "All",
          route: "/all"
        }
      ];

      if (isModOrAbove.value === true) {
        arr.push({
          name: "Unverified",
          route: "/unverified"
        });
      }

      arr.push(
        ...categories.value.map(c => ({
          name: c.name,
          route: "/category/" + c.id.toString()
        }))
      );

      return arr;
    });

    return {
      tabs
    };
  }
});
</script>

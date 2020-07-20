<template>
  <header
    class="fixed top-0 left-0 w-full bg-gray-200 flex flex-wrap items-center justify-between px-4 py-2 lg:px-16 lg:py-0 select-none z-40"
  >
    <router-link
      to="/"
      @click.native="isActive = false"
      class="flex items-center"
    >
      Home
    </router-link>

    <div @click="isActive = !isActive" class="cursor-pointer lg:hidden">
      <svg
        class="fill-current text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <title>menu</title>
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
      </svg>
    </div>

    <div
      class="h-0 overflow-hidden w-full lg:flex lg:items-center lg:w-auto lg:h-auto"
      :class="{ 'navbar-expanded': isActive }"
      id="menu"
    >
      <nav>
        <ul
          class="lg:flex items-center justify-between text-base text-gray-800 pt-4 lg:pt-0"
        >
          <router-link
            class="navbar-item"
            to="/about"
            @click.native="isActive = false"
          >
            About
          </router-link>

          <router-link
            class="navbar-item"
            :to="{ name: 'CurrentUser' }"
            @click.native="isActive = false"
          >
            Profile
          </router-link>

          <template v-if="currentUser.level >= 1">
            <router-link
              class="navbar-item"
              to=""
              @click.native.prevent="createPost"
            >
              New Post
            </router-link>
          </template>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import { userStore } from "@/store";
import { postService } from "@/services";

export default defineComponent({
  name: "AppHeader",
  setup(props, { root }) {
    const currentUser = computed(userStore.getters.user);
    const isActive = ref<boolean>(false);

    const createPost = async () => {
      isActive.value = false;

      const result = await postService.create();
      if ("error" in result) {
        root.$toasted.error("Error creating post");
        throw result.message;
      } else {
        root.$router.push({
          name: "EditPost",
          params: {
            id: result.data.id.toString()
          }
        });
      }
    };

    return {
      isActive,
      currentUser,
      createPost
    };
  }
});
</script>

<style lang="postcss">
.navbar-item {
  @apply p-3 block border-b-2 border-transparent;
}
.navbar-item:hover {
  @apply bg-gray-300 border-blue-600;
}

#menu {
  transition: height 0.4s;
}

#menu.navbar-expanded {
  @apply h-screen;
}
</style>

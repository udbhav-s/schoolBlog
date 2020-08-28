<template>
  <header
    class="w-full bg-clr-bg-secondary flex flex-wrap items-center justify-between px-4 py-2 lg:px-16 lg:py-0 select-none z-40"
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
        class="fill-current text-clr-text-dark"
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
        <ul class="lg:flex items-center justify-between text-base pt-4 lg:pt-0">
          <router-link
            class="navbar-item"
            to="/about"
            @click.native="isActive = false"
          >
            About
          </router-link>

          <template v-if="currentUser.level >= 1">
            <router-link
              class="navbar-item"
              to=""
              @click.native.prevent="createPost"
            >
              New Draft
            </router-link>
          </template>

          <router-link
            class="navbar-item flex items-center"
            :to="{ name: 'CurrentUser' }"
            @click.native="isActive = false"
          >
            <username :user="currentUser" smallPicture />
            <span
              v-if="numOfNotifications > 0"
              class="rounded ml-2 px-1 text-clr-input-text bg-clr-input-success"
            >
              {{ numOfNotifications }}
            </span>
          </router-link>

          <div
            v-if="isActive"
            @click="isActive = !isActive"
            class="navbar-item text-clr-input-danger cursor-pointer"
          >
            Close
          </div>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import Username from "@/components/user/Username.vue";
import { userStore, notificationStore } from "@/store";
import { postService } from "@/services";

export default defineComponent({
  name: "AppHeader",
  components: {
    Username
  },

  setup(props, { root }) {
    const currentUser = computed(userStore.getters.user);
    const isAuthenticated = computed(userStore.getters.isAuthenticated);
    const isActive = ref<boolean>(false);
    const numOfNotifications = computed(
      () => notificationStore.getters.notifications().length
    );

    const createPost = async () => {
      isActive.value = false;

      try {
        const result = await postService.create();
        root.$router.push({
          name: "EditPost",
          params: {
            id: result.id.toString()
          }
        });
      } catch {
        root.$toasted.error("Error creating post");
      }
    };

    return {
      isActive,
      currentUser,
      createPost,
      isAuthenticated,
      numOfNotifications
    };
  }
});
</script>

<style lang="postcss">
@keyframes pop {
  0% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.navbar-item {
  @apply p-3 block;
}
.navbar-item:hover {
  @apply bg-clr-bg-tertiary;
}

#menu {
  transition: height 0.4s;
}

#menu.navbar-expanded {
  @apply h-screen;
  animation: pop 0.3s ease-in-out;
}
</style>

<template>
  <header class="navbar is-fixed-top is-unselectable">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/" @click.native="isActive = false">
        HOME
      </router-link>
      <span
        class="navbar-burger"
        @click="isActive = !isActive"
        :class="{ 'is-active': isActive }"
      >
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
    <div
      class="navbar-menu"
      id="header-right"
      :class="{ 'is-active': isActive }"
    >
      <div class="navbar-end has-text-centered">
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
      </div>
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

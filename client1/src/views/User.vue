<template>
  <div>
    <div class="p-4 shadow-lg text-center fixed-column">
      <img
        :src="user.picture"
        class="w-20 h-20 rounded-full inline-block my-2"
      />
      <h1 class="text-2xl">{{ user.name }}</h1>
      <div>{{ user.email }}</div>

      <button v-if="isCurrentUser" @click="logout" class="button text-lg my-2">
        Log Out
      </button>
    </div>

    <section
      v-if="isAdminOrAbove && !isCurrentUser"
      class="bg-gray-100 my-10 py-6"
    >
      <div class="fixed-column mx-auto space-y-3">
        <label class="text-3xl">Level</label>
        <select
          name="level-select"
          id="level-select"
          class="input-border block"
          v-model="user.level"
        >
          <option value="0">Reader</option>
          <option value="1">Member</option>
          <option value="2">Author</option>
          <option value="3">Moderator</option>
          <option value="4">Admin</option>
        </select>

        <div v-html="levelDescriptions[user.level]"></div>

        <button class="button text-lg" @click="setUserLevel">
          Set Level
        </button>
      </div>
    </section>

    <section class="fixed-column">
      <div v-if="isCurrentUser">
        <div class="text-3xl my-6 text-gray-800">Drafts</div>
        <post-list v-if="user.id" :userId="user.id" :drafts="true" />
        <hr class="my-6" />
      </div>
      <div class="text-3xl my-6 text-gray-800">Posts</div>
      <post-list v-if="user.id" :userId="user.id" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import { userService } from "@/services";
import PostList from "@/components/post/PostList.vue";
import { User } from "@/types";
import levelDescriptionsArray from "@/config/levelDescriptions";
import { userStore } from "@/store";

export default defineComponent({
  name: "User",
  props: {
    userId: {
      type: Number as () => number,
      required: true
    }
  },
  components: {
    PostList
  },

  setup(props, { root }) {
    const user = ref<User>({});
    const levelDescriptions = ref(levelDescriptionsArray);
    const currentUser = computed<User>(userStore.getters.user);
    const isAdminOrAbove = computed<boolean>(userStore.getters.isAdminOrAbove);
    const isCurrentUser = computed<boolean>(
      () => user.value.id === currentUser.value.id
    );

    const loadUser = async () => {
      const result = await userService.getById(props.userId);
      if ("error" in result) throw result.error;
      else user.value = result.data;
    };
    watch(
      () => props.userId,
      (changed, old) => {
        if (changed !== old) {
          loadUser();
        }
      }
    );

    const logout = async () => {
      await userStore.mutations.logout();
      root.$router.push("/login");
    };

    const setUserLevel = async () => {
      try {
        const result = await userService.setLevel(
          user.value.id,
          user.value.level
        );
        if ("error" in result) throw result.message;
        else {
          user.value = result.data;
          root.$toasted.success("User level changed");
        }
      } catch (err) {
        root.$toasted.error("An error occured");
      }
    };

    return {
      user,
      levelDescriptions,
      currentUser,
      isAdminOrAbove,
      isCurrentUser,
      logout,
      setUserLevel
    };
  }
});
</script>

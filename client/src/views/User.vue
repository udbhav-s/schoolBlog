<template>
  <div v-if="user && user.id">
    <div class="p-4 border border-clr-bg-secondary text-center fixed-column">
      <img
        :src="user.picture"
        class="w-20 h-20 rounded-full inline-block my-2"
      />
      <h1 class="text-2xl leading-tight">{{ user.name }}</h1>
      <div>{{ user.email }}</div>
      <div class="text-xl font-semibold">{{ userLevelName }}</div>

      <div v-if="isCurrentUser" class="flex my-2 justify-center space-x-1">
        <button @click="logout" class="button text-lg">
          Log Out
        </button>
        <button @click="toggleDarkMode" class="button text-lg">
          <template v-if="isDarkMode">Light Mode</template>
          <template v-else>Join the Dark Side</template>
        </button>
      </div>
    </div>

    <div class="fixed-column bg-clr-bg-secondary">
      <notifications />
    </div>

    <section
      v-if="isAdminOrAbove && !isCurrentUser && user.level !== 4"
      class="bg-clr-bg-secondary my-10 py-6"
    >
      <div class="fixed-column mx-auto space-y-3">
        <label class="text-3xl">Level</label>
        <select
          name="level-select"
          id="level-select"
          class="input block"
          v-model="user.level"
        >
          <option value="0">Reader</option>
          <option value="1">Member</option>
          <option value="2">Author</option>
          <option value="3">Moderator</option>
          <!-- <option value="4">Admin</option> -->
        </select>

        <div v-html="levelDescriptions[user.level]"></div>

        <button class="button text-lg" @click="setUserLevel">
          Set Level
        </button>
      </div>
    </section>

    <section class="fixed-column">
      <div v-if="isCurrentUser">
        <div class="text-3xl my-6 text-center bg-clr-bg-secondary p-2">
          Drafts
        </div>
        <post-list v-if="user.id" :userId="user.id" :drafts="true" />
        <hr class="my-6" />
      </div>
      <div class="text-3xl my-6 text-center bg-clr-bg-secondary p-2">
        Posts
      </div>
      <post-list v-if="user.id" :userId="user.id" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import { userService } from "@/services";
import PostList from "@/components/post/PostList.vue";
import Notifications from "@/components/notification/Notifications.vue";
import { User } from "@/types";
import levelDescriptionsArray from "@/config/levelDescriptions";
import { userStore, themeStore } from "@/store";

export default defineComponent({
  name: "User",
  props: {
    userId: {
      type: Number as () => number,
      required: true
    }
  },
  components: {
    PostList,
    Notifications
  },

  setup(props, { root }) {
    const user = ref<User>({});
    const levelDescriptions = ref(levelDescriptionsArray);
    const currentUser = computed<User>(userStore.getters.user);
    const isAdminOrAbove = computed<boolean>(userStore.getters.isAdminOrAbove);
    const isCurrentUser = computed<boolean>(
      () => user.value.id === currentUser.value.id
    );
    const userLevelName = computed<string>(() => {
      return user.value?.level
        ? ["Reader", "Member", "Author", "Moderator", "Admin"][user.value.level]
        : "";
    });
    const isDarkMode = computed(themeStore.getters.darkMode);

    const loadUser = async () => {
      try {
        const result = await userService.getById(props.userId);
        user.value = result;
      } catch {
        root.$toasted.error("Error loading user");
      }
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
      root.$router.push({ name: "Login" });
    };

    const setUserLevel = async () => {
      try {
        const result = await userService.setLevel(
          user.value.id,
          user.value.level
        );
        user.value = result;
        root.$toasted.success("User level changed");
      } catch (err) {
        root.$toasted.error("An error occured");
      }
    };

    const toggleDarkMode = () => {
      themeStore.mutations.toggleDarkMode();
    };

    return {
      user,
      levelDescriptions,
      currentUser,
      isAdminOrAbove,
      isCurrentUser,
      logout,
      setUserLevel,
      userLevelName,
      isDarkMode,
      toggleDarkMode
    };
  }
});
</script>

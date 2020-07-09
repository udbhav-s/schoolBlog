<template>
  <div class="user-page">
    <hero-section>
      <h1 class="title">{{ user.name }}</h1>
      <div class="subtitle">
        <div>{{ user.email }}</div>
        <div>{{ user.type }}</div>
      </div>

      <template v-if="isCurrentUser">
        <div class="field">
          <button v-if="isCurrentUser" @click="logout" class="button">
            Log Out
          </button>
        </div>

        <!-- <div class="field">
          <button class="button" @click="switchMode">
            <template v-if="theme === 'dark'">
              Light Mode
            </template>
            <template v-else>
              Dark Mode
            </template>
          </button>
        </div> -->
      </template>
    </hero-section>

    <section
      class="section fixed-column"
      v-if="isAdminOrAbove && !isCurrentUser"
    >
      <div class="container has-text-centered">
        <div class="field">
          <label class="label">Level</label>
          <div class="control has-text-centered">
            <div class="select">
              <select
                name="level-select"
                id="level-select"
                v-model="user.level"
              >
                <option value="0">Reader</option>
                <option value="1">Member</option>
                <option value="2">Author</option>
                <option value="3">Moderator</option>
                <option value="4">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <div v-html="levelDescriptions[user.level]"></div>
        </div>

        <div class="field">
          <button class="button is-primary" @click="setUserLevel">
            Set Level
          </button>
        </div>
      </div>
    </section>

    <section class="section fixed-column">
      <div v-if="isCurrentUser">
        <post-list v-if="user.id" :userId="user.id" :drafts="true" />
      </div>
      <post-list v-if="user.id" :userId="user.id" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import HeroSection from "@/components/HeroSection.vue";
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
    PostList,
    HeroSection
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

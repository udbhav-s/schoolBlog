<template>
  <div class="user-page">
    <hero-section>
      <h1 class="title">{{ user.name }}</h1>
      <div class="subtitle">
        <div>{{ user.portalId }}</div>
        <div>{{ user.type }}</div>
      </div>

      <template v-if="isCurrentUser">
        <div class="field">
          <button v-if="isCurrentUser" @click="logout" class="button">
            Log Out
          </button>
        </div>

        <div class="field">
          <button class="button" @click="switchMode">
            <template v-if="theme === 'dark'">
              Light Mode
            </template>
            <template v-else>
              Dark Mode
            </template>
          </button>
        </div>
      </template>
    </hero-section>

    <section class="section fixed-column" v-if="isAdminOrAbove && !isCurrentUser">
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

    <section class="section fixed-container">
      <post-list v-if="this.user.id" :userId="user.id" />
    </section>
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue";
import { userService } from "@/services/dataService.js";
import { mapGetters } from "vuex";
import { LOGOUT } from "@/store/actions.type.js";
import { SET_THEME } from "@/store/mutations.type.js";
import PostList from "@/components/post/PostList.vue";

export default {
  name: "User",
  props: ["userId"],

  data() {
    return {
      user: {},
      isDarkMode: null,
      levelDescriptions: [
        // Reader
        `
        Can see verified posts and comments. <br>
        Cannot submit posts and comments.
        `,
        // Member
        `
        Can see verified posts and comments. <br>
        Can submit posts for verification. <br>
        Can submit comments on verified posts.
        `,
        // Author
        `
        Can see verified posts and comments. <br>
        Submitted posts are automatically verified. <br>
        Can submit comments on verified posts.
        `,
        // Moderator
        `
        Can see all posts and comments. <br>
        Submitted posts are automatically verified. <br>
        Can delete any post or comment.
        `,
        // Admin
        `
        All the permissions of moderator. <br>
        Can change the permission level of other user. <br>
        (Such as setting new moderators or authors, or demoting them).
        `
      ]
    };
  },

  computed: {
    isCurrentUser() {
      return this.user.id === this.currentUser.id;
    },

    ...mapGetters(["currentUser", "isAdminOrAbove", "theme"])
  },

  mounted() {
    this.loadUser();
  },

  watch: {
    userId(oldId, newId) {
      if (oldId !== newId) {
        this.loadUser();
      }
    }
  },

  methods: {
    async loadUser() {
      const result = await userService.getById(this.userId);
      if (!result.success) throw result.error;
      else this.user = result.data;
    },

    async logout() {
      await this.$store.dispatch(LOGOUT);
      this.$router.push("/login");
    },

    async setUserLevel() {
      try {
        const result = await userService.setLevel(
          this.user.id,
          this.user.level
        );
        if (!result.success) throw result.message;
        this.user = result.data;

        this.$toasted.success("User level changed");
      } catch (err) {
        this.$toasted.error("An error occured");
      }
    },

    switchMode() {
      if (this.theme === "dark") {
        this.$store.commit(SET_THEME, "light");
      } else {
        this.$store.commit(SET_THEME, "dark");
      }
      window.location.reload();
    }
  },

  components: {
    PostList,
    HeroSection
  }
};
</script>

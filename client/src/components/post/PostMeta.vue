<template>
  <div>
    <div class="post-info">
      <username :user="post.user"></username>
      <div>{{ date }}</div>
      <span class="tags has-text-centered">
        <span class="tag has-text-info" v-if="post.category">{{ post.category.name }}</span>
        <span v-if="!post.verified" class="tag has-text-danger">Unverified</span>
      </span>
    </div>
    <div class="post-options buttons are-small" v-if="showOptions">
      <router-link
        class="button is-primary"
        v-if="byCurrentUser"
        :to="{
          name: 'EditPost',
          params: {
            id: post.id
          }
        }"
      >
        Edit
      </router-link>

      <button
        v-if="byCurrentUser || isModOrAbove"
        @click="deletePost"
        class="button is-danger"
      >
        Delete
      </button>

      <template v-if="isModOrAbove">
        <button
          v-if="!post.verified"
          @click="verifyPost"
          class="button is-primary"
        >
          Verify
        </button>
        <button
          v-if="post.verified"
          @click="unverifyPost"
          class="button is-danger"
        >
          Unverify
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Username from "@/components/Username.vue";
import { postService } from "@/services/dataService.js";

export default {
  name: "PostMeta",
  props: ["post", "showOptions"],

  computed: {
    date() {
      return new Date(this.post.createdAt).toDateString();
    },

    byCurrentUser() {
      return this.post.user.id === this.currentUser.id;
    },

    ...mapGetters(["currentUser", "isModOrAbove"])
  },

  methods: {
    async deletePost() {
      const result = await postService.delete(this.post.id);
      if (!result.success) this.$toasted.error(result.message);
      this.$toasted.success("Post deleted");
      this.$emit("postDeleted");
    },

    async verifyPost() {
      const result = await postService.verify(this.post.id);
      if (!result.success) this.$toasted.error(result.message);
      else {
        this.post.verified = true;
        this.$toasted.success("Post verified!");
      }
    },

    async unverifyPost() {
      const result = await postService.unverify(this.post.id);
      if (!result.success) this.$toasted.error(result.message);
      else {
        this.post.verified = false;
        this.$toasted.success("Post unverified");
      }
    }
  },

  components: {
    Username
  }
};
</script>

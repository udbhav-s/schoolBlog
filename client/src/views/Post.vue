<template>
  <div class="section fixed-column post-page" v-if="post">
    <div
      v-if="post.user.id === currentUser.id && !post.verified && !isModOrAbove"
      class="text-clr-text-light my-2"
    >
      <font-awesome-icon icon="info-circle" />
      This post has been submitted for verification. Once a moderator approves
      it, it will be visible to all other users in their feed.
    </div>

    <h1 class="text-4xl md:text-5xl text-clr-text-dark leading-tight font-bold">
      {{ post.title }}
    </h1>

    <post-meta
      :post="post"
      @postDeleted="postDeleted"
      @post-verified="postVerified"
      @post-unverified="postUnverified"
      @post-liked="postLiked"
      @post-unliked="postUnliked"
      :showOptions="true"
      :showCategory="false"
      class="mt-4"
    />

    <div
      v-if="(post.category && post.category.name) || isModOrAbove"
      class="my-3 leading-tight flex items-center justify-between flex-wrap"
    >
      <template v-if="!categoryChange">
        <div class="text-clr-text-light font-bold">
          <template v-if="post.category">{{ post.category.name }}</template>
          <template v-else>No category</template>
        </div>

        <button
          v-if="isModOrAbove"
          @click="categoryChange = true"
          class="button"
        >
          Change category
        </button>
      </template>

      <template v-else>
        <select v-model="selectedCategory" class="input">
          <option :value="null" selected>Category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <div class="space-x-1">
          <button
            v-if="isModOrAbove"
            @click="setCategory"
            class="button button-success"
          >
            Update
          </button>
          <button @click="categoryChange = false" class="button button-danger">
            Cancel
          </button>
        </div>
      </template>
    </div>

    <div v-if="post.thumbnail" class="mt-2">
      <img :src="`/api/file/${post.thumbnail}`" class="w-full" />
    </div>

    <div
      class="prose prose-lg font-serif max-w-full mt-4"
      v-html="post.body"
    ></div>

    <div v-if="post.attachments && post.attachments.length > 0">
      <h2 class="text-3xl my-6 font-bold">Attachments</h2>
      <attachments :attachments="post.attachments" />
    </div>

    <div>
      <h2 class="text-3xl my-6 font-bold">Comments</h2>

      <comment-list
        v-if="post.id"
        :postId="post.id"
        :showAddComment="isMemberOrAbove"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { postService } from "@/services";
import PostMeta from "@/components/post/PostMeta.vue";
import CommentList from "@/components/comment/CommentList.vue";
import Attachments from "@/components/post/Attachments.vue";
import { userStore, categoryStore } from "@/store";
import { defineComponent, computed, ref } from "@vue/composition-api";
import { Post, Category } from "@/types";

export default defineComponent({
  name: "Post",
  props: {
    id: {
      type: Number as () => number,
      required: true
    }
  },
  components: {
    PostMeta,
    CommentList,
    Attachments
  },

  setup(props, { root }) {
    const isMemberOrAbove = computed(userStore.getters.isMemberOrAbove);
    const isModOrAbove = computed(userStore.getters.isModOrAbove);
    const currentUser = computed(userStore.getters.user);
    const post = ref<Post>(null);

    const selectedCategory = ref<number>(null);
    const categories = computed(categoryStore.getters.categories);
    const categoryChange = ref(false);

    const loadPost = async () => {
      // get post
      try {
        const result = await postService.getById(props.id);
        post.value = result;
      } catch (err) {
        console.log({ ...err });
        if (err.statusCode === 403 || err.statusCode === 404) {
          root.$router.push({ name: "NotFound" });
        } else root.$toasted.error("Couldn't load post data");
      }
    };
    loadPost();

    const postDeleted = async () => {
      root.$router.push("/");
    };

    const postVerified = () => {
      if (post.value) post.value.verified = true;
    };

    const postUnverified = () => {
      if (post.value) post.value.verified = false;
    };

    const postLiked = () => {
      if (post.value) {
        post.value.isLiked = true;
        post.value.numberOfLikes++;
      }
    };

    const postUnliked = () => {
      if (post.value) {
        post.value.isLiked = false;
        post.value.numberOfLikes--;
      }
    };

    const setCategory = async () => {
      if (selectedCategory.value && post.value) {
        try {
          await postService.setCategory(post.value.id, selectedCategory.value);

          post.value.category = categories.value.find(
            c => c.id === selectedCategory.value
          );

          categoryChange.value = false;
          root.$toasted.success("Category changed");
        } catch {
          root.$toasted.error("An error occured");
        }
      }
    };

    return {
      isMemberOrAbove,
      isModOrAbove,
      post,
      loadPost,
      postDeleted,
      postVerified,
      postUnverified,
      postLiked,
      postUnliked,
      currentUser,
      categories,
      categoryChange,
      selectedCategory,
      setCategory
    };
  }
});
</script>

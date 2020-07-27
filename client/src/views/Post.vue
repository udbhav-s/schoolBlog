<template>
  <div class="section fixed-column post-page" v-if="post">
    <h1 class="text-4xl text-clr-text-dark md:text-5xl leading-tight font-bold">
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
      class="my-4"
    />

    <div v-if="post.thumbnail" class="mt-2">
      <img :src="`/api/file/${post.thumbnail}`" class="w-full" />
    </div>

    <div class="prose prose-lg max-w-full mt-4" v-html="post.body"></div>

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
import { userStore } from "@/store";
import { defineComponent, computed, ref } from "@vue/composition-api";
import { Post } from "@/types";

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
    const post = ref<Post>(null);

    const loadPost = async () => {
      // get post
      const result = await postService.getById(props.id);
      if ("success" in result) {
        post.value = result.data;
      } else {
        if (result.status === 403) root.$router.push("/");
        else root.$toasted.error("Couldn't load post data");
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

    return {
      isMemberOrAbove,
      post,
      loadPost,
      postDeleted,
      postVerified,
      postUnverified,
      postLiked,
      postUnliked
    };
  }
});
</script>

<template>
  <div class="section fixed-column post-page" v-if="post">
    <h1 class="title">{{ post.title }}</h1>
    <post-meta :post="post" @postDeleted="postDeleted" :showOptions="true" />

    <div v-if="post.thumbnail" class="image post-thumbnail">
      <img :src="`/api/file/${post.thumbnail}`" />
    </div>

    <div class="content" v-html="post.body"></div>

    <div>
      <h2 class="title is-4">Comments:</h2>

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
    CommentList
  },

  setup(props, { root }) {
    const isMemberOrAbove = computed(userStore.getters.isMemberOrAbove);
    const post = ref<Post>(null);

    const loadPost = async () => {
      // get post
      const result = await postService.getById(props.id);
      if ("error" in result) {
        if (result.status === 403) root.$router.push("/");
        else root.$toasted.error("Couldn't load post data");
      } else post.value = result.data;
    };
    loadPost();

    const postDeleted = async () => {
      root.$router.push("/");
    };

    return {
      isMemberOrAbove,
      post,
      loadPost,
      postDeleted
    };
  }
});
</script>

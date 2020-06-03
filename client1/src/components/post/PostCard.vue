<template>
  <div>
    <router-link
      :to="{
        name: 'Post',
        params: {
          id: post.id
        }
      }"
    >
      <div class="box is-paddingless post-card">
        <div class="thumbnail-container" v-if="post.thumbnail">
          <img
            class="thumbnail"
            :src="`/api/file/thumbnail/${post.thumbnail}`"
          />
        </div>

        <div class="content-container">
          <h3 class="title is-4">{{ post.title }}</h3>
          <post-meta :post="post" />
        </div>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import PostMeta from "@/components/post/PostMeta.vue";
import { Post } from "@/types";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "PostCard",
  props: {
    post: {
      type: Object as () => Post,
      required: true
    }
  },
  components: {
    PostMeta
  }
});
</script>

<template>
  <div>
    <hr class="my-6" />

    <router-link
      :to="{
        name: post.published ? 'Post' : 'EditPost',
        params: {
          id: post.id
        }
      }"
    >
      <h1 class="text-4xl text-clr-text-dark font-semibold leading-tight py-2">
        {{ post.title }}
      </h1>
    </router-link>

    <post-meta :post="post" :showOptions="false" dateType="relative" />

    <template v-if="post.published">
      <div v-if="post.thumbnail">
        <img
          :src="`/api/file/${post.thumbnail}`"
          class="thumbnail rounded w-full my-2 mb-3 object-cover"
        />
      </div>
      <div v-else class="my-2"></div>

      <div v-html="postPreview" class="prose font-serif max-w-full"></div>

      <router-link
        :to="{
          name: 'Post',
          params: {
            id: post.id
          }
        }"
        class="block text-center text-blue-600 my-2"
      >
        Read Full
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import Username from "@/components/user/Username.vue";
import PostMeta from "@/components/post/PostMeta.vue";
import { defineComponent, computed } from "@vue/composition-api";
import { Post } from "@/types";
import timeDifference from "@/util/timeDifference";
import clip from "text-clipper";

export default defineComponent({
  name: "PostCard",
  props: {
    post: {
      type: Object as () => Post,
      required: true
    }
  },
  components: {
    Username,
    PostMeta
  },

  setup(props) {
    const postDate = computed<string>(() =>
      timeDifference(new Date(), new Date(props.post.createdAt))
    );

    const postPreview = computed<string>(() => {
      if (props.post.body) {
        return clip(props.post.body, 300, {
          html: true,
          imageWeight: 301
        });
      } else return "";
    });

    return {
      postDate,
      postPreview
    };
  }
});
</script>

<style scoped>
.thumbnail {
  max-height: 25rem;
}
</style>

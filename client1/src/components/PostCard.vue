<template>
  <div>
    <div class="post-card">
      <div class="post-thumbnail-container">
        <div v-if="post.thumbnail">
          <img :src="`/api/file/${post.thumbnail}`" />
        </div>
      </div>

      <div class="post-preview-container">
        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-info">
          <div class="post-user">By <username :user="post.user" /></div>
          <span class="post-date">
            {{ postDate }}
          </span>
          <span class="post-category"> {{ post.category.name }}</span>
        </div>

        <div v-html="postPreview" class="post-content"></div>

        <div class="post-full-link">
          <router-link
            :to="{
              name: 'Post',
              params: {
                id: post.id
              }
            }"
          >
            Read Full
          </router-link>
        </div>
      </div>
    </div>

    <div class="hr" />
  </div>
</template>

<script lang="ts">
import PostMeta from "@/components/post/PostMeta.vue";
import Username from "@/components/user/Username.vue";
import { defineComponent, computed } from "@vue/composition-api";
import { Post } from "../types";
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
    PostMeta,
    Username
  },

  setup(props) {
    const postDate = computed<string>(() =>
      timeDifference(new Date(), new Date(props.post.createdAt))
    );

    const postPreview = computed<string>(() => {
      if (props.post.body) {
        return clip(props.post.body, 300, {
          html: true
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

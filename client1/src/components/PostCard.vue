<template>
  <div>
    <div class="post-card">
      <router-link
        :to="{
          name: 'Post',
          params: {
            id: post.id
          }
        }"
      >
        <h1 class="post-title">{{ post.title }}</h1>
      </router-link>

      <div class="post-user">
        <username :user="post.user">
          <span class="post-date">
            {{ postDate }}
          </span>
          <span v-if="post.category" class="post-category">
            {{ post.category.name }}
          </span>
          <span v-if="!post.verified">
            Unverified
          </span>
        </username>

        <router-link
          v-if="!post.published"
          :to="{
            name: 'EditPost',
            params: {
              id: post.id
            }
          }"
          class="button"
        >
          <font-awesome-icon icon="pencil-alt" />
        </router-link>
      </div>

      <template v-if="post.published">
        <div class="post-thumbnail-container">
          <div v-if="post.thumbnail">
            <img :src="`/api/file/${post.thumbnail}`" />
          </div>
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
      </template>
    </div>

    <div class="hr" />
  </div>
</template>

<script lang="ts">
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

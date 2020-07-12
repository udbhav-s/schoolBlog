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
      <h1 class="text-4xl">{{ post.title }}</h1>
    </router-link>

    <div class="flex flex-row items-center justify-between">
      <username :user="post.user" class="my-1">
        <span class="mr-1">
          {{ postDate }}
        </span>
        <span v-if="post.category" class="mr-1">
          {{ post.category.name }}
        </span>
        <span v-if="!post.verified" class="mr-1 text-red-500">
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
      <div v-if="post.thumbnail">
        <img :src="`/api/file/${post.thumbnail}`" class="w-full my-2 mb-3" />
      </div>
      <div v-else class="my-2"></div>

      <div v-html="postPreview" class="font-serif post-content"></div>

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

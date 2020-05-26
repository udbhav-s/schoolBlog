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
      <div>
        <div v-if="post.thumbnail">
          <img :src="`/api/file/thumbnail/${post.thumbnail}`" />
        </div>

        <div>
          <h3>{{ post.title }}</h3>
          <div>postPreview</div>
        </div>
      </div>

      <div>
        <span>
          By { post.user.name }
        </span>
        <span>
          postDate
        </span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import PostMeta from "@/components/post/PostMeta.vue";
import { defineComponent, computed } from "@vue/composition-api";
import { Post } from "../types";
import timeDifference from "@/util/timeDifference";

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
  },

  setup(props) {
    const postDate = computed<string>(() =>
      timeDifference(new Date(), new Date(props.post.createdAt))
    );

    const postPreview = computed<string>(() => {
      if (props.post.body) {
        const text = document.createElement(props.post.body).innerText;
        return text.length > 300 ? text.substring(0, 300) + "..." : text;
      } else return "";
    });

    return {
      postDate,
      postPreview
    };
  }
});
</script>

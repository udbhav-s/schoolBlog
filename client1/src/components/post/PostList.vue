<template>
  <div>
    <post-search
      v-if="showOptions"
      @search="search"
      @close="showOptions = false"
    />
    <div v-else class="level is-mobile post-list-head">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">
            <template v-if="drafts">Drafts</template>
            <template v-else>Posts</template>
          </h1>
        </div>
      </div>
      <div v-if="showSearch" class="level-right">
        <div class="level-item">
          <a class="title is-5" @click="showOptions = true">Search</a>
        </div>
      </div>
    </div>

    <div v-for="post in posts" :key="post.id">
      <post-card :post="post" />
    </div>

    <div v-if="posts.length == 0" class="has-text-centered">
      <h2>No Posts</h2>
    </div>

    <div class="has-text-centered">
      <button v-if="hasMorePosts" class="button is-info" @click="loadPosts">
        Load More
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import PostCard from "@/components/post/PostCard.vue";
import PostSearch from "@/components/post/PostSearch.vue";
import { postService } from "@/services";
import { Post, PostQueryOptions } from "@/types";
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "PostList",
  props: {
    userId: {
      type: Number as () => number
    },
    drafts: {
      type: Boolean as () => boolean
    },
    showSearch: {
      type: Boolean as () => boolean
    }
  },
  components: {
    PostCard,
    PostSearch
  },

  setup(props) {
    const posts = ref<Post[]>([]);
    const hasMorePosts = ref<boolean>(true);
    const showOptions = ref<boolean>(false);

    let searchOptions = {} as PostQueryOptions;
    const options: PostQueryOptions = {
      limit: 10,
      offset: 0
    };

    const loadPosts = async (reset?: boolean) => {
      if (reset) {
        posts.value = [];
        options.offset = 0;
      }

      const opts = {
        ...searchOptions,
        ...options
      };
      if (props.userId) opts.userId = props.userId;
      if (props.drafts) opts.published = false;

      const result = await postService.getAll(opts);
      if ("error" in result) throw result.message;

      if (result.data.length > 0) {
        result.data.forEach(post => posts.value.push(post));
        options.offset += options.limit;
      }
      if (result.data.length < options.limit) hasMorePosts.value = false;
    };
    loadPosts();

    const search = async (options: PostQueryOptions) => {
      searchOptions = options;
      loadPosts(true);
    };

    return {
      posts,
      hasMorePosts,
      showOptions,
      loadPosts,
      search
    };
  }
});
</script>

<template>
  <div>
    <div>
      <post-search v-if="showOptions" @search="search" @close="cancelSearch" />
      <div v-else-if="searchable" class="text-center">
        <button
          class="button border-none text-xl px-4"
          @click="showOptions = true"
        >
          <font-awesome-icon icon="search" class="mr-1" />
          Search
        </button>
      </div>

      <div class="hr"></div>

      <div v-for="post in posts" :key="post.id">
        <post-card :post="post" />
      </div>

      <div v-if="posts.length == 0 && !loading" class="text-center my-6">
        <h2>No Posts</h2>
      </div>

      <div class="my-6 text-center">
        <button
          v-if="hasMorePosts && !loading"
          class="button"
          @click="loadPosts"
        >
          Load More
        </button>
      </div>
    </div>
    <spinner v-if="loading" />
  </div>
</template>

<script lang="ts">
import PostCard from "@/components/post/PostCard.vue";
import PostSearch from "@/components/post/PostSearch.vue";
import Spinner from "@/components/Spinner.vue";
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
    searchable: {
      type: Boolean as () => boolean
    }
  },
  components: {
    PostCard,
    PostSearch,
    Spinner
  },

  setup(props) {
    const posts = ref<Post[]>([]);
    const hasMorePosts = ref<boolean>(true);
    const showOptions = ref<boolean>(false);
    const loading = ref<boolean>(false);

    let searchOptions = {} as PostQueryOptions;
    const options: PostQueryOptions = {
      limit: 10,
      offset: 0
    };

    const resetSearchOptions = () => {
      searchOptions = {} as PostQueryOptions;
      options.limit = 10;
      options.offset = 10;
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

      loading.value = true;
      const result = await postService.getAll(opts);
      loading.value = false;
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

    const cancelSearch = () => {
      resetSearchOptions();
      showOptions.value = false;
      loadPosts(true);
    };

    return {
      posts,
      hasMorePosts,
      showOptions,
      loadPosts,
      search,
      cancelSearch,
      loading
    };
  }
});
</script>

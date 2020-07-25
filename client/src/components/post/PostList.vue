<template>
  <div>
    <div v-if="posts.length > 0" class="animate-fade-up">
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

      <div v-for="post in posts" :key="post.id">
        <post-card :post="post" />
      </div>

      <div class="my-6 text-center">
        <button
          v-if="hasMorePosts && !loading"
          class="button"
          @click="loadPosts(false)"
        >
          Load More
        </button>
      </div>
    </div>

    <div v-if="posts.length == 0 && !loading" class="text-center my-6">
      <div v-if="drafts">No Drafts</div>
      <div v-else>No Posts</div>
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
import { defineComponent, ref, computed } from "@vue/composition-api";
import useList from "@/composables/use-list";

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
    },
    verified: {
      type: Boolean as () => boolean,
      default: undefined
    },
    categoryId: {
      type: Number as () => number
    }
  },
  components: {
    PostCard,
    PostSearch,
    Spinner
  },

  setup(props) {
    const searchOptions = ref<Partial<PostQueryOptions>>({});
    const options = computed<Partial<PostQueryOptions>>(() => {
      const opts = {
        ...searchOptions.value,
        userId: props.userId,
        published: !props.drafts,
        categoryId: props.categoryId
      };

      if (props.verified !== undefined) opts.verified = props.verified;
      return opts;
    });

    const {
      items: posts,
      hasMoreItems: hasMorePosts,
      loading,
      loadItems: loadPosts
    } = useList<Post>(postService.getAll, 10, options);

    const showOptions = ref<boolean>(false);

    const search = async (options: PostQueryOptions) => {
      searchOptions.value = options;
    };

    const cancelSearch = () => {
      searchOptions.value = {} as PostQueryOptions;
      showOptions.value = false;
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

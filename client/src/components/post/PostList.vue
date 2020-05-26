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
          <h1 class="title">Posts</h1>
        </div>
      </div>
      <div class="level-right">
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

<script>
import PostCard from "@/components/post/PostCard.vue";
import PostSearch from "@/components/post/PostSearch.vue";
import { postService } from "@/services/dataService.js";

export default {
  name: "PostList",
  props: ["userId"],

  data() {
    return {
      posts: [],
      options: {
        limit: 10,
        offset: 0
      },
      hasMorePosts: true,
      searchOptions: {},
      showOptions: false
    };
  },

  created() {
    this.loadPosts();
  },

  methods: {
    async loadPosts() {
      const options = {
        ...this.searchOptions,
        ...this.options
      };
      if (this.userId) options.userId = this.userId;

      const result = await postService.getAll(options);
      if (!result.success) throw result.message;

      if (result.data.length > 0) {
        result.data.forEach(post => this.posts.push(post));
        this.options.offset += this.options.limit;
      }
      if (result.data.length < this.options.limit) this.hasMorePosts = false;
    },

    search(options) {
      this.posts = [];
      this.searchOptions = options;
      this.offset = 0;
      this.loadPosts();
    }
  },

  components: {
    PostCard,
    PostSearch
  }
};
</script>

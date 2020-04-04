<template>
  <div class="section fixed-column post-page">
    <h1 class="title">{{ post.title }}</h1>
    <post-meta :post="post" @postDeleted="postDeleted" :showOptions="true" />

    <div v-if="post.thumbnail" class="image post-thumbnail">
      <img :src="`/api/file/thumbnail/${post.thumbnail}`" />
    </div>

    <div class="content" v-html="post.body"></div>

    <div>
      <h2 class="title is-4">Comments:</h2>

      <comment-list
        v-if="post.id"
        :postId="post.id"
        :showAddComment="isMemberOrAbove"
      />
    </div>
  </div>
</template>

<script>
import { postService } from "@/services/dataService.js";
import PostMeta from "@/components/post/PostMeta.vue";
import CommentList from "@/components/comment/CommentList.vue";
import { mapGetters } from "vuex";

export default {
  name: "Post",
  props: ["id"],

  data() {
    return {
      post: {
        title: "",
        body: "",
        category: "",
        verified: false,
        date: "",
        user: {
          name: ""
        }
      }
    };
  },

  computed: {
    ...mapGetters(["isMemberOrAbove"])
  },

  beforeMount() {
    this.loadPost();
  },

  methods: {
    async loadPost() {
      // get post
      const result = await postService.getById(this.id);
      if (!result.success) {
        if (result.statusCode === 403) this.$router.push("/");
        else this.$toasted.error("Couldn't load post data");
      } else this.post = result.data;
    },

    postDeleted() {
      this.$router.push("/");
    }
  },

  components: {
    PostMeta,
    CommentList
  }
};
</script>

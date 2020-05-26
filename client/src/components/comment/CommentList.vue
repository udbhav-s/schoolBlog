<template>
  <div class="comments">
    <div v-if="showAddComment" class="add-comment">
      <comment-edit @commentAdded="commentAdded" :postId="postId" />
    </div>

    <comment
      v-for="comment in comments"
      :comment="comment"
      :key="comment.id"
      :adminView="adminView"
      @commentEdited="commentEdited"
      @commentDeleted="commentDeleted"
    />

    <div class="has-text-centered">
      <button
        v-if="hasMoreComments && adminView"
        class="button is-info is-small"
        @click="loadComments"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script>
import { commentService } from "@/services/dataService.js";
import Comment from "@/components/comment/Comment.vue";
import CommentEdit from "@/components/comment/CommentEdit.vue";
import Vue from "vue";

export default {
  name: "CommentList",
  props: {
    postId: Number,
    showAddComment: Boolean,
    adminView: Boolean
  },

  data() {
    return {
      comments: [],
      options: {
        limit: 20,
        offset: 0
      },
      hasMoreComments: true
    };
  },

  created() {
    this.loadComments();
  },

  methods: {
    async loadComments() {
      // load comments
      let result;
      if (this.postId) result = await commentService.getByPost(this.postId);
      else result = await commentService.getAll(this.options);
      if (!result.success) throw result.message;

      if (result.data.length > 0) {
        result.data.forEach(c => this.comments.push(c));
        this.options.offset += this.options.limit;
      }
      if (result.data.length < this.options.limit) this.hasMoreComments = false;
    },

    commentAdded(comment) {
      this.comments.push(comment);
    },

    commentEdited(comment) {
      const index = this.comments.findIndex(c => c.id === comment.id);
      Vue.set(this.comments, index, comment);
    },

    commentDeleted(comment) {
      this.comments = this.comments.filter(c => c.id !== comment.id);
    }
  },

  components: {
    Comment,
    CommentEdit
  }
};
</script>

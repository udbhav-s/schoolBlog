<template>
  <div class="comments">
    <div v-if="showAddComment">
      <comment-edit @commentAdded="commentAdded" :postId="postId" />
    </div>

    <comment
      v-for="comment in comments"
      :comment="comment"
      :key="comment.id"
      @commentEdited="commentEdited"
      @commentDeleted="commentDeleted"
    />
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
    userId: Number,
    showAddComment: Boolean
  },

  data() {
    return {
      comments: []
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
      else if (this.userId)
        result = await commentService.getByUser(this.userId);
      if (!result.success) throw result.message;
      else this.comments = result.data;
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

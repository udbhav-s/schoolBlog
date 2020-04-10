<template>
  <div class="media comment">
    <div class="media-content">
      <div class="content">
        <div>
          <div v-if="adminView && comment.post">
            <router-link 
              :to="{name: 'Post', params: {id: comment.postId}}"
              class="title is-6"
            >
              {{ comment.post.title }}
            </router-link>
          </div>

          <div>
            <username :user="comment.user"></username>
          </div>

          <div v-if="!editComment">{{ comment.body }}</div>
          <div v-else>
            <comment-edit
              @commentEdited="commentEdited"
              :comment="comment"
              :editMode="true"
              :editId="comment.id"
              :postId="comment.postId"
            />
          </div>

          <small>
            <a v-if="!addReply" @click="addReply = true">Reply</a>
            <a v-else @click="addReply = false">Cancel</a>

            <a v-if="byCurrentUser && !editComment" @click="editComment = true"
              >Edit</a
            >
            <a v-if="editComment" @click="editComment = false">Cancel</a>

            <a v-if="byCurrentUser || isModOrAbove" @click="deleteComment">Delete</a>

            <span v-if="comment.edited">(Edited)</span>
          </small>
        </div>
      </div>

      <reply-list
        v-if="comment.id"
        :commentId="comment.id"
        :showAddReply="addReply"
        @replyAdded="addReply = false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { commentService } from "@/services/dataService.js";
import ReplyList from "@/components/reply/ReplyList.vue";
import CommentEdit from "@/components/comment/CommentEdit.vue";
import Username from "@/components/user/Username.vue";

export default {
  name: "Comment",
  props: ["comment", "adminView"],

  data() {
    return {
      addReply: false,
      editComment: false
    };
  },

  computed: {
    byCurrentUser() {
      return this.comment.userId === this.currentUser.id;
    },

    ...mapGetters(["currentUser", "isModOrAbove"])
  },

  methods: {
    commentEdited(comment) {
      this.editComment = false;
      // emit event to change comment data from parent since it's a prop
      this.$emit("commentEdited", comment);
    },

    async deleteComment() {
      // delete the comment
      const result = await commentService.delete(this.comment.id);
      if (!result.success) {
        this.$toasted.error("Error while deleting comment");
        throw result.error;
      } else {
        this.$toasted.success("Comment deleted");
        this.$emit("commentDeleted", result.data);
      }
    }
  },

  components: {
    ReplyList,
    CommentEdit,
    Username
  }
};
</script>

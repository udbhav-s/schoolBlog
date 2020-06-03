<template>
  <div class="media comment">
    <div class="media-content">
      <div class="content">
        <div>
          <div v-if="adminView && comment.post">
            <router-link
              :to="{ name: 'Post', params: { id: comment.postId } }"
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

            <a v-if="byCurrentUser || isModOrAbove" @click="deleteComment"
              >Delete</a
            >

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

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import { commentService } from "@/services";
import ReplyList from "@/components/reply/ReplyList.vue";
import CommentEdit from "@/components/comment/CommentEdit.vue";
import Username from "@/components/user/Username.vue";
import { PostComment } from "@/types";
import { userStore } from "@/store";
import { User } from "@/types";

export default defineComponent({
  name: "Comment",
  props: {
    comment: {
      type: Object as () => PostComment,
      required: true
    },
    adminView: {
      type: Boolean as () => boolean
    }
  },
  components: {
    ReplyList,
    CommentEdit,
    Username
  },

  setup(props, { root, emit }) {
    const addReply = ref<boolean>(false);
    const editComment = ref<boolean>(false);

    const currentUser = computed<User>(userStore.getters.user);
    const isModOrAbove = computed<boolean>(userStore.getters.isModOrAbove);
    const byCurrentUser = computed<boolean>(
      () => props.comment.userId === currentUser.value.id
    );

    const commentEdited = async (comment: PostComment) => {
      editComment.value = false;
      // emit event to change comment data from parent since it's a prop
      emit("commentEdited", comment);
    };

    const deleteComment = async () => {
      // delete the comment
      const result = await commentService.delete(props.comment.id);
      if ("error" in result) {
        root.$toasted.error("Error while deleting comment");
        throw result.error;
      } else {
        root.$toasted.success("Comment deleted");
        emit("commentDeleted", result.data);
      }
    };

    return {
      addReply,
      editComment,
      commentEdited,
      deleteComment,
      currentUser,
      isModOrAbove,
      byCurrentUser
    };
  }
});
</script>

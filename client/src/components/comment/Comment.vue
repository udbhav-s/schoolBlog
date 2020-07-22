<template>
  <div>
    <div>
      <div v-if="adminView && comment.post">
        <router-link
          :to="{ name: 'Post', params: { id: comment.postId } }"
          class="text-xl font-bold block mb-2"
        >
          {{ comment.post.title }}
        </router-link>
      </div>

      <username :user="comment.user" class="mb-3">
        <span>{{ commentDate }}</span>
        <span v-if="comment.edited" class="ml-1">(Edited)</span>
      </username>

      <div v-if="!editComment" class="leading-tight">{{ comment.body }}</div>
      <div v-else>
        <comment-edit
          @commentEdited="commentEdited"
          :comment="comment"
          :editMode="true"
          :editId="comment.id"
          :postId="comment.postId"
          :body="comment.body"
        />
      </div>

      <div class="text-sm text-gray-600 text-right leading-none">
        <button
          v-if="!addReply"
          @click="addReply = true"
          class="button border-none"
        >
          Reply
        </button>
        <button v-else @click="addReply = false" class="button border-none">
          Cancel
        </button>

        <button
          v-if="byCurrentUser && !editComment"
          @click="editComment = true"
          class="button border-none"
        >
          Edit
        </button>
        <button
          v-if="editComment"
          @click="editComment = false"
          class="button border-none"
        >
          Cancel
        </button>

        <button
          v-if="byCurrentUser || isModOrAbove"
          @click="deleteComment"
          class="button border-none"
        >
          Delete
        </button>
      </div>
    </div>

    <hr class="mt-2 mb-4" />

    <reply-list
      v-if="comment.id"
      :commentId="comment.id"
      :showAddReply="addReply"
      @replyAdded="addReply = false"
      class="ml-6 mb-6"
    />
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
import timeDifference from "@/util/timeDifference";

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

    const commentDate = computed<string>(() =>
      timeDifference(new Date(), new Date(props.comment.createdAt))
    );

    const commentEdited = async (comment: PostComment) => {
      editComment.value = false;
      // emit event to change comment data from parent since it's a prop
      emit("commentEdited", comment);
    };

    const deleteComment = async () => {
      if (!confirm("Are you sure you want to permanently delete this post?"))
        return;

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
      byCurrentUser,
      commentDate
    };
  }
});
</script>

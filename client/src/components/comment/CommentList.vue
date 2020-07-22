<template>
  <div>
    <div class="comments">
      <div v-if="showAddComment" class="add-comment mb-4">
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

      <div class="my-6 text-center">
        <button
          v-if="hasMoreComments && adminView"
          class="button"
          @click="loadComments"
        >
          Load More
        </button>
      </div>
    </div>
    <spinner v-if="loading" />
  </div>
</template>

<script lang="ts">
import { commentService } from "@/services";
import Comment from "@/components/comment/Comment.vue";
import CommentEdit from "@/components/comment/CommentEdit.vue";
import Spinner from "@/components/Spinner.vue";
import { PostComment, ApiResponse, QueryOptions } from "@/types";
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "CommentList",
  props: {
    postId: {
      type: Number as () => number
    },
    showAddComment: {
      type: Boolean as () => boolean
    },
    adminView: {
      type: Boolean as () => boolean
    }
  },
  components: {
    Comment,
    CommentEdit,
    Spinner
  },

  setup(props) {
    const comments = ref<PostComment[]>([]);
    const hasMoreComments = ref<boolean>(true);
    const loading = ref<boolean>(false);
    const options = {
      limit: 20,
      offset: 0,
      orderBy: "createdAt",
      order: "desc"
    } as QueryOptions;

    const loadComments = async () => {
      loading.value = true;

      let result: ApiResponse<PostComment[]>;
      if (props.postId) result = await commentService.getByPost(props.postId);
      else result = await commentService.getAll(options);

      loading.value = false;

      if ("error" in result) throw result.message;
      else {
        if (result.data.length > 0) {
          result.data.forEach(c => comments.value.push(c));
          options.offset += options.limit;
        }
        if (result.data.length < options.limit) hasMoreComments.value = false;
      }
    };
    loadComments();

    const commentAdded = async (comment: PostComment) => {
      comments.value.push(comment);
    };

    const commentEdited = async (comment: PostComment) => {
      const index = comments.value.findIndex(c => c.id === comment.id);
      comments.value.splice(index, 1, comment);
    };

    const commentDeleted = async (comment: PostComment) => {
      comments.value = comments.value.filter(c => c.id !== comment.id);
    };

    return {
      comments,
      hasMoreComments,
      loadComments,
      commentAdded,
      commentEdited,
      commentDeleted,
      loading
    };
  }
});
</script>

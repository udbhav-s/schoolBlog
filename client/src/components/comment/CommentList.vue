<template>
  <div>
    <div>
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
          v-if="hasMoreComments && !loading"
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
import { PostComment, QueryOptions, CommentQueryOptions } from "@/types";
import { defineComponent, ref, computed } from "@vue/composition-api";
import useList from "@/composables/use-list";

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
    const sortOptions = ref<QueryOptions>({
      orderBy: "createdAt",
      order: "desc"
    });
    const options = computed<CommentQueryOptions>(() => {
      return {
        ...sortOptions?.value,
        postId: props.postId
      };
    });

    const {
      items: comments,
      hasMoreItems: hasMoreComments,
      loading,
      loadItems: loadComments
    } = useList<PostComment>(commentService.getAll, 20, options);

    const commentAdded = async (comment: PostComment) => {
      comments.value.unshift(comment);
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

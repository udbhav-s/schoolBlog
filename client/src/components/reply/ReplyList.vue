<template>
  <div>
    <div>
      <div v-if="showAddReply">
        <reply-edit @replyAdded="replyAdded" :commentId="commentId" />
      </div>

      <div v-for="reply in replies" :key="reply.id">
        <reply
          @replyEdited="replyEdited"
          @replyDeleted="replyDeleted"
          :reply="reply"
          :adminView="adminView"
        />
      </div>

      <div class="my-6 text-center">
        <button
          v-if="hasMoreReplies && !loading"
          class="button is-info is-small"
          @click="loadReplies"
        >
          Load More
        </button>
      </div>
    </div>
    <spinner v-if="loading" />
  </div>
</template>

<script lang="ts">
import { replyService } from "@/services";
import ReplyComponent from "@/components/reply/Reply.vue";
import ReplyEdit from "@/components/reply/ReplyEdit.vue";
import Spinner from "@/components/Spinner.vue";
import { defineComponent, ref, computed } from "@vue/composition-api";
import { Reply, QueryOptions, ReplyQueryOptions } from "@/types";
import useList from "@/composables/use-list";

export default defineComponent({
  name: "ReplyList",
  props: {
    commentId: {
      type: Number as () => number
    },
    showAddReply: {
      type: Boolean as () => boolean
    },
    adminView: {
      type: Boolean as () => boolean
    }
  },
  components: {
    Reply: ReplyComponent,
    ReplyEdit,
    Spinner
  },

  setup(props, { emit }) {
    const sortOptions = ref<QueryOptions>({
      orderBy: "createdAt",
      order: "desc"
    });
    const options = computed<ReplyQueryOptions>(() => {
      return {
        ...sortOptions?.value,
        commentId: props.commentId
      };
    });

    const {
      items: replies,
      hasMoreItems: hasMoreReplies,
      loading,
      loadItems: loadReplies
    } = useList<Reply>(replyService.getAll, 20, options);

    const replyAdded = async (reply: Reply) => {
      emit("replyAdded");
      replies.value.push(reply);
    };

    const replyEdited = async (reply: Reply) => {
      const index = replies.value.findIndex(r => r.id === reply.id);
      replies.value.splice(index, 1, reply);
    };

    const replyDeleted = async (reply: Reply) => {
      replies.value = replies.value.filter(r => r.id !== reply.id);
    };

    return {
      replies,
      hasMoreReplies,
      replyAdded,
      replyEdited,
      replyDeleted,
      loadReplies,
      loading
    };
  }
});
</script>

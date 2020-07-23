<template>
  <div>
    <div v-if="replies.length > 0" class="animate-fade-up">
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
          v-if="hasMoreReplies && adminView && !loading"
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
import { defineComponent, ref, watch } from "@vue/composition-api";
import { Reply, QueryOptions } from "@/types";

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
    const replies = ref<Reply[]>([]);
    const hasMoreReplies = ref<boolean>(true);
    const loading = ref<boolean>(false);
    const options = {
      limit: 20,
      offset: 0
    } as QueryOptions;

    watch(
      () => props.adminView,
      adminView => {
        if (adminView) {
          options.orderBy = "createdAt";
          options.order = "desc";
        }
      }
    );

    const loadReplies = async () => {
      loading.value = true;

      let result;
      if (props.commentId)
        result = await replyService.getByComment(props.commentId);
      else result = await replyService.getAll(options);

      loading.value = false;

      if ("error" in result) throw result.message;

      if (result.data.length > 0) {
        result.data.forEach(r => replies.value.push(r));
        options.offset += options.limit;
      }
      if (result.data.length < options.limit) hasMoreReplies.value = false;
    };
    loadReplies();

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

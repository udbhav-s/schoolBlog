<template>
  <div class="replies">
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

    <div class="has-text-centered">
      <button
        v-if="hasMoreReplies && adminView"
        class="button is-info is-small"
        @click="loadReplies"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { replyService } from "@/services";
import ReplyComponent from "@/components/reply/Reply.vue";
import ReplyEdit from "@/components/reply/ReplyEdit.vue";
import { defineComponent, ref } from "@vue/composition-api";
import { Reply } from "@/types";

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
    ReplyEdit
  },

  setup(props, { emit }) {
    const replies = ref<Reply[]>([]);
    const hasMoreReplies = ref<boolean>(true);
    const options = {
      limit: 20,
      offset: 0
    };

    const loadReplies = async () => {
      let result;
      if (props.commentId)
        result = await replyService.getByComment(props.commentId);
      else result = await replyService.getAll(options);
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
      replies.value[index] = reply;
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
      loadReplies
    };
  }
});
</script>

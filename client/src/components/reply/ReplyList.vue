<template>
  <div class="replies" v-if="replies.length > 0">
    <div v-if="showAddReply">
      <reply-edit @replyAdded="replyAdded" :commentId="commentId" />
    </div>

    <div v-for="reply in replies" :key="reply.id">
      <reply
        @replyEdited="replyEdited"
        @replyDeleted="replyDeleted"
        :reply="reply"
      />
    </div>
  </div>
</template>

<script>
import { replyService } from "@/services/dataService.js";
import Reply from "@/components/reply/Reply.vue";
import ReplyEdit from "@/components/reply/ReplyEdit.vue";
import Vue from "vue";

export default {
  name: "ReplyList",
  props: {
    commentId: Number,
    userId: Number,
    showAddReply: Boolean
  },

  data() {
    return {
      replies: []
    };
  },

  beforeMount() {
    this.loadReplies();
  },

  methods: {
    async loadReplies() {
      let result;
      if (this.commentId)
        result = await replyService.getByComment(this.commentId);
      else if (this.userId) result = await replyService.getByUser(this.userId);
      if (!result.success) throw result.message;
      else this.replies = result.data;
    },

    replyAdded(reply) {
      this.$emit("replyAdded");
      this.replies.push(reply);
    },

    replyEdited(reply) {
      const index = this.replies.findIndex(r => r.id === reply.id);
      Vue.set(this.replies, index, reply);
    },

    replyDeleted(reply) {
      this.replies = this.replies.filter(r => r.id !== reply.id);
    }
  },

  components: {
    Reply,
    ReplyEdit
  }
};
</script>

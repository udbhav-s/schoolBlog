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
        :adminView="adminView"
      />
    </div>

    <div class="has-text-centered">
      <button v-if="hasMoreReplies && adminView" class="button is-info is-small" @click="loadReplies">
        Load More
      </button>
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
    showAddReply: Boolean,
    adminView: Boolean,
  },

  data() {
    return {
      replies: [],
      options: {
        limit: 20,
        offset: 0
      },
      hasMoreReplies: true,
    };
  },

  created() {
    this.loadReplies();
  },

  methods: {
    async loadReplies() {
      let result;
      if (this.commentId)
        result = await replyService.getByComment(this.commentId);
      else result = await replyService.getAll(this.options);
      if (!result.success) throw result.message;
      
      if (result.data.length > 0) {
        result.data.forEach(r => this.replies.push(r));
        this.options.offset += this.options.limit;
      }
      if (result.data.length < this.options.limit) this.hasMoreReplies = false;
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

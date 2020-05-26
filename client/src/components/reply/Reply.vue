<template>
  <div class="media reply">
    <div class="media-content">
      <div class="content">
        <div v-if="adminView && reply.comment.post">
          <router-link
            :to="{ name: 'Post', params: { id: reply.comment.postId } }"
            class="title is-6"
          >
            {{ reply.comment.post.title }}
          </router-link>
        </div>

        <username :user="reply.user"></username>

        <div v-if="!editReply">{{ reply.body }}</div>
        <div v-else>
          <reply-edit
            @replyEdited="replyEdited"
            :editMode="true"
            :editId="reply.id"
            :commentId="reply.commentId"
          />
        </div>

        <small>
          <template v-if="byCurrentUser">
            <a v-if="!editReply" @click="editReply = true">Edit</a>
            <a v-else @click="editReply = false">Cancel</a>
          </template>
          <template v-if="byCurrentUser || isModOrAbove">
            <a @click="deleteReply">Delete</a>
          </template>
          <span v-if="reply.edited">(Edited)</span>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ReplyEdit from "@/components/reply/ReplyEdit.vue";
import { replyService } from "@/services/dataService.js";
import Username from "@/components/user/Username.vue";

export default {
  name: "Reply",
  props: ["reply", "adminView"],

  data() {
    return {
      editReply: false
    };
  },

  computed: {
    byCurrentUser() {
      return this.reply.user.id === this.currentUser.id;
    },

    ...mapGetters(["currentUser", "isModOrAbove"])
  },

  methods: {
    replyEdited(reply) {
      this.editReply = false;
      this.$emit("replyEdited", reply);
    },

    async deleteReply() {
      // delete the reply
      const result = await replyService.delete(this.reply.id);
      if (!result.success) {
        this.$toasted.error("Error deleting reply");
        throw result;
      } else {
        this.$toasted.success("Reply deleted");
        this.$emit("replyDeleted", result.data);
      }
    }
  },

  components: {
    ReplyEdit,
    Username
  }
};
</script>

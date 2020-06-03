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

<script lang="ts">
import ReplyEdit from "@/components/reply/ReplyEdit.vue";
import { replyService } from "@/services";
import Username from "@/components/user/Username.vue";
import { userStore } from "@/store";
import { Reply, User } from "@/types";
import { defineComponent, ref, computed } from "@vue/composition-api";

export default defineComponent({
  name: "Reply",
  props: {
    reply: {
      type: Object as () => Reply,
      required: true
    },
    adminView: {
      type: Boolean as () => boolean
    }
  },
  components: {
    ReplyEdit,
    Username
  },

  setup(props, { root, emit }) {
    const editReply = ref<boolean>(false);
    const currentUser = computed<User>(userStore.getters.user);
    const isModOrAbove = computed<boolean>(userStore.getters.isModOrAbove);
    const byCurrentUser = computed<boolean>(
      () => props.reply.userId === currentUser.value.id
    );

    const replyEdited = (reply: Reply) => {
      editReply.value = false;
      emit("replyEdited", reply);
    };

    const deleteReply = async () => {
      // delete the reply
      const result = await replyService.delete(props.reply.id);
      if ("error" in result) {
        root.$toasted.error("Error deleting reply");
        throw result;
      } else {
        root.$toasted.success("Reply deleted");
        emit("replyDeleted", result.data);
      }
    };

    return {
      editReply,
      isModOrAbove,
      byCurrentUser,
      currentUser,
      replyEdited,
      deleteReply
    };
  }
});
</script>

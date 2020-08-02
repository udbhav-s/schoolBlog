<template>
  <div class="animate-fade-up">
    <div v-if="adminView && reply.comment.post">
      <router-link
        :to="{ name: 'Post', params: { id: reply.comment.postId } }"
        class="text-xl font-bold block mb-2"
      >
        {{ reply.comment.post.title }}
      </router-link>
    </div>

    <username :user="reply.user" class="mb-3">
      <span>{{ replyDate }}</span>
      <span v-if="reply.edited" class="ml-1">(Edited)</span>
    </username>

    <div v-if="!editReply" class="leading-tight">{{ reply.body }}</div>
    <div v-else>
      <reply-edit
        @replyEdited="replyEdited"
        :editMode="true"
        :editId="reply.id"
        :commentId="reply.commentId"
        :body="reply.body"
      />
    </div>

    <div class="text-sm text-gray-600 text-right leading-none">
      <template v-if="byCurrentUser">
        <button
          v-if="!editReply"
          @click="editReply = true"
          class="button border-none"
        >
          Edit
        </button>
        <button v-else @click="editReply = false" class="button border-none">
          Cancel
        </button>
      </template>
      <template v-if="byCurrentUser || isModOrAbove">
        <button @click="deleteReply" class="button border-none">Delete</button>
      </template>
    </div>

    <hr class="mt-2 mb-4" />
  </div>
</template>

<script lang="ts">
import ReplyEdit from "@/components/reply/ReplyEdit.vue";
import { replyService } from "@/services";
import Username from "@/components/user/Username.vue";
import { userStore } from "@/store";
import { Reply, User } from "@/types";
import { defineComponent, ref, computed } from "@vue/composition-api";
import timeDifference from "@/util/timeDifference";

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

    const replyDate = computed<string>(() =>
      timeDifference(new Date(), new Date(props.reply.createdAt))
    );

    const replyEdited = (reply: Reply) => {
      editReply.value = false;
      emit("replyEdited", reply);
    };

    const deleteReply = async () => {
      if (!confirm("Are you sure you want to permanently delete this reply?"))
        return;

      // delete the reply
      try {
        const deletedId = await replyService.delete(props.reply.id);
        root.$toasted.success("Reply deleted");
        emit("replyDeleted", deletedId);
      } catch {
        root.$toasted.error("Error deleting reply");
      }
    };

    return {
      editReply,
      isModOrAbove,
      byCurrentUser,
      currentUser,
      replyEdited,
      deleteReply,
      replyDate
    };
  }
});
</script>

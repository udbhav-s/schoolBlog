<template>
  <div>
    <div>
      <textarea
        placeholder="Write a reply"
        v-model="form.body"
        class="input w-full h-24 p-2"
      ></textarea>
    </div>
    <div>
      <div class="text-center my-2">
        <button
          @click="submitReply"
          :disabled="!form.body.trim()"
          class="button"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { replyService } from "@/services";
import { defineComponent, reactive } from "@vue/composition-api";
import { ReplyCreate } from "@/types";

export default defineComponent({
  name: "ReplyEdit",
  props: {
    commentId: {
      type: Number as () => number,
      required: true
    },
    editMode: {
      type: Boolean as () => boolean
    },
    editId: {
      type: Number as () => number
    },
    // preload the current reply body to hide load delay
    body: {
      type: String as () => string
    }
  },

  setup(props, { root, emit }) {
    const form = reactive<ReplyCreate>({
      body: props.body || "",
      commentId: undefined
    });

    const setReply = async (id: number) => {
      // get reply
      try {
        const result = await replyService.getById(id);
        form.body = result.body;
      } catch {
        root.$toasted.error("Couldn't get reply data");
      }
    };
    if (props.editMode && props.editId) setReply(props.editId);

    const submitReply = async () => {
      // set postId prop to form data
      form.commentId = props.commentId;
      // post comment
      try {
        let result;
        if (props.editMode && props.editId) {
          result = await replyService.update(props.editId, form);
        } else {
          result = await replyService.create(form);
        }
        // clear input
        form.body = "";
        // emit event
        if (props.editMode) emit("replyEdited", result);
        else emit("replyAdded", result);
      } catch {
        root.$toasted.error("Error while submitting reply");
      }
    };

    return {
      form,
      submitReply
    };
  }
});
</script>

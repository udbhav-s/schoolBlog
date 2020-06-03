<template>
  <div>
    <div class="field">
      <div class="control">
        <textarea
          placeholder="Write a reply"
          class="textarea"
          v-model="form.body"
        ></textarea>
      </div>
    </div>
    <div class="field">
      <div class="control has-text-centered">
        <button class="button is-primary is-small" @click="submitReply">
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
    }
  },

  setup(props, { root, emit }) {
    const form = reactive<ReplyCreate>({
      body: "",
      commentId: undefined
    });

    const setReply = async (id: number) => {
      // get reply
      const result = await replyService.getById(id);
      if ("error" in result) {
        root.$toasted.error("Couldn't get reply data");
        throw result.message;
      } else form.body = result.data.body;
    };
    if (props.editMode && props.editId) setReply(props.editId);

    const submitReply = async () => {
      // set postId prop to form data
      form.commentId = props.commentId;
      // post comment
      let result;
      if (props.editMode && props.editId) {
        result = await replyService.update(props.editId, form);
      } else {
        result = await replyService.create(form);
      }

      if ("error" in result) {
        root.$toasted.error("Error while submitting reply");
        throw result.error;
      } else {
        // clear input
        form.body = "";
        // emit event
        if (props.editMode) emit("replyEdited", result.data);
        else emit("replyAdded", result.data);
      }
    };

    return {
      form,
      submitReply
    };
  }
});
</script>

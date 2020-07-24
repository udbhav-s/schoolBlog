<template>
  <div>
    <div>
      <textarea
        v-model="form.body"
        placeholder="Write a comment"
        class="input-border w-full h-24 p-2"
      ></textarea>
    </div>
    <div>
      <div class="text-center my-2">
        <button
          @click="submitComment"
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
import { commentService } from "@/services";
import { defineComponent, reactive } from "@vue/composition-api";
import { CommentCreate } from "@/types";

export default defineComponent({
  name: "CommentEdit",
  props: {
    postId: {
      type: Number as () => number,
      required: true
    },
    editMode: {
      type: Boolean as () => boolean
    },
    editId: {
      type: Number as () => number
    },
    // preload the current comment body to hide load delay
    body: {
      type: String as () => string
    }
  },

  setup(props, { root, emit }) {
    const form = reactive<CommentCreate>({
      body: props.body || "",
      postId: undefined
    });

    const setComment = async (id: number) => {
      const result = await commentService.getById(id);
      if ("success" in result) form.body = result.data.body;
      else {
        root.$toasted.error("Error while getting comment data");
        throw result.message;
      }
    };
    if (props.editMode && props.editId) setComment(props.editId);

    const submitComment = async () => {
      // set postId prop to form data
      form.postId = props.postId;

      // post comment
      let result;
      if (props.editMode && props.editId) {
        result = await commentService.update(props.editId, form);
      } else {
        result = await commentService.create(form);
      }

      if ("success" in result) {
        // clear input
        form.body = "";
        // emit event
        if (props.editMode) emit("commentEdited", result.data);
        else emit("commentAdded", result.data);
      } else {
        root.$toasted.error(result.message);
        throw result;
      }
    };

    return {
      form,
      submitComment
    };
  }
});
</script>

<template>
  <div>
    <div>
      <textarea
        v-model="form.body"
        placeholder="Write a comment"
        class="input w-full h-24 p-2"
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
      try {
        form.body = (await commentService.getById(id)).body;
      } catch {
        root.$toasted.error("Error while getting comment data");
      }
    };
    if (props.editMode && props.editId) setComment(props.editId);

    const submitComment = async () => {
      // set postId prop to form data
      form.postId = props.postId;

      // post comment
      try {
        let updated;
        if (props.editMode && props.editId) {
          updated = await commentService.update(props.editId, form);
        } else {
          updated = await commentService.create(form);
        }
        // clear input
        form.body = "";
        // emit event
        if (props.editMode) emit("commentEdited", updated);
        else emit("commentAdded", updated);
      } catch {
        root.$toasted.error("Error posting comment");
      }
    };

    return {
      form,
      submitComment
    };
  }
});
</script>

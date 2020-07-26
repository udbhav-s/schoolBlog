<template>
  <div class="flex flex-row items-center justify-between">
    <div>
      <div v-if="!editMode">
        {{ category.name }}
      </div>

      <div v-else>
        <input v-model="form.name" type="text" class="input" />
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <div>
        <button @click="editMode = true" v-if="!editMode" class="button">
          Edit
        </button>
        <button @click="editCategory" v-else class="button">
          Submit
        </button>
      </div>

      <div>
        <button
          v-if="!editMode"
          @click="deleteCategory"
          class="button button-danger"
        >
          Delete
        </button>
        <button @click="editMode = false" v-else class="button button-danger">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Category } from "@/types";

export default defineComponent({
  name: "Category",
  props: {
    category: {
      type: Object as () => Category,
      required: true
    }
  },

  setup(props, { emit }) {
    const editMode = ref<boolean>(false);
    const form = ref<Category>(props.category);

    const deleteCategory = () => {
      emit("categoryDeleted", props.category.id);
    };

    const editCategory = () => {
      editMode.value = false;
      emit("categoryEdited", form.value);
    };

    return {
      editMode,
      form,
      editCategory,
      deleteCategory
    };
  }
});
</script>

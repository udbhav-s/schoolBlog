<template>
  <div class="level is-mobile">
    <div class="level-left">
      <div v-if="!editMode">
        {{ category.name }}
      </div>

      <div v-else class="field is-grouped">
        <div class="control">
          <input v-model="form.name" type="text" class="input is-small" />
        </div>
      </div>
    </div>

    <div class="level-right field is-grouped">
      <div class="control level-item">
        <button
          @click="editMode = true"
          v-if="!editMode"
          class="button is-primary is-small"
        >
          Edit
        </button>
        <button
          @click="categoryEdited"
          v-else
          class="button is-primary is-small"
        >
          Submit
        </button>
      </div>

      <div class="control level-item">
        <button
          v-if="!editMode"
          @click="categoryDeleted"
          class="button is-danger is-small"
        >
          Delete
        </button>
        <button
          @click="editMode = false"
          v-else
          class="button is-danger is-small"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Category",
  props: ["category"],

  data() {
    return {
      editMode: false,
      form: null
    };
  },

  created() {
    this.form = { ...this.category };
  },

  methods: {
    categoryDeleted() {
      this.$emit("categoryDeleted", this.category.id);
    },

    categoryEdited() {
      this.editMode = false;
      this.$emit("categoryEdited", this.form);
    }
  }
};
</script>

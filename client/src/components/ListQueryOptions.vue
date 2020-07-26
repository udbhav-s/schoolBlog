<template>
  <div>
    <select
      v-model="value.order"
      @input="update($event.target.value)"
      class="input"
    >
      <!-- <option value="" selected>Sort</option> -->
      <option value="desc">
        Newest
      </option>
      <option value="asc">
        Oldest
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { QueryOptions } from "@/types";

export default defineComponent({
  name: "ListQueryOptions",
  props: {
    value: Object as () => Partial<QueryOptions>
  },

  setup(props, { emit }) {
    const update = (val: string) =>
      emit("input", { ...props.value, order: val });

    return {
      update
    };
  }
});
</script>

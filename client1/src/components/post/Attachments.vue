<template>
  <div class="attachments">
    <div>
      <a
        :href="`/api/file/${attachment}`"
        download
        v-for="attachment in attachments"
        :key="attachment"
      >
        <div
          class="border border-solid border-gray-300 text-gray-600 font-bold rounded p-2"
        >
          {{ attachment }}
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Attachments",
  props: {
    attachments: {
      type: Array as () => string[]
    }
  }
});
</script>

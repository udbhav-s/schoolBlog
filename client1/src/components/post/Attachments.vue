<template>
  <div class="attachments">
    <h2 class="title is-4">Attachments</h2>
    <div>
      <a
        :href="`/api/file/${attachment}`"
        download
        v-for="attachment in attachments"
        :key="attachment"
      >
        <div class="card">{{ attachment }}</div>
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

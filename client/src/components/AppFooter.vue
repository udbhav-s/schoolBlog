<template>
  <div class="text-center bg-clr-bg-secondary px-2 py-4">
    <a href="https://github.com/hpsb/schoolBlog">
      <font-awesome-icon :icon="['fab', 'github']" class="mr-1" />
      <span class="text-sm">Udbhav</span>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "AppFooter"
});
</script>

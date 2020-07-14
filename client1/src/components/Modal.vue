<template>
  <div
    class="modal hidden fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-75 items-center justify-center"
  >
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Modal"
});
</script>

<style lang="postcss">
.modal.is-active {
  @apply flex;
  animation: modal-animation 0.3s ease-in;
}

.modal-content {
  animation: modal-content-animation 0.2s ease-in;
}

@keyframes modal-animation {
  0% {
    background-opacity: 0;
  }
  100% {
    background-opacity: 75%;
  }
}

@keyframes modal-content-animation {
  0% {
    transform: scale(0.95, 0.95);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>

<template>
  <div class="fixed-column">
    <div class="text-center mb-6">
      <h1
        class="text-clr-text-dark animate-fade-down text-5xl md:text-6xl m-auto"
      >
        THE HPS BLOG
      </h1>
    </div>

    <div class="text-center rounded-md text-2xl bg-clr-bg-secondary p-4">
      <div class="mb-3">Logged out</div>
      <button @click="loginRedirect" class="button text-2xl">Log In</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import loginRedirect from "@/util/loginRedirect";

export default defineComponent({
  name: "Login",

  setup() {
    return {
      loginRedirect
    };
  }
});
</script>

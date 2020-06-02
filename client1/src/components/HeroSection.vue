<template>
  <div class="hero is-info is-medium is-bold is-mobile">
    <div class="hero-body">
      <div class="container has-text-centered">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "HeroSection"
});
</script>

<template>
  <div class="hero is-info is-medium is-bold is-mobile">
    <div class="hero-body">
      <div class="container has-text-centered">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroSection"
};
</script>

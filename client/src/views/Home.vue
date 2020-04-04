<template>
  <div>
    <hero-section>
      <h1 class="title">THE HPS BLOG</h1>
    </hero-section>
    
    <post-list />
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue";
import PostList from "@/components/post/PostList.vue";

export default {
  name: "Home",
  components: {
    PostList,
    HeroSection
  }
};
</script>

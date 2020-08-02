<template>
  <div class="h-full flex justify-center items-center">
    <div class="login rounded shadow-lg p-6">
      <div class="text-center mb-6">
        <h1 class="text-5xl md:text-6xl m-auto">
          THE HPS BLOG
        </h1>
      </div>

      <div class="text-center p-4">
        <button @click="loginRedirect" class="button text-2xl">
          <font-awesome-icon :icon="['fab', 'google']" />
          Log In
        </button>
      </div>
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

<style lang="postcss" scoped>
#main {
  @apply h-screen;
  background-image: url(../assets/images/schoolblurred.jpg);
  background-size: cover;
  background-position: center;
}

.login {
  background: rgba(19, 51, 99, 0.9);
  color: white;
}
</style>

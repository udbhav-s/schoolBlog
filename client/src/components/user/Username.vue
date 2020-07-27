<template>
  <router-link
    :to="{
      name: 'User',
      params: { id: user.id }
    }"
    class="username flex flex-row items-center"
  >
    <img
      :src="user.picture"
      class="rounded-full mr-2 border-2 border-transparent"
      :class="smallPicture ? ['w-6', 'h-6'] : ['w-10', 'h-10']"
    />
    <div>
      <div class="leading-tight">
        {{ user.name }}
        <span v-if="user.level == 3">[M]</span>
        <span v-if="user.level == 4">[A]</span>
      </div>
      <div class="text-xs text-clr-text-light">
        <slot></slot>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { User } from "@/types";

export default defineComponent({
  name: "Username",
  props: {
    user: {
      type: Object as () => User
    },
    smallPicture: {
      type: Boolean as () => boolean
    }
  }
});
</script>

<style lang="postcss">
.username:hover img {
  @apply border-clr-primary-lightest;
}
</style>

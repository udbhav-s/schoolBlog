<template>
  <router-link
    :to="{
      name: 'User',
      params: { id: user.id }
    }"
    class="flex flex-row items-center"
  >
    <img
      src="https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg"
      class="w-10 h-10 rounded-full mr-2"
    />
    <div>
      <div class="text-gray-800">
        {{ user.name }}
        <span v-if="user.level == 3">[M]</span>
        <span v-if="user.level == 4">[A]</span>
      </div>
      <div class="text-xs text-gray-600">
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
    }
  }
});
</script>
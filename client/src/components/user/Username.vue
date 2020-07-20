<template>
  <router-link
    :to="{
      name: 'User',
      params: { id: user.id }
    }"
    class="group flex flex-row items-center"
  >
    <img
      :src="user.picture"
      class="w-10 h-10 rounded-full mr-2 border-2 border-transparent hover:border-blue-300"
    />
    <div>
      <div class="text-gray-800 leading-tight">
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

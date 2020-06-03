<template>
  <div class="user">
    <router-link
      :to="{
        name: 'User',
        params: { id: user.id }
      }"
    >
      {{ user.name }}
      <span v-if="user.level == 3" class="has-text-danger">[M]</span>
      <span v-if="user.level == 4" class="has-text-danger">[A]</span>
    </router-link>
  </div>
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

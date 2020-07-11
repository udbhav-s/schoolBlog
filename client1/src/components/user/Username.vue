<template>
  <router-link
    :to="{
      name: 'User',
      params: { id: user.id }
    }"
    class="user"
  >
    <div class="user-photo">
      <img
        src="https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg"
      />
    </div>
    <div class="username-container">
      <div class="username">
        {{ user.name }}
        <span v-if="user.level == 3" class="has-text-danger">[M]</span>
        <span v-if="user.level == 4" class="has-text-danger">[A]</span>
      </div>
      <div class="username-subtext">
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

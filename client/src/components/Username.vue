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

<script>
export default {
  name: "Username",
  props: {
    user: {
      name: String,
      id: Number,
      level: Number
    }
  }
};
</script>

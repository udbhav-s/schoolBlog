<template>
  <div>
    <div class="table-list">
      <div
        v-for="user in users"
        :key="user.id"
        class="md:flex flex-row flex-wrap items-center justify-between py-4 px-2"
      >
        <username :user="user"></username>
        <div class="py-2">{{ user.email }}</div>
      </div>
    </div>
    <spinner v-if="loading" />
  </div>
</template>

<script lang="ts">
import Username from "@/components/user/Username.vue";
import Spinner from "@/components/Spinner.vue";
import { userService } from "@/services";
import { defineComponent, ref } from "@vue/composition-api";
import { User } from "@/types";

export default defineComponent({
  name: "UserList",
  components: {
    Username,
    Spinner
  },

  setup(props, { root }) {
    const users = ref<User[]>(null);
    const loading = ref<boolean>(false);

    const loadUsers = async () => {
      loading.value = true;
      const result = await userService.getAll();
      loading.value = false;
      if ("error" in result) {
        root.$toasted.error("Error while loading users");
        throw result.message;
      }
      users.value = result.data;
    };
    loadUsers();

    return {
      users,
      loadUsers,
      loading
    };
  }
});
</script>

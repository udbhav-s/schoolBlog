<template>
  <div>
    <div v-if="users && users.length > 0" class="table-list animate-fade-up">
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
      if ("success" in result) users.value = result.data;
      else {
        root.$toasted.error("Error while loading users");
        throw result.message;
      }
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

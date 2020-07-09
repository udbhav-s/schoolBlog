<template>
  <div>
    <div v-for="user in users" :key="user.id" class="level">
      <div class="level-left">
        <div class="level-item">
          <username :user="user"></username>
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          {{ user.email }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Username from "@/components/user/Username.vue";
import { userService } from "@/services";
import { defineComponent, ref } from "@vue/composition-api";
import { User } from "@/types";

export default defineComponent({
  name: "UserList",
  components: {
    Username
  },

  setup(props, { root }) {
    const users = ref<User[]>(null);

    const loadUsers = async () => {
      const result = await userService.getAll();
      if ("error" in result) {
        root.$toasted.error("Error while loading users");
        throw result.message;
      }
      users.value = result.data;
    };
    loadUsers();

    return {
      users,
      loadUsers
    };
  }
});
</script>

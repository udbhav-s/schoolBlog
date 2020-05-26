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
          {{ user.portalId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Username from "@/components/user/Username.vue";
import { userService } from "@/services/dataService.js";

export default {
  name: "UserList",
  data() {
    return {
      users: null
    };
  },

  created() {
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      const result = await userService.getAll();
      if (!result.success) {
        this.$toasted.error("Error while loading users");
        throw result.message;
      }
      this.users = result.data;
    }
  },

  components: {
    Username
  }
};
</script>

<template>
  <div>
    <list-query-options v-if="showListOptions" v-model="sortOptions" />
    <div v-if="users && users.length > 0" class="table-list animate-fade-up">
      <div
        v-for="user in users"
        :key="user.id"
        class="md:flex flex-row flex-wrap items-center justify-between py-4 px-2"
      >
        <username :user="user"></username>
        <div class="py-2">{{ user.email }}</div>
      </div>

      <div class="my-6 text-center">
        <button
          v-if="hasMoreUsers && !loading"
          class="button"
          @click="loadUsers(false)"
        >
          Load More
        </button>
      </div>
    </div>

    <spinner v-if="loading" />
  </div>
</template>

<script lang="ts">
import Username from "@/components/user/Username.vue";
import Spinner from "@/components/Spinner.vue";
import ListQueryOptions from "@/components/ListQueryOptions.vue";
import { userService } from "@/services";
import { defineComponent, ref, watch } from "@vue/composition-api";
import { User, QueryOptions } from "@/types";

export default defineComponent({
  name: "UserList",
  components: {
    Username,
    Spinner,
    ListQueryOptions
  },
  props: {
    showListOptions: {
      type: Boolean as () => boolean,
      default: true
    }
  },

  setup(props, { root }) {
    const users = ref<User[]>([]);
    const loading = ref<boolean>(false);
    const hasMoreUsers = ref<boolean>(true);
    const options = {
      limit: 20,
      offset: 0
    };
    const sortOptions = ref<Partial<QueryOptions>>({
      orderBy: "createdAt",
      order: "desc"
    });

    const loadUsers = async (reset?: boolean) => {
      if (reset) {
        users.value = [];
        options.offset = 0;
        hasMoreUsers.value = true;
      }

      loading.value = true;
      const result = await userService.getAll({
        ...options,
        ...sortOptions.value
      });
      loading.value = false;

      if (!("success" in result)) {
        root.$toasted.error("Error while loading users");
        throw result.message;
      }

      if (result.data.length > 0) {
        users.value.push(...result.data);
        options.offset += options.limit;
      }
      if (result.data.length < options.limit) hasMoreUsers.value = false;
    };
    watch(sortOptions, () => loadUsers(true));

    return {
      users,
      loadUsers,
      loading,
      sortOptions,
      hasMoreUsers
    };
  }
});
</script>

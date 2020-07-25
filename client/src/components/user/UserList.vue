<template>
  <div>
    <list-query-options
      v-if="showListOptions"
      v-model="sortOptions"
      class="text-right my-2"
    />

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
import { defineComponent, ref } from "@vue/composition-api";
import { User, QueryOptions } from "@/types";
import useList from "@/composables/use-list";

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

  setup() {
    const sortOptions = ref<Partial<QueryOptions>>({
      orderBy: "createdAt",
      order: "desc"
    });

    const {
      items: users,
      hasMoreItems: hasMoreUsers,
      loading,
      loadItems: loadUsers
    } = useList<User>(userService.getAll, 20, sortOptions);

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

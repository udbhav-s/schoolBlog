<template>
  <div class=" p-2">
    <div class="flex items-center justify-between mb-2">
      <div
        @click="expanded = !expanded"
        class="text-clr-text-light font-bold flex-grow cursor-pointer select-none"
      >
        <font-awesome-icon icon="bell" />
        Notifications ({{ notifications.length }})
        <font-awesome-icon :icon="expanded ? 'angle-up' : 'angle-down'" />
      </div>

      <button
        v-if="notifications.length > 0 && expanded"
        @click="deleteAllNotifications"
        class="button"
      >
        Clear
      </button>
    </div>

    <div :class="[expanded ? 'h-100' : 'h-0']" class="overflow-hidden">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="text-sm mb-1"
      >
        <div class="flex items-center justify-between">
          <router-link
            @click.native="deleteNotification(notification.id)"
            :to="{ name: 'Post', params: { id: notification.objectId } }"
            class="hover:bg-clr-bg-secondary pr-2"
          >
            <div v-if="notification.action === 'comment'">
              <span class="font-bold">{{ notification.sender.name }}</span>
              commented on your post
            </div>
            <div v-else-if="notification.action === 'reply'">
              <span class="font-bold">{{ notification.sender.name }}</span>
              replied to your comment
            </div>
          </router-link>

          <button @click="deleteNotification(notification.id)" class="button">
            <font-awesome-icon icon="check" />
          </button>
        </div>
      </div>

      <div v-if="notifications.length === 0" class="text-center text-sm">
        No Notifications
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import { notificationStore } from "@/store";
import { notificationService } from "@/services/notificationService";

export default defineComponent({
  name: "Notifications",

  setup(props, { root }) {
    // refresh notifications on setup
    notificationStore.mutations.loadNotifications();

    const notifications = computed(notificationStore.getters.notifications);
    const expanded = ref(false);

    const deleteNotification = async (id: number) => {
      try {
        await notificationService.delete(id);
        notificationStore.mutations.loadNotifications();
      } catch (err) {
        root.$toasted.error("An error occured");
      }
    };

    const deleteAllNotifications = async () => {
      try {
        await notificationService.deleteAll();
        notificationStore.mutations.loadNotifications();
      } catch (err) {
        root.$toasted.error("An error occured");
      }
    };

    return {
      expanded,
      notifications,
      deleteNotification,
      deleteAllNotifications
    };
  }
});
</script>

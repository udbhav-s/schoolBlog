<template>
  <div>
    <div class="post-info">
      <username :user="post.user">
        <span>{{ date }}</span>
        <span class="tag has-text-info" v-if="post.category">
          {{ post.category.name }}
        </span>
        <span v-if="!post.verified">
          Unverified
        </span>
      </username>

      <div class="post-options buttons are-small" v-if="showOptions">
        <router-link
          class="button is-primary"
          v-if="byCurrentUser"
          :to="{
            name: 'EditPost',
            params: {
              id: post.id
            }
          }"
        >
          <font-awesome-icon icon="pencil-alt" />
          <!-- Edit -->
        </router-link>

        <button
          v-if="byCurrentUser || isModOrAbove"
          @click="deletePost"
          class="button is-danger"
        >
          <font-awesome-icon icon="trash" />
          <!-- Delete -->
        </button>

        <template v-if="isModOrAbove">
          <button
            v-if="!post.verified"
            @click="verifyPost"
            class="button is-primary"
          >
            Verify
          </button>
          <button
            v-if="post.verified"
            @click="unverifyPost"
            class="button is-danger"
          >
            Unverify
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Username from "@/components/user/Username.vue";
import { postService } from "@/services";
import { defineComponent, computed } from "@vue/composition-api";
import { Post, User } from "@/types";
import { userStore } from "@/store";

export default defineComponent({
  name: "PostMeta",
  props: {
    post: {
      type: Object as () => Post,
      required: true
    },
    showOptions: {
      type: Boolean as () => boolean
    }
  },
  components: {
    Username
  },

  setup(props, { root, emit }) {
    const currentUser = computed<User>(userStore.getters.user);
    const isModOrAbove = computed<boolean>(userStore.getters.isModOrAbove);
    const byCurrentUser = computed<boolean>(
      () => props.post.userId === currentUser.value.id
    );
    const date = computed<string>(() =>
      new Date(props.post.createdAt).toDateString()
    );

    const deletePost = async () => {
      const result = await postService.delete(props.post.id);
      if ("error" in result) root.$toasted.error(result.message);
      else {
        root.$toasted.success("Post deleted");
        emit("postDeleted");
      }
    };

    const verifyPost = async () => {
      const result = await postService.verify(props.post.id);
      if ("error" in result) root.$toasted.error(result.message);
      else {
        root.$toasted.success("Post verified!");
      }
    };

    const unverifyPost = async () => {
      const result = await postService.unverify(props.post.id);
      if ("error" in result) root.$toasted.error(result.message);
      else {
        root.$toasted.success("Post unverified");
      }
    };

    return {
      date,
      byCurrentUser,
      currentUser,
      isModOrAbove,
      deletePost,
      verifyPost,
      unverifyPost
    };
  }
});
</script>

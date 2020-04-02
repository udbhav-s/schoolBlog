<template>
  <div class="meta">
    <div class="post-user">
      <username :user="post.user"></username>
    </div>

    <div class="post-date">{{ date }}</div>
    <div v-if="!post.verified" class="has-text-danger">Unverified</div>

    <div class="buttons" v-if="showOptions">
      <router-link
      class="button"
        v-if="byCurrentUser"
        :to="{
          name: 'EditPost',
          params: {
            id: post.id,
          }
        }"
      >
        Edit
      </router-link>

      <button v-if="byCurrentUser || isModOrAbove" @click="deletePost" class="button">Delete</button>

      <template v-if="isModOrAbove">
        <button v-if="!post.verified" @click="verifyPost" class="button">Verify</button>
        <button v-if="post.verified" @click="unverifyPost" class="button">Unverify</button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Username from '@/components/Username.vue'
import { postService } from '@/services/dataService.js'

export default {
  name: 'PostMeta',
  props: ['post', 'showOptions'],

  computed: {
    date () {
      return new Date(this.post.createdAt).toDateString()
    },

    byCurrentUser () {
      return (this.post.user.id === this.currentUser.id)
    },

    ...mapGetters(['currentUser', 'isModOrAbove'])
  },

  methods: {
    async deletePost () {
      const result = await postService.delete(this.post.id)
      if (!result.success) this.$toasted.error(result.message)
      this.$toasted.success("Post deleted")
      this.$emit('postDeleted')
    },

    async verifyPost () {
      const result = await postService.verify(this.post.id)
      if (!result.success) this.$toasted.error(result.message)
      else {
        this.post.verified = true
        this.$toasted.success("Post verified!")
      }
    },

    async unverifyPost () {
      const result = await postService.unverify(this.post.id)
      if (!result.success) this.$toasted.error(result.message)
      else {
        this.post.verified = false
        this.$toasted.success("Post unverified")
      }
    }
  },

  components: {
    Username
  }
}
</script>

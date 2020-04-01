<template>
  <div class="meta">
    <div class="post-user">
      <username :user="post.user"></username>
    </div>

    <div class="post-date">{{ date }}</div>
    <div v-if="!post.verified" class="unverified">Unverified</div>

    <div class="buttons">
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

export default {
  name: 'PostMeta',
  props: ['post'],

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
      const result = await postService.delete(this.id)
      if (!result.success) throw result.message
      this.$emit('postDeleted')
    },

    async verifyPost () {
      const result = await postService.verify(this.id)
      if (!result.success) throw result.message
      else this.post.verified = true
    },

    async unverifyPost () {
      const result = await postService.unverify(this.id)
      if (!result.success) throw result.message
      else this.post.verified = false
    }
  },

  components: {
    Username
  }
}
</script>

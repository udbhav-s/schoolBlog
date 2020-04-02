<template>
  <div class="section fixed-column">
    <div v-for="post in posts" :key="post.id">
			<post-card :post="post" />
		</div>

    <div v-if="posts.length == 0">
			<h2>No Posts</h2>
		</div>

    <div class="has-text-centered">
      <button v-if="hasMorePosts" class="button" @click="loadPosts">Load More</button>
    </div>
  </div>
</template>

<script>
import PostCard from '@/components/post/PostCard.vue'
import { postService } from '@/services/dataService.js'

export default {
  name: 'PostList',
  props: ['userId'],

  data () {
    return {
      posts: [],
      limit: 10,
      offset: 0,
      hasMorePosts: true
    }
  },

  mounted () {
    this.loadPosts()
  },

  methods: {
    async loadPosts () {
      let result
      const options = {
        limit: this.limit,
        offset: this.offset
      }

      if (this.userId) result = await postService.getByUser(options)
      else result = await postService.getAll(options)

      if (!result.success) throw result.message
      if (result.data.length > 0) {
        result.data.forEach(post => this.posts.push(post))
      } else this.hasMorePosts = false

      this.offset += this.limit
    }
  },

  components: {
    PostCard
  }
}
</script>

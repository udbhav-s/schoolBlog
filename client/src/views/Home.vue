<template>
	<div>
		<div class="hero is-info is-medium is-bold is-mobile">
			<div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">THE HPS BLOG</h1>
        </div>
			</div>
		</div>
		<post-list />
	</div>
</template>

<script>
import PostList from '@/components/post/PostList.vue'
import { METHODS } from 'http'

export default {
  name: 'Home',
  components: {
    PostList
  }
}

</script>

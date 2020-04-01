<template>
	<div class="container">
		<div class="hero">
			<div class="content">
				<h1>THE HPS BLOG</h1>
			</div>
		</div>
		<post-list />
	</div>
</template>

<script>
import PostList from '@/components/post/PostList.vue'

export default {
  name: 'Home',
  components: {
    PostList
  }
}

</script>

<template>
	<div class="container">
		<div class="hero">
			<div class="content">
				<h1>THE HPS BLOG</h1>
			</div>
		</div>
		<div v-for="post in posts" :key="post.id">
			<post-card :post="post" />
		</div>
		<button v-if="hasMorePosts" class="button" @click="loadPosts">Load More</button>
	</div>
</template>

<script>

import { postService } from '@/services/dataService.js';
import PostCard from '@/components/PostCard.vue';

export default {
	name: 'Home',

	data() {
		return {
			posts: [],
			limit: 10,
			offset: 0,
			hasMorePosts: true,
		}
	},

	mounted() {
		this.loadPosts();
	},

	methods: {
		async loadPosts() {
			let result = (await postService.getAll({
				limit: this.limit,
				offset: this.offset
			})).data;
			if (!result.success) throw result.error;
			if (result.data.length > 0) for (let post of result.data) this.posts.push(post);
			else this.hasMorePosts = false;
			this.offset += this.limit;
		}
	},

	components: {
		PostCard
	}
}

</script>

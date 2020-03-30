<template>
	<div class="user-page">
		<div class="hero">
			<div class="content user-details">
				<h2 class="user-name">{{ user.name }}</h2>
				<div class="user-portal">{{ user.portal_id }}</div>
				<div class="type">{{ user.type }}</div>
				<button v-if="userId === currentUser.id" @click="logout" class="button">Log Out</button>
			</div>
		</div>
		<div v-for="post in posts" :key="post.id">
			<post-card :post="post" />
		</div>
		<div v-if="posts.length == 0">
			<h2>No Posts</h2>
		</div>
	</div>
</template>

<script>

import { postService, userService } from '@/services/dataService.js';
import PostCard from '@/components/PostCard.vue';
import { mapGetters } from 'vuex';
import { LOGOUT } from '@/store/actions.type.js';

export default {
	name: 'User',
	props: ['userId'],

	data() {
		return {
			user: {},
			posts: [],
		}
	},

	computed: {
		...mapGetters(["currentUser"])
	},

	mounted() {
		this.loadUser();
		this.loadPosts();
	},

	methods: {
		async loadUser() {
			let result = (await userService.getById(this.userId)).data;
			if (!result.success) throw result.error;
			else this.user = result.data;
		},

		async loadPosts() {
			let result = (await postService.getByUser(this.userId)).data;
			if (!result.success) throw result.error;
			else this.posts = result.data;
		},

		async logout() {
			await this.$store.dispatch(LOGOUT);
			this.$router.push("/login");
		}
	},

	components: {
		PostCard
	}
}

</script>

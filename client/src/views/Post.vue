<template>
	<div class="post">
		<h1 class="title">{{ post.title }}</h1>
		<div class="meta">
			<div class="post-user">
				<username
					:name="post.user_name"
					:id="post.user_id"
					:level="post.user_level"
				></username>
			</div>
			<div class="post-date">{{ post.date }}</div>
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
				<button v-if="byCurrentUser || isModerator" @click="deletePost" class="button">Delete</button>
				<button v-if="isModerator && !post.verified" @click="verifyPost" class="button">Verify</button>
				<button v-if="isModerator && post.verified" @click="unverifyPost" class="button">Unverify</button>
			</div>
		</div>
		<div v-if="post.thumbnail" class="post-thumbnail-container">
			<img class="post-thumbnail" :src="`/api/file/thumbnail/${post.thumbnail}`">
		</div>
		<div class="body" v-html="post.body"></div>
		<div class="comments">
			<h2 class="comments-head">Comments:</h2>
			<div class="add-comment-conta">
				<comment-edit @commentAdded="commentAdded" :postId="post.id"/>
			</div>
			<comment 
				v-for="comment in comments" 
				:comment="comment" 
				:key="comment.id"
				@commentEdited="commentEdited"
				@commentDeleted="commentDeleted"
			/>
		</div>
	</div>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { postService, commentService } from '@/services/dataService.js';
import Comment from '@/components/Comment.vue';
import CommentEdit from '@/components/CommentEdit.vue';
import Username from '@/components/Username.vue';

export default {
	name: 'Post',
	props: ['id'],

	data() {
		return {
			post: {
				title: "",
				body: "",
				category: "",
				user_id: "",
				verified: false,
				date: ""
			},
			userName: "",
			comments: [],
		}
	},

	computed: {
		byCurrentUser() {
			return (this.post.user_id === this.currentUser.id);
		},

		isModerator() {
			return (this.currentUser.level >= 3)
		},

		...mapGetters(["currentUser"])
	},

	beforeMount() {
		Promise.all([
			this.loadPost(),
			this.loadComments()
		])
		.then(() => {
			// change date string to date
			Vue.set(this.post, "date", new Date(this.post.created_at).toDateString());
		});
	},
	
	methods: {
		async loadPost() {
			// get post
			let result = (await postService.getById(this.id)).data;
			if (!result.success) {
				if (result.error.status === 403) this.$router.push("/");
				else throw error;
			}
			else this.post = result.data;
		},

		async loadComments() {
			// load comments
			let result = (await commentService.getByPost(this.id)).data;
			if (!result.success) throw result.error;
			else this.comments = result.data;
		},

		async deletePost() {
			let result = (await postService.delete(this.id)).data;
			if (!result.success) throw result.error;
			else this.$router.push("/");
		},

		async verifyPost() {
			let result = (await postService.verify(this.id)).data;
			if (!result.success) throw result.error;
			else this.post.verified = true;
		},

		async unverifyPost() {
			let result = (await postService.unverify(this.id)).data;
			if (!result.success) throw result.error;
			else this.post.verified = false;
		},

		commentAdded(comment) {
			this.comments.push(comment);
		},

		commentEdited(comment) {
			let index = this.comments.findIndex(c => c.id === comment.id);
			Vue.set(this.comments, index, comment);
		},

		commentDeleted(comment) {
			this.comments = this.comments.filter(c => c.id !== comment.id);
		}
	},

	components: {
		Comment,
		CommentEdit,
		Username
	}
}

</script>

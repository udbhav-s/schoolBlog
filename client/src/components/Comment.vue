<template>
	<div class="comment">
		<div class="comment-content">
			<div v-if="!editComment">
				<p>{{ comment.body }}</p>
				<div class="comment-meta">
					<username
						:name="comment.user.name"
						:id="comment.user.id"
						:level="comment.user.level"
					></username>
					<button class="button small" v-if="!addReply" @click="addReply = true">Reply</button>
					<template v-if="byCurrentUser">
						<button class="button small" @click="editComment = true">Edit</button>
						<button class="button small" v-if="!addReply" @click="deleteComment">Delete</button>
					</template>
					<button class="button small" v-if="addReply" @click="addReply = false">Cancel</button>
				</div>
			</div>

			<div v-if="editComment">
				<comment-edit @commentEdited="commentEdited" :comment="comment" :editMode="true" :editId="comment.id" :postId="comment.postId" />
				<button class="button small" @click="editComment = false">Cancel</button>
			</div>
		</div>

		<div v-if="addReply">
			<reply-edit @replyAdded="replyAdded" :commentId="comment.id"/>
		</div>

		<!-- replies -->
		<div v-for="reply in replies" :key="reply.id">
			<reply @replyEdited="replyEdited" @replyDeleted="replyDeleted" :reply="reply" />
		</div>
	</div>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { replyService, commentService } from '@/services/dataService.js';
import Reply from '@/components/Reply.vue';
import ReplyEdit from '@/components/ReplyEdit.vue';
import CommentEdit from '@/components/CommentEdit.vue';
import Username from '@/components/Username.vue';

export default {
	name: 'Comment',
	props: ['comment'],

	data() {
		return {
			replies: [],
			addReply: false,
			editComment: false,
		}
	},

	computed: {
		byCurrentUser() {
			return (this.comment.userId === this.currentUser.id);
		},

		...mapGetters(["currentUser"])
	},

	mounted() {
		this.loadReplies();
	},

	methods: {
		async loadReplies() {
			// get replies 
			let result = (await replyService.getByComment(this.comment.id)).data;
			if (!result.success) throw result.message;
			else this.replies = result.data;
		},

		replyAdded(reply) {
			console.log("reply received");
			this.addReply = false;
			this.replies.push(reply);
		},

		commentEdited(comment) {
			this.editComment = false;
			// emit event to change comment data from parent since it's a prop
			this.$emit("commentEdited", comment);
		},

		async deleteComment() {
            // delete the reply
            let result = (await commentService.delete(this.comment.id)).data;
            if (!result.success) throw result.error;
            else {
                this.$emit("commentDeleted", result.data);
            }
        },

		replyEdited(reply) {
			let index = this.replies.findIndex(r => r.id === reply.id);
			Vue.set(this.replies, index, reply);
		},

		replyDeleted(reply) {
			this.replies = this.replies.filter(r => r.id !== reply.id);
		}
	},

	components: {
		Reply,
		ReplyEdit,
		CommentEdit,
		Username
	}
}

</script>

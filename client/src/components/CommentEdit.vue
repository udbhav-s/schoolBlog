<template>
	<div class="comment-edit">
		<textarea placeholder="Write a comment" class="input-area" v-model="form.body"></textarea>
		<button class="button" @click="submitComment">Submit</button>
	</div>
</template>

<script>

import { commentService } from '@/services/dataService.js';

export default {
	name: 'CommentEdit',
	props: ['editMode', 'editId', 'postId'],

	data() {
		return {
			form: {
				body: '',
				post_id: null,
			}
		}
	},

	mounted() {
		if (this.editMode) this.setComment(this.editId);
	},

	methods: {

		async setComment(id) {
			// get comment 
			let result = (await commentService.getById(id)).data;
			if (!result.success) throw result.error;
			else this.form.body = result.data.body;
		},

		async submitComment() {
			// set postId prop to form data
			this.form.post_id = this.postId;
			// post comment 
			let result;
			if (this.editMode) {
				result = (await commentService.update(this.editId, this.form)).data;
			}
			else {
				result = (await commentService.create(this.form)).data;
			}
			if (!result.success) throw result.error;
			else {
				// clear input
				this.form.body = '';
				// emit event
				if (this.editMode) this.$emit("commentEdited", result.data);
				else this.$emit("commentAdded", result.data);
			}
		}

	},
}

</script>

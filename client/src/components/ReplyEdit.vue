<template>
	<div class="reply-edit">
		<textarea placeholder="Reply" v-model="form.body"></textarea>
		<button class="button small" @click="submitReply">Submit</button>
	</div>
</template>

<script>

import { replyService } from '@/services/dataService.js';

export default {
	name: 'ReplyEdit',
	props: ['editMode', 'editId', 'commentId'],

	data() {
		return {
			form: {
				body: '',
				commentId: null,
			}
		}
	},

	mounted() {
		if (this.editMode) this.setReply(this.editId);
	},

	methods: {

		async setReply(id) {
			// get reply 
			let result = (await replyService.getById(id)).data;
			if (!result.success) throw result.message;
			else this.form.body = result.data.body;
		},

		async submitReply() {
			// set postId prop to form data
			this.form.commentId = this.commentId;
			// post comment 
			let result;
			if (this.editMode) {
				result = (await replyService.update(this.editId, this.form)).data;
			}
			else {
				result = (await replyService.create(this.form)).data;
			}
			if (!result.success) throw result.error;
			else {
				console.log(result.data);
				// clear input
				this.form.body = '';
				// emit event
        if (this.editMode) this.$emit("replyEdited", result.data);
        else this.$emit("replyAdded", result.data);
				console.log("success reply added");
			}
		}

	},
}

</script>

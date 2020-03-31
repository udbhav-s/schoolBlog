<template>
    <div class="reply">
        <div v-if="!editReply">
            <p>{{ reply.body }}</p>
			<div class="comment-meta">
				<username
					:name="reply.user.name"
					:id="reply.user.id"
					:level="reply.user.level"
				></username>
				<button class="button small" @click="editReply = true">Edit</button>
				<button class="button small" @click="deleteReply">Delete</button>
			</div>
        </div>
        <div v-if="editReply">
            <reply-edit 
                @replyEdited="replyEdited"
                :editMode="true"
                :editId="reply.id"
                :commentId="reply.commentId"
            />
            <button class="button small" @click="editReply = false">Cancel</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReplyEdit from './ReplyEdit.vue'
import { replyService } from '@/services/dataService.js';
import Username from '@/components/Username.vue';

export default {
    name: 'Reply',
    props: ['reply'],

    data() {
        return {
            editReply: false,
        }
	},
	
	computed: {
		byCurrentUser() {
			return (this.reply.userId === this.currentUser.id);
		},

		...mapGetters(["currentUser"])
	},

    methods: {
        replyEdited(reply) {
            this.editReply = false;
            this.$emit("replyEdited", reply)
        },

        async deleteReply() {
            // delete the reply
            let result = (await replyService.delete(this.reply.id)).data;
            if (!result.success) throw result.error;
            else {
                this.$emit("replyDeleted", result.data);
            }
        }
    },
    
    components: {
		ReplyEdit,
		Username
    }
}
</script>
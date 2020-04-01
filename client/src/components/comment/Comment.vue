<template>
	<div class="comment">
		<div class="comment-content">
			<div v-if="!editComment">
				<p>{{ comment.body }}</p>
				<div class="comment-meta">
					<username :user="comment.user"></username>

					<template v-if="!addReply">
            <button class="button small" @click="addReply = true">Reply</button>
						<button class="button small" v-if="byCurrentUser" @click="editComment = true">Edit</button>
						<button class="button small" v-if="isModOrAbove" @click="deleteComment">Delete</button>
					</template>

					<button class="button small" v-if="addReply" @click="addReply = false">Cancel</button>
				</div>
			</div>

			<div v-if="editComment">
				<comment-edit @commentEdited="commentEdited" :comment="comment" :editMode="true" :editId="comment.id" :postId="comment.postId" />
				<button class="button small" @click="editComment = false">Cancel</button>
			</div>
		</div>

    <reply-list v-if="comment.id" :commentId="comment.id" :showAddReply="addReply" @replyAdded="addReply = false" />
	</div>
</template>

<script>

import Vue from 'vue'
import { mapGetters } from 'vuex'
import { replyService, commentService } from '@/services/dataService.js'
import ReplyList from '@/components/reply/ReplyList.vue'
import CommentEdit from '@/components/comment/CommentEdit.vue'
import Username from '@/components/Username.vue'

export default {
  name: 'Comment',
  props: ['comment'],

  data () {
    return {
      addReply: false,
      editComment: false
    }
  },

  computed: {
    byCurrentUser () {
      return (this.comment.userId === this.currentUser.id)
    },

    ...mapGetters(['currentUser', 'isModOrAbove'])
  },

  methods: {
    commentEdited (comment) {
      this.editComment = false
      // emit event to change comment data from parent since it's a prop
      this.$emit('commentEdited', comment)
    },

    async deleteComment () {
      // delete the comment
      const result = await commentService.delete(this.comment.id)
      if (!result.success) {
        this.$toasted.error("Error while deleting comment")
        throw result.error
      }
      else {
        this.$toasted.success("Comment deleted")
        this.$emit('commentDeleted', result.data)
      }
    }
  },

  components: {
    ReplyList,
    CommentEdit,
    Username
  }
}

</script>

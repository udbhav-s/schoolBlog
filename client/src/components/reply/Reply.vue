<template>
    <div class="media reply">
        <div class="media-content">
          <div class="content">
            <username
              :user="reply.user"
            ></username>

            <div v-if="!editReply">{{ reply.body }}</div>
            <div v-else>
              <reply-edit
                  @replyEdited="replyEdited"
                  :editMode="true"
                  :editId="reply.id"
                  :commentId="reply.commentId"
              />
            </div>

            <small>
              <a v-if="!editReply" @click="editReply = true">Edit</a>
              <a v-else @click="editReply = false">Cancel</a>
              <a @click="deleteReply">Delete</a>
            </small>
          </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReplyEdit from '@/components/reply/ReplyEdit.vue'
import { replyService } from '@/services/dataService.js'
import Username from '@/components/Username.vue'

export default {
  name: 'Reply',
  props: ['reply'],

  data () {
    return {
      editReply: false
    }
  },

  computed: {
    byCurrentUser () {
      return (this.reply.user.id === this.currentUser.id)
    },

    ...mapGetters(['currentUser'])
  },

  methods: {
    replyEdited (reply) {
      this.editReply = false
      this.$emit('replyEdited', reply)
    },

    async deleteReply () {
      // delete the reply
      const result = await replyService.delete(this.reply.id)
      if (!result.success) {
        this.$toasted.error("Error deleting reply")
        throw result
      }
      else {
        this.$toasted.success("Reply deleted")
        this.$emit('replyDeleted', result.data)
      }
    }
  },

  components: {
    ReplyEdit,
    Username
  }
}
</script>

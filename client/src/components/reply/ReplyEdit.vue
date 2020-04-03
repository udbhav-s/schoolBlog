<template>
  <div class="field">
    <div class="control">
      <textarea placeholder="Write a reply" class="textarea" v-model="form.body"></textarea>
    </div>
    <div class="control has-text-centered">
      <button class="button is-primary is-outlined is-small" @click="submitReply">Submit</button>
    </div>
	</div>
</template>

<script>

import { replyService } from '@/services/dataService.js'

export default {
  name: 'ReplyEdit',
  props: ['editMode', 'editId', 'commentId'],

  data () {
    return {
      form: {
        body: '',
        commentId: null
      }
    }
  },

  mounted () {
    if (this.editMode) this.setReply(this.editId)
  },

  methods: {

    async setReply (id) {
      // get reply
      const result = await replyService.getById(id)
      if (!result.success) {
        this.$toasted.error("Couldn't get reply data")
        throw result.message
      }
      else this.form.body = result.data.body
    },

    async submitReply () {
      // set postId prop to form data
      this.form.commentId = this.commentId
      // post comment
      let result
      if (this.editMode) {
        result = await replyService.update(this.editId, this.form)
      } else {
        result = await replyService.create(this.form)
      }
      if (!result.success) {
        this.$toasted.error("Error while submitting reply")
        throw result.error
      }
      else {
        // clear input
        this.form.body = ''
        // emit event
        if (this.editMode) this.$emit('replyEdited', result.data)
        else this.$emit('replyAdded', result.data)
      }
    }

  }
}

</script>

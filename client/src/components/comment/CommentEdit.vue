<template>
	<div class="comment-edit">
		<textarea placeholder="Write a comment" class="input-area" v-model="form.body"></textarea>
		<button class="button" @click="submitComment">Submit</button>
	</div>
</template>

<script>

import { commentService } from '@/services/dataService.js'
import Vue from 'vue'

export default {
  name: 'CommentEdit',
  props: ['editMode', 'editId', 'postId'],

  data () {
    return {
      form: {
        body: '',
        postId: null
      }
    }
  },

  mounted () {
    if (this.editMode) this.setComment(this.editId)
  },

  methods: {

    async setComment (id) {
      // get comment
      const result = await commentService.getById(id)
      if (!result.success) {
        this.$toasted.error("Error while getting comment data")
        throw result.message
      }
      else this.form.body = result.data.body
    },

    async submitComment () {
      // set postId prop to form data
      Vue.set(this.form, 'postId', this.postId)
      // post comment
      let result
      if (this.editMode) {
        result = await commentService.update(this.editId, this.form)
      } else {
        result = await commentService.create(this.form)
      }
      if (!result.success) {
        this.$toasted.error(result.message)
        throw result
      }
      else {
        // clear input
        this.form.body = ''
        // emit event
        if (this.editMode) this.$emit('commentEdited', result.data)
        else this.$emit('commentAdded', result.data)
      }
    }

  }
}

</script>

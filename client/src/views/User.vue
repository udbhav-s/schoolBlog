<template>
	<div class="user-page">
		<div class="hero">
			<div class="content user-details">
				<h2 class="user-name">{{ user.name }}</h2>
				<div class="user-portal">{{ user.portal_id }}</div>
				<div class="type">{{ user.type }}</div>

        <template v-if="isAdminOrAbove && !isCurrentUser">
          <select name="level-select" id="level-select" v-model="user.level">
            <option value="0">Reader</option>
            <option value="1">Member</option>
            <option value="2">Author</option>
            <option value="3">Moderator</option>
            <option value="4">Admin</option>
          </select>

          <div class="levels-description" v-html="levelDescriptions[user.level]"></div>
          <button class="button" @click="setUserLevel">Set Level</button>
        </template>

				<button v-if="isCurrentUser" @click="logout" class="button">Log Out</button>
			</div>
		</div>

	</div>
</template>

<script>

import { userService } from '@/services/dataService.js'
import { mapGetters } from 'vuex'
import { LOGOUT } from '@/store/actions.type.js'
import PostList from '@/components/post/PostList.vue'

export default {
  name: 'User',
  props: ['userId'],

  data () {
    return {
      user: {},
      levelDescriptions: [
        // Reader 
        `
        Can see verified posts and comments. <br>
        Cannot submit posts and comments.
        `, 
        // Member
        `
        Can see verified posts and comments. <br>
        Can submit posts for verification. <br>
        Can submit comments on verified posts.
        `,
        // Author
        `
        Can see verified posts and comments. <br>
        Submitted are automatically verified. <br>
        Can submit comments on verified posts.
        `,
        // Moderator
        `
        Can see all posts and comments. <br>
        Submitted posts are automatically verified. <br>
        Can delete any post or comment.
        `,
        // Admin
        `
        All the permissions of moderator. <br>
        Can change the permission level of other user. <br>
        (Such as setting new moderators or authors, or demoting them).
        `
      ]
    }
  },

  computed: {
    isCurrentUser() {
      return this.user.id === this.currentUser.id
    },

    ...mapGetters(['currentUser', 'isAdminOrAbove'])
  },

  mounted () {
    this.loadUser()
  },

  methods: {
    async loadUser () {
      const result = await userService.getById(this.userId)
      if (!result.success) throw result.error
      else this.user = result.data
    },

    async logout () {
      await this.$store.dispatch(LOGOUT)
      this.$router.push('/login')
    },

    async setUserLevel () {
      const result = await userService.setLevel(this.user.id, this.user.level)
      if (!result.success) throw result.error
      else this.user = result.data
    }
  },

  components: {
    PostList
  }
}

</script>

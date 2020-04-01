<template>
	<div class="user-page">
		<div class="hero">
			<div class="content user-details">
				<h2 class="user-name">{{ user.name }}</h2>
				<div class="user-portal">{{ user.portal_id }}</div>
				<div class="type">{{ user.type }}</div>
				<button v-if="userId === currentUser.id" @click="logout" class="button">Log Out</button>
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
      user: {}
    }
  },

  computed: {
    ...mapGetters(['currentUser'])
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
    }
  },

  components: {
    PostList
  }
}

</script>

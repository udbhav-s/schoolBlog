<template>
	<header class="navbar is-fixed-top">
		<div class="navbar-brand">
			<router-link class="navbar-item" to="/" @click.native="isActive = false">
				HOME
			</router-link>
      <span class="navbar-burger" @click="isActive = !isActive" :class="{'is-active': isActive}">
        <span></span>
        <span></span>
        <span></span>
      </span>
		</div>

		<div class="navbar-menu" id="header-right" :class="{'is-active': isActive}">
      <div class="navbar-end has-text-centered">
        <router-link class="navbar-item" to="/about" @click.native="isActive = false">
          About
        </router-link>

        <router-link class="navbar-item" :to="{ name: 'CurrentUser' }" @click.native="isActive = false">
          Profile
        </router-link>

        <template v-if="currentUser.level >= 1">
          <router-link class="navbar-item" to="/post/create" @click.native="isActive = false">New Post</router-link>
        </template>
      </div>
		</div>
	</header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters(['currentUser'])
  },
  data () {
    return {
      isActive: false
    }
  }
}
</script>

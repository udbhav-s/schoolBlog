<template>
	<header>
		<div class="header-left">
			<router-link class="header-item" to="/" @click.native="isActive = false">
				HOME
			</router-link>
			<div id="navigation-button" class="header-item" @click="isActive = !isActive">X</div>
		</div>

		<div class="header-right" id="header-right" :class="{active: isActive}">
			<router-link class="header-item" to="/about" @click.native="isActive = false">
        About
      </router-link>

			<router-link class="header-item" :to="{ name: 'CurrentUser' }" @click.native="isActive = false">
        Profile
      </router-link>

			<template v-if="currentUser.level >= 1">
				<router-link class="header-item" to="/post/create" @click.native="isActive = false">New Post</router-link>
			</template>
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

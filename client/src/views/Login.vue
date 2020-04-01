<template>
	<section class="hero">
		<div class="content">
			<h1 class="title">Log in</h1>
			<div>
				<input type="text" name="username" v-model="form.username" placeholder="Username"> <br>
			</div>
			<div>
				<input type="password" name="password" v-model="form.password" placeholder="Password"> <br>
			</div>
			<div>
				<button @click="login" class="button">Submit</button> <br>
			</div>
		</div>
	</section>
</template>

<script>
import authService from '@/services/authService'
import { LOGIN } from '@/store/actions.type.js'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
    }
  },
  methods: {
    login () {
      // dispatch request to store
      this.$store.dispatch(LOGIN, this.form)
        .then(() => this.$router.push('/'))
        .catch(err => {
          this.$toasted.error("Couldn't log in")
        })
    }
  }
}

</script>

<style scoped>

</style>

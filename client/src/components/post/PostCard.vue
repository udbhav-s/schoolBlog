<template>
	<div>
		<router-link
		:to="{
			name: 'Post',
			params: {
				id: post.id
			}
		}">
		<div class="post-card">
			<div class="thumbnail-container" v-if="post.thumbnail" >
				<img class="thumbnail" :src="`/api/file/thumbnail/${post.thumbnail}`">
			</div>
			<div class="text-container">
				<div class="text">
					<h3 class="title">{{ post.title }}</h3>
					<div class="info">
						<span class="user">By {{ post.user.name }}</span>
						<span class="date">{{ postDate }}</span>
						<span v-if="!post.verified" class="unverified">Unverified</span>
					</div>
				</div>
			</div>
		</div>
		</router-link>
	</div>
</template>

<script>
export default {
  name: 'PostCard',
  props: ['post'],
  data () {
    return {
      postDate: new Date(this.post.createdAt).toDateString()
    }
  }
}
</script>

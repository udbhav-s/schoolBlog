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
						<span class="user">By {{ post.user_name }}</span>
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
	data() {
		return {
			postDate: new Date(this.post.created_at).toDateString(),
		}
	}
}
</script>

<style scoped>
/* .card-container {
	margin-bottom: 5rem;
}

.card {
	display: flex;
	flex-direction: row;
	width: 100%;
	min-height: 10rem;
	justify-content: space-between;
	transition-property: box-shadow;
	transition-duration: 0.2s;
	flex-wrap: nowrap;
	border: 0.5px solid;
	border-color:rgba(0, 0, 0, 0.19);
}

.card:hover {
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.card .thumbnail-container {
	height: 100%;
	display: inline-block;
	width: 40%;
	padding: 0;
	margin-left: auto;
	margin-right: auto;
}

.card .thumbnail {
	/* max-width: 40rem;
	max-height: 20rem;
	min-height: 10rem; 
	width: 100%;
	height: auto;
	margin: 0;
	padding: 0;
}

.text-container {
	display: flex;
	margin-left: auto;
	margin-right: auto;
}

.text-container .text {
	margin: auto;
}

.text .title {
	max-width: 80%;
	margin: auto;
}

.text .user {
	margin-top: 0.5rem;
	margin-right: 1rem;
	text-align: right;
	font-size: 1.4rem;
	color: grey;
} */

/* @media (max-width: 700px) {
  .card {
    flex-direction: column;
	align-items: center;
  }
} */
</style>
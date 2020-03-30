<template>
	<div class="user">
		<router-link
			:to="{ 
				name: 'User', 
				params: { id }
			}"
		>
			{{ name }}
			<span v-if="level == 3" class="mod">[M]</span>
			<span v-if="level == 4" class="admin">[A]</span>
		</router-link>
	</div>
</template>

<script>
export default {
	name: 'Username',
	props: ['name', 'level', 'id']
}
</script>
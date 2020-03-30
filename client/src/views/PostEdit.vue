<template>
	<div clas="post-edit-container">
		<div class="hero">
			<div class="content">
				<h2>Create Post</h2>
			</div>
		</div>

		<div class="post-edit">
			<input type="text" name="title" v-model="form.title" placeholder="Title"/>

			<div class="thumbnail-upload">
				<label class="button">
					<input class="button" type="file" @change="setThumbnail" name="thumbnail" ref="thumbnail" accept=".png, .jpg, .jpeg, .gif">
					Upload Thumbnail
					<span v-if="editMode">(leave empty to keep old thumbnail)</span>
				</label>
				<img v-if="form.thumbnail" class="thumbnail-preview" :src="form.thumbnail"/>
			</div>

			<div class="editor">
				<div ref="editor"></div>
			</div>
			<button class="button" @click="submitPost">Submit</button>
		</div>
	</div>
</template>

<script>

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { postService } from '@/services/dataService.js';

export default {
	name: 'PostEdit',
	props: ['editMode', 'editId'],

	data() {
		return {
			editor: null,
			form: {
				title: '',
				thumbnail: '',
				body: '',
			}
		}
	},

	mounted() {
		this.createEditor();
		if (this.editMode) this.setPost(this.editId);
	},

	methods: {

		async submitPost() {
			try {
				// set contents of body from editor
				this.form.body = this.editor.root.innerHTML;
				let result;
				// post the form
				if (this.editMode) {
					result = (await postService.update(this.editId, this.form)).data;
				}
				else {
					result = (await postService.create(this.form)).data;
				}
				if (!result.success) throw result.error;
				else this.$router.push(`/post/${result.data.id}`);
			}
			catch (err) {
				console.log(err);
			}
		},

		async setPost(id) {
			try {
				// get post from server 
				let result = (await postService.getById(id)).data;
				if (!result.success) throw result.error;
				// set form data to post
				this.form.title = result.data.title;
				this.editor.root.innerHTML = result.data.body;
			}
			catch (err) {
				console.log(err);
			}
		},

		createEditor() {
			this.editor = new Quill(this.$refs.editor, 
			{
				modules: {
					toolbar: [
						[{ header: [2, 3, 4, 5, 6, false] }],
						['bold', 'italic', 'underline'],
						['blockquote', 'code-block'],
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						['link', 'image'],
					]
				},
				theme: 'snow',
				formats: ['bold', 'underline', 'header', 'italic', 'blockquote', 'code-block', 'list', 'link', 'image']
			});
		},

		fileToBase64(file) {
			return new Promise((resolve, reject) => {
			    const reader = new FileReader();
			    reader.readAsDataURL(file);
			    reader.onload = () => resolve(reader.result);
			    reader.onerror = error => reject(error);
			});
		},

		async setThumbnail() {
			// set thumbnail data from file
			if (this.$refs.thumbnail.files.length > 0) {
				this.form.thumbnail = await this.fileToBase64(this.$refs.thumbnail.files[0]);
			}
		}

	}
}

</script>

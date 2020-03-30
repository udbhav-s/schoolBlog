import api from '@/services/apiService.js';
import router from '@/router';
import store from '@/store';
import { UNSET_USER } from '@/store/mutations.type.js';

// if the server logged a user out / restarted but the user object persists in the store
// this will catch the AuthenticationError
api.interceptors.response.use(
	res => {
		if (res.data.loginRedirect) {
			// reset the user object in store
			store.commit(UNSET_USER);
			// redirect to login
			router.push("/login").catch(console.log);
		}
		return res;
	}
);

export const postService = {
	getById: (id) => api.get(`/post/${id}`),
	getAll: (data) => api.get('/post/all', { params: data }),
	getByUser: (id) => api.get(`/post/user/${id}`),

	create: (data) => api.post('/post/create', data),
	update: (id, data) => api.post(`/post/update/${id}`, data),
	delete: (id) => api.delete(`/post/${id}`),

	verify: (id) => api.post(`/post/verify/${id}`),
	unverify: (id) => api.post(`/post/unverify/${id}`),
};

export const commentService = {
	getById: (id) => api.get(`/comment/${id}`),
	getByUser: (id) => api.get(`/comment/user/${id}`),
	getByPost: (id) => api.get(`/comment/post/${id}`),

	create: (data) => api.post('/comment/create', data),
	update: (id, data) => api.post(`/comment/update/${id}`, data),
	delete: (id) => api.delete(`/comment/${id}`),
}

export const replyService = {
	getById: (id) => api.get(`/reply/${id}`),
	getByUser: (id) => api.get(`/reply/user/${id}`),
	getByComment: (id) => api.get(`/reply/comment/${id}`),

	create: (data) => api.post('/reply/create', data),
	update: (id, data) => api.post(`/reply/update/${id}`, data),
	delete: (id) => api.delete(`/reply/${id}`),
}

export const userService = {
	getCurrent: () => api.get('/user/current'),
	getById: (id) => api.get(`/user/${id}`)
}
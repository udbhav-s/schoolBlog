import api from '@/services/apiService';

export default {
	login(credentials) {
		return api.post('/user/login', credentials, {
			withCredentials: true
		});
	},
	logout() {
		return api.get('/user/logout', {
			withCredentials: true,
		});
	}
}
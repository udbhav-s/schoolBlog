import api from "@/services/apiService.js";
import router from "@/router";
import store from "@/store";
import { UNSET_USER } from "@/store/mutations.type.js";
import app from "../main";

// start the progress bar
api.interceptors.request.use(config => {
  app.$Progress.start();
  return config;
});

// if the server logged a user out / restarted but the user object persists in the store
// this will catch the Unauthorized Error
api.interceptors.response.use(
  // on success
  res => {
    app.$Progress.finish();
    // return the data
    return res.data;
  },
  // on error
  res => {
    console.log({ ...res });
    if (res.response.status === 401) {
      // reset the user object in store
      store.commit(UNSET_USER);
      // redirect to login
      router.push("/login").catch(console.log);
      app.$Progress.finish();
    } else {
      app.$Progress.fail();
      app.$toasted.error("There was an error loading data");
    }
    return res;
  }
);

export const postService = {
  getById: id => api.get(`/post/${id}`),
  getEditMode: id => api.get(`/post/edit/${id}`),
  getAll: options => api.get("/post/all", { params: options }),
  getByUser: (id, options) => api.get(`/post/user/${id}`, { params: options }),

  create: data => api.post("/post/create", data),
  update: (id, data) => api.post(`/post/update/${id}`, data),
  delete: id => api.delete(`/post/${id}`),

  verify: id => api.post(`/post/verify/${id}`),
  unverify: id => api.post(`/post/unverify/${id}`)
};

export const commentService = {
  getById: id => api.get(`/comment/${id}`),
  getByUser: id => api.get(`/comment/user/${id}`),
  getByPost: id => api.get(`/comment/post/${id}`),

  create: data => api.post("/comment/create", data),
  update: (id, data) => api.post(`/comment/update/${id}`, data),
  delete: id => api.delete(`/comment/${id}`)
};

export const replyService = {
  getById: id => api.get(`/reply/${id}`),
  getByUser: id => api.get(`/reply/user/${id}`),
  getByComment: id => api.get(`/reply/comment/${id}`),

  create: data => api.post("/reply/create", data),
  update: (id, data) => api.post(`/reply/update/${id}`, data),
  delete: id => api.delete(`/reply/${id}`)
};

export const userService = {
  getCurrent: () => api.get("/user/current"),
  getById: id => api.get(`/user/${id}`),
  setLevel: (id, level) => api.post(`/user/level/${id}`, { level })
};

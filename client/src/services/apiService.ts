import axios from "axios";
import app from "@/main";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

api.interceptors.request.use(config => {
  app.$Progress.start();
  return config;
});

api.interceptors.response.use(
  res => {
    app.$Progress.finish();
    return res.data;
  },
  // error
  res => {
    app.$Progress.fail();
    console.log({ ...res });
    // redirect to server auth route if 401
    if (res.response.status === 401) {
      window.location.replace("/api/user/oauth/google")
    }
    if (res.response.data?.message instanceof Array) {
      res.response.data.message = res.response.data.message.join(", ");
    }
    return res.response.data;
  }
);

export default api;

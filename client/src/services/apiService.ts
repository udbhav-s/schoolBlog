import axios from "axios";
import app from "@/main";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

api.interceptors.request.use(config => {
  // app.$Progress.start();
  return config;
});

api.interceptors.response.use(
  res => {
    if (!("success" in res.data)) {
      // app.$Progress.fail();
      throw new Error(res.data.message);
    }
    // app.$Progress.finish();
    return res.data.data;
  },
  // error
  res => {
    // app.$Progress.fail();
    console.log({ ...res });
    // offline
    if (res.response === undefined) {
      app.$toasted.error("No connection");
      throw new Error("Offline");
    }
    else if (res.response.status === 502) {
      app.$toasted.error("Could not connect to server");
      throw new Error();
    }
    // redirect to server auth route if 401
    else if (res.response.status === 401) {
      app.$router.push({ name: "Login" });
      throw new Error();
    }
    // pass any other errors along
    else if (res.response.data?.message instanceof Array) {
      res.response.data.message = res.response.data.message.join(", ");
    }
    throw res.response.data;
  }
);

export default api;

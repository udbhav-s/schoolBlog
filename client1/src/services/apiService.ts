import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

api.interceptors.response.use(
  res => res.data,
  // error
  res => {
    console.log({ ...res });
    if (res.response.data?.message instanceof Array) {
      res.response.data.message = res.response.data.message.join(", ");
    }
    return res.response.data;
  }
);

export default api;

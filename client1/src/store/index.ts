import Vue from "vue";
import { userService } from "@/services";
import { User, Credentials } from "@/types";

const store = Vue.observable({
  user: {} as User
});

export const userStore = {
  getters: {
    user: () => store.user,
    isAuthenticated: () => !!(store.user && store.user.id),
    isModOrAbove: () => store.user.level >= 3,
    isMemberOrAbove: () => store.user.level >= 1,
    isAdminOrAbove: () => store.user.level >= 4
  },

  mutations: {
    setUser(user: User) {
      store.user = user;
    },

    async login(credentials: Credentials) {
      // send login request
      const result = await userService.login({
        username: credentials.username.trim(),
        password: credentials.password.trim()
      });
      if (!("success" in result)) throw result;

      // send request for user details
      const currentUser = await userService.getCurrent();
      if (!("success" in currentUser)) throw currentUser;

      // commit user to state
      this.setUser(currentUser.data);
    },

    async logout() {
      const result = await userService.logout();
      if (!result.success) throw result;
      store.user = {} as User;
    }
  }
};

export default {
  store,
  userStore
};

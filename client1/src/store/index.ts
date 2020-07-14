import Vue from "vue";
import { userService } from "@/services";
import { User } from "@/types";

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

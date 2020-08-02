import Vue from "vue";
import { userService, categoryService } from "@/services";
import { User, Category } from "@/types";

export const store = Vue.observable({
  user: {} as User,
  categories: [] as Category[],
  darkMode: localStorage.getItem("theme") === "dark"
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
      await userService.logout();
      store.user = {} as User;
    }
  }
};

export const categoryStore = {
  getters: {
    categories: () => store.categories
  },

  mutations: {
    loadCategories: async () => {
      const result = await categoryService.getAll();
      store.categories = result;
    }
  }
}

export const themeStore = {
  getters: {
    darkMode: () => store.darkMode
  },

  mutations: {
    loadTheme: () => {
      store.darkMode = localStorage.getItem("theme") === "dark";
      if (store.darkMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
  
    toggleDarkMode: function() {
      localStorage.setItem("theme", store.darkMode ? "light" : "dark");
      this.loadTheme();
    }
  }
}

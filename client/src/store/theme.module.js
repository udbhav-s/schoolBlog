import { SET_THEME } from "./mutations.type";

const state = {
  theme: localStorage.getItem("theme")
};

const getters = {
  theme(state) {
    return state.theme;
  }
};

const mutations = {
  [SET_THEME](state, theme) {
    state.theme = theme;
    localStorage.setItem("theme", theme);
  }
};

export default {
  state,
  getters,
  mutations
};

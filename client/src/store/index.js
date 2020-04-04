import Vue from "vue";
import Vuex from "vuex";

import user from "./user.module.js";
import theme from "./theme.module.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    theme
  }
});

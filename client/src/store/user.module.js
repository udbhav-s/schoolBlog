import { userService } from "@/services/dataService.js";
import authService from "@/services/authService.js";
import { LOGIN, LOGOUT, CHECK_AUTH } from "./actions.type.js";
import { SET_USER, UNSET_USER } from "./mutations.type.js";

const state = {
  user: {}
};

const getters = {
  currentUser(state) {
    return state.user;
  },

  isModOrAbove(state) {
    return state.user.level >= 3;
  },

  isMemberOrAbove(state) {
    return state.user.level >= 1;
  },

  isAdminOrAbove(state) {
    return state.user.level >= 4;
  }
};

const actions = {
  async [LOGIN](context, credentials) {
    // send login request
    let result = await authService.login({
      username: credentials.username.trim(),
      password: credentials.password.trim()
    });
    if (!result.success) throw result.error;
    // send request for user details
    result = await userService.getCurrent();
    if (!result.success) throw result.error;
    // commit user to state
    const user = result.data;
    context.commit(SET_USER, user);
  },

  async [LOGOUT](context) {
    const result = await authService.logout();
    if (!result.success) throw result.error;
    // unset user
    context.commit(UNSET_USER);
  },

  // since the state is reset on refresh,
  // the user may still be logged in but state.user would be empty
  // so if state.user is not set send a request for current user to check auth
  async [CHECK_AUTH](context) {
    if (context.state.user && context.state.user.id) {
      return true;
    }
    // if state.user is not set
    const result = await userService.getCurrent();
    if (!result.success) {
      if (result.loginRedirect) return false;
      else {
        throw result.error;
      }
    }
    // if user was logged in
    else {
      const user = result.data;
      context.commit(SET_USER, user);
      return true;
    }
  }
};

const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  },

  [UNSET_USER](state) {
    state.user = {};
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};

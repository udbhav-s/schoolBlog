import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

import store from "@/store";
import { CHECK_AUTH } from "@/store/actions.type.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    alias: "/home"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue")
  },
  {
    path: "/post/edit/:id",
    name: "EditPost",
    component: () => import("@/views/PostEdit.vue"),
    props: route => ({
      editMode: true,
      editId: route.params.id
    })
  },
  {
    path: "/post/create",
    name: "CreatePost",
    component: () => import("@/views/PostEdit.vue"),
    props: {
      editMode: false
    }
  },
  {
    path: "/post/:id",
    name: "Post",
    component: () => import("@/views/Post.vue"),
    props: route => ({
      id: route.params.id
    })
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import("@/views/User.vue"),
    props: route => ({
      userId: route.params.id
    })
  },
  {
    path: "/user/",
    name: "CurrentUser",
    component: () => import("@/views/User.vue"),
    props: route => ({
      userId: store.getters.currentUser.id
    })
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// check if user is logged in before each route
router.beforeEach((to, from, next) => {
  if (to.name !== "Login") {
    store
      .dispatch(CHECK_AUTH)
      .then(authenticated => {
        if (!authenticated) next("/login");
        else next();
      })
      .catch(err => {
        console.log(err);
      });
  } else next();
});

export default router;

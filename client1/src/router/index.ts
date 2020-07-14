import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import { userStore } from "@/store";
import { userService } from "@/services";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/",
        alias: "posts",
        name: "posts",
        props: {
          searchable: true
        },
        component: () => import("@/components/post/PostList.vue")
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/components/user/UserList.vue")
      },
      {
        path: "comments",
        name: "comments",
        component: () => import("@/components/comment/CommentList.vue"),
        props: {
          adminView: true
        }
      },
      {
        path: "replies",
        name: "replies",
        component: () => import("@/components/reply/ReplyList.vue"),
        props: {
          adminView: true
        }
      },
      {
        path: "categories",
        name: "categories",
        component: () => import("@/components/category/CategoryList.vue")
      }
    ]
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
      postId: parseInt(route.params.id)
    })
  },
  {
    path: "/post/:id",
    name: "Post",
    component: () => import("@/views/Post.vue"),
    props: route => ({
      id: parseInt(route.params.id)
    })
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import("@/views/User.vue"),
    props: route => ({
      userId: parseInt(route.params.id)
    })
  },
  {
    path: "/user/",
    name: "CurrentUser",
    component: () => import("@/views/User.vue"),
    props: () => ({
      userId: userStore.getters.user().id
    })
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (!userStore.getters.isAuthenticated()) {
    // the user still might be authenticated
    // since the store is reset on page refresh
    try {
      const result = await userService.getCurrent();
      if ("success" in result) {
        // set the user in store
        userStore.mutations.setUser(result.data);
        // continute to route
        return next();
      } else return window.location.replace("/api/user/oauth/google") // next({ name: "Login" });
    } catch (error) {
      // if not authenticated redirect to login
      return window.location.replace("api/user/oauth/google") // next({ name: "Login" });
    }
  } else return next();
});

export default router;

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
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
        alias: ["/posts", "/index"],
        name: "posts",
        component: () =>
          import(
            /* webpackChunkName: "postList" */ "@/components/post/PostList.vue"
          )
      },
      {
        path: "/users",
        name: "users",
        component: () =>
          import(
            /* webpackChunkName: "userList" */ "@/components/user/UserList.vue"
          )
      },
      {
        path: "/comments",
        name: "comments",
        component: () =>
          import(
            /* webpackChunkName: "commentList" */ "@/components/comment/CommentList.vue"
          ),
        props: {
          adminView: true
        }
      },
      {
        path: "/replies",
        name: "replies",
        component: () =>
          import(
            /* webpackChunkName: "replyList" */ "@/components/reply/ReplyList.vue"
          ),
        props: {
          adminView: true
        }
      },
      {
        path: "/categories",
        name: "categories",
        component: () =>
          import(
            /* webpackChunkName: "categoryList" */ "@/components/category/CategoryList.vue"
          )
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "@/views/Login.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/post/edit/:id",
    name: "EditPost",
    component: () =>
      import(/* webpackChunkName: "postEditor" */ "@/views/PostEditor.vue"),
    props: route => ({
      editMode: true,
      editId: route.params.id
    })
  },
  {
    path: "/post/create",
    name: "CreatePost",
    component: () =>
      import(/* webpackChunkName: "postEditor" */ "@/views/PostEditor.vue"),
    props: {
      editMode: false
    }
  },
  {
    path: "/post/:id",
    name: "Post",
    component: () => import(/* webpackChunkName: "post" */ "@/views/Post.vue"),
    props: route => ({
      id: route.params.id
    })
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import(/* webpackChunkName: "user" */ "@/views/User.vue"),
    props: route => ({
      userId: route.params.id
    })
  },
  {
    path: "/user/",
    name: "CurrentUser",
    component: () => import(/* webpackChunkName: "user" */ "@/views/User.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (to.name !== "Login" && !userStore.getters.isAuthenticated()) {
    // the user still might be authenticated
    // since the store is reset on page refresh
    try {
      const result = await userService.getCurrent();
      if ("success" in result) {
        // set the user in store
        userStore.mutations.setUser(result.data);
        // continute to route
        return next();
      } else return next({ name: "Login" });
    } catch (error) {
      // if not authenticated redirect to login
      return next({ name: "Login" });
    }
  } else return next();
});

export default router;

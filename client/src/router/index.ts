import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import { userStore } from "@/store";
import { userService } from "@/services";
import loginRedirect from "@/util/loginRedirect";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        component: () => import(
          /* webpackChunkName: "postListTabs" */
          /* webpackPrefetch: true */
          "@/components/post/PostListTabs.vue"
        ),
        children: [
          {
            path: "/",
            alias: "all",
            name: "all",
            component: () => import(
              /* webpackChunkName: "postList" */
              /* webpackPrefetch: true */
              "@/components/post/PostList.vue"
            ),
            props: {
              searchable: true,
              verified: true
            },
            meta: {
              postListTabs: true
            }
          },
          {
            path: "/unverified",
            name: "unverified",
            component: () => import(/* webpackChunkName: "postList" */ "@/components/post/PostList.vue"),
            props: {
              searchable: true,
              verified: false
            },
            meta: {
              postListTabs: true
            }
          },
          {
            path: "/category/:categoryId",
            name: "category",
            component: () => import(/* webpackChunkName: "postList" */ "@/components/post/PostList.vue"),
            props: route => ({
              searchable: true,
              verified: true,
              categoryId: parseInt(route.params.categoryId)
            }),
            meta: {
              postListTabs: true
            }
          },
        ]
      },
      {
        path: "users",
        name: "users",
        component: () => import(/* webpackChunkName: "userList" */ "@/components/user/UserList.vue")
      },
      {
        path: "comments",
        name: "comments",
        component: () => import(/* webpackChunkName: "commentList" */ "@/components/comment/CommentList.vue"),
        props: {
          adminView: true,
          sortNewest: true
        }
      },
      {
        path: "replies",
        name: "replies",
        component: () => import(/* webpackChunkName: "replyList" */ "@/components/reply/ReplyList.vue"),
        props: {
          adminView: true
        }
      },
      {
        path: "categories",
        name: "categories",
        component: () => import(/* webpackChunkName: "categoryList" */ "@/components/category/CategoryList.vue")
      }
    ]
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/post/edit/:id",
    name: "EditPost",
    component: () => import(
      /* webpackChunkName: "postEdit" */
      "@/views/PostEdit.vue"
    ),
    props: route => ({
      postId: parseInt(route.params.id)
    })
  },
  {
    path: "/post/:id",
    name: "Post",
    component: () => import(/* webpackChunkName: "post" */ "@/views/Post.vue"),
    props: route => ({
      id: parseInt(route.params.id)
    })
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import(/* webpackChunkName: "user" */ "@/views/User.vue"),
    props: route => ({
      userId: parseInt(route.params.id)
    })
  },
  {
    path: "/user/",
    name: "CurrentUser",
    component: () => import(/* webpackChunkName: "user" */ "@/views/User.vue"),
    props: () => ({
      userId: userStore.getters.user().id
    })
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "@/views/Login.vue")
  },
  {
    path: "/offline",
    name: "Offline",
    component: () => import(
      /* webpackChunkName: "offline" */
      /* webpackPrefetch: true */
      "@/views/Offline.vue"
    )
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "notFound" */ "@/views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (!userStore.getters.isAuthenticated() && to.name !== "Login") {
    // the user still might be authenticated
    // since the store is reset on page refresh
    try {
      const user = await userService.getCurrent();
      userStore.mutations.setUser(user);
    } catch {};
  } else return next();
  // continute to route
  return next();
});

export default router;

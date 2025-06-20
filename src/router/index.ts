import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import NoMenu from "../components/menu/NoMenu.vue";
import websocket from "@/../api/websocket";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    components: {
      default: Home,
      menu: NoMenu,
    },
  },
  {
    path: "/main",
    name: "main",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    components: {
      default: () => import(/* webpackChunkName: "main" */ "../views/Main.vue"),
      menu: () =>
        import(
          /* webpackChunkName: "mainMenu" */ "../components/menu/MainMenu.vue"
        ),
    },
  },
  {
    path: "/room/:roomName/:password",
    components: {
      default: () =>
        import(/* webpackChunkName: "main" */ "../views/Connecting.vue"),
      menu: NoMenu,
    },
    props: { default: true, menu: false },
  },
  {
    path: "/error/:type",
    name: "error",
    components: {
      default: () =>
        import(/* webpackChunkName: "error" */ "../views/Error.vue"),
      menu: NoMenu,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (websocket.isConnected()) {
    if (to.name != "main") {
      next({ name: "main" });
    } else {
      next();
    }
  } else {
    if (to.name == "main") {
      next({ name: "home" });
    } else {
      next();
    }
  }
});

export default router;

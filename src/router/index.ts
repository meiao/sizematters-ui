import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import MainMenu from "../components/menu/MainMenu.vue";
import NoMenu from "../components/menu/NoMenu.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    components: {
      default: Home,
      menu: NoMenu
    }
  },
  {
    path: "/main",
    name: "main",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    components: {
      default: () => import(/* webpackChunkName: "main" */ "../views/Main.vue"),
      menu: MainMenu
    }
  },
  {
    path: "/Error/:type",
    name: "error",
    components: {
      default: () =>
        import(/* webpackChunkName: "error" */ "../views/Error.vue"),
      menu: NoMenu
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

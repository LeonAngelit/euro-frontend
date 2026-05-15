import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "../stores/app";
import config from "../config/config";

const routes = [
  {
    path: "/app",
    name: "Home",
    component: () => import("../views/App/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/Login.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/CreateUser/SignUp.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/profile",
    name: "UserDetails",
    component: () => import("../views/UserDetails/UserDetails.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/createroom",
    name: "CreateRoom",
    component: () => import("../views/CreateRoom/CreateRoom.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminView",
    component: () => import("../views/AdminView/AdminView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/archive",
    name: "Archive",
    component: () => import("../views/Archive/Archive.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/room",
    name: "Room",
    component: () => import("../views/Room/Room.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/country-select",
    name: "CountrySelect",
    component: () => import("../views/CountrySelection/CountrySelect.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/missing-email",
    name: "MissingEmail",
    component: () => import("../views/MissingEmail/MissingEmail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/confirm-email",
    name: "ConfirmEmail",
    component: () => import("../views/MissingEmail/MissingEmail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/join-room",
    redirect: "/app",
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../components/NotFound/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useAppStore();

  if (to.meta.requiresAuth && !store.userLogged) {
    // Preserve callback_url and roomAuth query parameters
    if (
      to.fullPath.includes("/join-room") ||
      to.fullPath.includes(config.confirmemailLink)
    ) {
      next({ path: "/login", query: { callback_url: to.fullPath } });
    } else {
      // Check if there's a callback_url already in query
      if (to.query.callback_url) {
        next({
          path: "/login",
          query: { callback_url: to.query.callback_url as string },
        });
      } else {
        next({ path: "/login" });
      }
    }
    return;
  }

  if (to.meta.guestOnly && store.userLogged) {
    next({ path: "/app" });
    return;
  }

  if (
    to.meta.requiresAdmin &&
    store.userLogged &&
    (store.userLogged as any).username !== config.appAdmin
  ) {
    next({ path: "/app" });
    return;
  }

  next();
});

export default router;

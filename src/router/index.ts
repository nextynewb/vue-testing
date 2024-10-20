import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes as autoRoutes } from "vue-router/auto-routes";

const customRoutes: RouteRecordRaw[] = [
  {
    path: "/product/:productId",
    name: "Product",
    component: () => import("@/pages/product.vue"), // Lazy load the component
  },

  {
    path: "/service/:serviceId",
    name: "Service",
    component: () => import("@/pages/service.vue"), // Lazy load the component
  },
  {
    path: "/order/:orderId",
    name: "Order",
    component: () => import("@/pages/order.vue"),
  },
  {
    path: "/invoice/:orderId",
    name: "Invoice",
    component: () => import("@/pages/invoice.vue"),
  },
];

const routes: RouteRecordRaw[] = [...setupLayouts(autoRoutes), ...customRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;

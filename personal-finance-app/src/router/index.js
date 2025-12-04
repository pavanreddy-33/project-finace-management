import { createRouter, createWebHistory } from "vue-router";
import TransactionsPage from "@/pages/TransactionsPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/transactions",
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionsPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;

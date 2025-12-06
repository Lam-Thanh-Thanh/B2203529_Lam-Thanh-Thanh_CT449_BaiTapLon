import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/stores/auth";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

import UserLayout from "@/layouts/UserLayout.vue";
import UserBooks from "@/views/UserBooks.vue";
import BorrowHistory from "@/views/BorrowHistory.vue";
import UserProfile from "@/views/UserProfile.vue";

import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import AdminBooks from "@/views/AdminBooks.vue";
import AdminBorrows from "@/views/AdminBorrows.vue";
import AdminUsers from "@/views/AdminUsers.vue";
import AdminStaff from "@/views/AdminStaff.vue"; // mới

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  // USER routes with layout
  {
    path: "/",
    component: UserLayout,
    meta: { role: "user" },
    children: [
      { path: "", component: UserBooks },
      { path: "history", component: BorrowHistory },
      { path: "profile", component: UserProfile },
    ],
  },

  // ADMIN routes with layout
  {
    path: "/admin",
    component: AdminLayout,
    meta: { role: "admin" },
    children: [
      { path: "dashboard", component: AdminDashboard },
      { path: "books", component: AdminBooks },
      { path: "borrows", component: AdminBorrows },
      { path: "users", component: AdminUsers },
      { path: "staff", component: AdminStaff },
      { path: "", redirect: "/admin/dashboard" },
    ],
  },

  // fallback
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard phân quyền
router.beforeEach((to, from, next) => {
  const requiredRole = to.matched.reduce(
    (role, record) => record.meta.role || role,
    null
  );

  if (!requiredRole) return next();

  if (!auth.token) {
    return next("/login");
  }

  if (requiredRole === "admin" && !auth.isAdmin()) {
    return next("/");
  }
  if (requiredRole === "user" && !auth.isUser()) {
    return next("/admin/dashboard");
  }

  next();
});

export default router;

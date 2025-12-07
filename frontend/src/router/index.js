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
import AdminPublishers from "@/views/AdminPublishers.vue"; // [Thêm]
import BooksLibrary from "@/views/BooksLibrary.vue";
import Home from "@/views/Home.vue"; // File trang chủ mới tạo

import BookDetails from '@/views/BookDetails.vue';

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  // USER routes with layout
  {
    path: "/",
    component: UserLayout,
    children: [
      { 
        path: "", 
        name: "home", // [THÊM] Đặt tên route là 'home'
        component: Home ,
        meta: { requiresAuth: false }, // Đổi thành false: Cho phép khách xem
      },
      { 
        path: "library", 
        name: "library", // [QUAN TRỌNG] Đặt tên route là 'library' để khớp với lỗi
        component: BooksLibrary ,
        meta: { requiresAuth: false }, // Đổi thành false: Cho phép khách xem
      },
      {
        path: 'library/book/:id',
        name: 'book.details',
        component: BookDetails,
        props: true, // Cho phép truyền biến id vào component      
        },
      { 
        path: "history", 
        name: "history", // [THÊM] Nên đặt tên luôn cho chuẩn
        component: BorrowHistory,
        meta: { requiresAuth: true },
      },
      { 
        path: "profile", 
        name: "profile", // [THÊM]
        component: UserProfile,
        meta: { requiresAuth: true },
      },
      
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
      { path: "publishers", component: AdminPublishers }, // [Thêm]
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

  // 1. Chưa đăng nhập -> Login
  if (requiredRole && !auth.token) {
    return next("/login");
  }

  // 2. Nếu route yêu cầu quyền "admin" (khu vực quản lý)
  // Cho phép cả Admin và Staff truy cập
  if (requiredRole === "admin") {
    if (!auth.isManager()) { 
      // Nếu không phải quản lý -> Về trang chủ user
      return next("/");
    }
  }

  // 3. Nếu route yêu cầu quyền "user" (trang mượn sách)
  // Nếu là quản lý (admin/staff) lỡ vào đây -> Về dashboard
  if (requiredRole === "user") {
    if (auth.isManager()) {
      return next("/admin/dashboard");
    }
  }

  next();
});

export default router;

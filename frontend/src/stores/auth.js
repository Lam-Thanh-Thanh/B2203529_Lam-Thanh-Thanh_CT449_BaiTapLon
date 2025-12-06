import { reactive } from "vue";

const AUTH_KEY = "auth";

export const auth = reactive({
  token: "",
  user: null,

  init() {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      this.token = parsed.token;
      this.user = parsed.user;
    }
  },

  login(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
  },

  logout() {
    this.token = "";
    this.user = null;
    localStorage.removeItem(AUTH_KEY);
  },

  isAdmin() {
    return this.user?.role === "admin";
  },

  // [THÊM MỚI] Kiểm tra staff
  isStaff() {
    return this.user?.role === "staff";
  },

  // [THÊM MỚI] Kiểm tra quyền quản trị chung (Admin hoặc Staff đều vào được Dashboard)
  isManager() {
    return ["admin", "staff"].includes(this.user?.role);
  },

  isUser() {
    return this.user?.role === "user";
  },

  readerId() {
    return this.user?.readerId || null;
  },
});

auth.init();
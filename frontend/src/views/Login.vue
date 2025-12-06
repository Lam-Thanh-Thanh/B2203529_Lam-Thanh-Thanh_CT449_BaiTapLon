<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)]"
  >
    <div
      class="bg-slate-900/70 border border-slate-700 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
    >
      <!-- Left info -->
      <div
        class="hidden md:flex md:w-1/2 flex-col justify-between p-6 bg-gradient-to-b from-indigo-600/80 to-slate-900"
      >
        <div>
          <div
            class="h-10 w-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-2xl mb-4"
          >
            📚
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">
            Book Borrow System
          </h1>
          <p class="text-sm text-indigo-100">
            Quản lý mượn sách trực tuyến cho thư viện của bạn. Dễ dàng theo dõi
            sách, độc giả và lịch sử mượn trả.
          </p>
        </div>

        <div class="text-[11px] text-indigo-100/80">
          <p>Demo: <code>admin / admin123</code> (nếu bạn chưa đổi trên server).</p>
          <p class="mt-1">
            Đồ án: Book Borrow Management – Vue 3 + Node.js + MongoDB.
          </p>
        </div>
      </div>

      <!-- Right form -->
      <div class="w-full md:w-1/2 bg-slate-900/60 p-6 md:p-8">
        <div class="mb-6 text-center md:text-left">
          <p class="text-xs uppercase tracking-[0.2em] text-indigo-400 mb-1">
            Welcome back
          </p>
          <h2 class="text-xl font-semibold text-white">
            Đăng nhập tài khoản
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Đăng nhập để tiếp tục sử dụng hệ thống.
          </p>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-300"
              >Username</label
            >
            <div class="relative">
              <span
                class="absolute left-3 top-2.5 text-slate-500 text-sm select-none"
                >👤</span
              >
              <input
                v-model="username"
                class="border border-slate-700 bg-slate-900/60 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1 text-slate-300"
              >Password</label
            >
            <div class="relative">
              <span
                class="absolute left-3 top-2.5 text-slate-500 text-sm select-none"
                >🔒</span
              >
              <input
                :type="showPwd ? 'text' : 'password'"
                v-model="password"
                class="border border-slate-700 bg-slate-900/60 rounded-lg pl-9 pr-9 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                class="absolute right-3 top-2 text-[11px] text-slate-400 hover:text-slate-200"
                @click="showPwd = !showPwd"
              >
                {{ showPwd ? "Ẩn" : "Hiện" }}
              </button>
            </div>
          </div>

          <button
            class="w-full py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/30"
            type="submit"
          >
            Đăng nhập
          </button>

          <p v-if="error" class="text-xs text-rose-400 text-center">
            {{ error }}
          </p>

          <p class="mt-2 text-xs text-center text-slate-400">
            Chưa có tài khoản?
            <RouterLink to="/register" class="text-indigo-300 underline font-medium">
              Đăng ký ngay
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import AuthService from "@/services/auth.service";
import { auth } from "@/stores/auth";
import { showToast } from "@/stores/toast";

const username = ref("");
const password = ref("");
const error = ref("");
const showPwd = ref(false);
const router = useRouter();

async function submit() {
  error.value = "";
  try {
    const res = await AuthService.login(username.value, password.value);
    auth.login(res.token, res.user);
    showToast("Đăng nhập thành công!", "success");

    if (auth.isAdmin()) router.push("/admin/dashboard");
    else router.push("/");
  } catch (e) {
    error.value = "Sai tài khoản hoặc mật khẩu";
    showToast(error.value, "error");
  }
}
</script>

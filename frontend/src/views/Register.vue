<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)]"
  >
    <div
      class="bg-slate-900/70 border border-slate-700 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
    >
      <!-- Left info -->
      <div
        class="hidden md:flex md:w-1/2 flex-col justify-between p-6 bg-gradient-to-b from-emerald-500/80 to-slate-900"
      >
        <div>
          <div
            class="h-10 w-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-2xl mb-4"
          >
            ✨
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">
            Tạo tài khoản mới
          </h1>
          <p class="text-sm text-emerald-50">
            Đăng ký tài khoản để mượn sách online, theo dõi lịch sử mượn, và
            quản lý thông tin cá nhân của bạn.
          </p>
        </div>

        <div class="text-[11px] text-emerald-50/80">
          <p>Tài khoản user sẽ tự động gắn với một hồ sơ độc giả (Reader).</p>
        </div>
      </div>

      <!-- Right form -->
      <div class="w-full md:w-1/2 bg-slate-900/60 p-6 md:p-8">
        <div class="mb-6 text-center md:text-left">
          <p class="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-1">
            Get started
          </p>
          <h2 class="text-xl font-semibold text-white">
            Đăng ký tài khoản người dùng
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Điền thông tin bên dưới để tạo tài khoản mới.
          </p>
        </div>

        <form @submit.prevent="submit" class="space-y-3">
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-300"
              >Username</label
            >
            <input
              v-model="username"
              class="border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-100 placeholder:text-slate-500"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-medium mb-1 text-slate-300"
                >Họ lót</label
              >
              <input
                v-model="hoLot"
                class="border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-slate-300"
                >Tên</label
              >
              <input
                v-model="ten"
                class="border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1 text-slate-300"
              >Điện thoại</label
            >
            <input
              v-model="dienThoai"
              class="border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1 text-slate-300"
              >Mật khẩu</label
            >
            <input
              v-model="password"
              type="password"
              class="border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-100 placeholder:text-slate-500"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-300"
              >Nhập lại mật khẩu</label
            >
            <input
              v-model="confirm"
              type="password"
              class="border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-100 placeholder:text-slate-500"
              required
            />
          </div>

          <button
            class="w-full py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30"
            type="submit"
          >
            Đăng ký
          </button>

          <p v-if="error" class="text-xs text-rose-400 text-center">
            {{ error }}
          </p>
          <p v-if="success" class="text-xs text-emerald-300 text-center">
            Đăng ký thành công! Mời bạn
            <RouterLink to="/login" class="underline font-medium"
              >đăng nhập</RouterLink
            >.
          </p>

          <p class="mt-1 text-xs text-center text-slate-400">
            Đã có tài khoản?
            <RouterLink to="/login" class="text-emerald-300 underline font-medium">
              Đăng nhập
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import AuthService from "@/services/auth.service";

const username = ref("");
const hoLot = ref("");
const ten = ref("");
const dienThoai = ref("");
const password = ref("");
const confirm = ref("");
const error = ref("");
const success = ref(false);

async function submit() {
  error.value = "";
  success.value = false;

  if (password.value !== confirm.value) {
    error.value = "Mật khẩu nhập lại không khớp.";
    return;
  }

  try {
    await AuthService.register({
      username: username.value.trim(),
      password: password.value,
      hoLot: hoLot.value.trim(),
      ten: ten.value.trim(),
      dienThoai: dienThoai.value.trim(),
    });
    success.value = true;
    username.value = "";
    password.value = "";
    confirm.value = "";
    hoLot.value = "";
    ten.value = "";
    dienThoai.value = "";
  } catch (e) {
    error.value = "Đăng ký thất bại (username có thể đã tồn tại).";
  }
}
</script>

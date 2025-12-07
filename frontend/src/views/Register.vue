<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
    
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row border border-slate-100 min-h-[600px]">
      
      <div class="hidden md:flex md:w-5/12 bg-indigo-600 relative overflow-hidden items-center justify-center p-12 text-white">
        
        <div class="absolute top-[-20%] right-[-20%] w-64 h-64 rounded-full bg-indigo-500 opacity-50 blur-2xl"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-indigo-700 opacity-50 blur-2xl"></div>
        
        <div class="absolute inset-0 opacity-10" 
             style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;">
        </div>

        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="text-indigo-200 font-bold tracking-widest text-xs uppercase mb-8">
            Library System
          </div>
          
          <div>
            <h2 class="text-4xl font-black leading-tight mb-6">
              Bắt đầu hành trình tri thức của bạn.
            </h2>
            <p class="text-indigo-100 text-lg font-medium leading-relaxed opacity-90">
              "Sách mở ra những chân trời mới, và chúng tôi ở đây để giúp bạn chạm vào nó dễ dàng hơn."
            </p>
          </div>

          <div class="space-y-4 mt-8">
            <div class="flex items-center gap-3 text-sm font-medium text-indigo-100 bg-indigo-500/30 p-3 rounded-xl backdrop-blur-sm border border-indigo-400/20">
              <span class="bg-white/20 p-1 rounded-full">✓</span>
              <span>Mượn sách nhanh chóng</span>
            </div>
            <div class="flex items-center gap-3 text-sm font-medium text-indigo-100 bg-indigo-500/30 p-3 rounded-xl backdrop-blur-sm border border-indigo-400/20">
              <span class="bg-white/20 p-1 rounded-full">✓</span>
              <span>Quản lý lịch sử dễ dàng</span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-7/12 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Đăng ký tài khoản</h1>
          <p class="text-slate-500">Nhập thông tin cá nhân của bạn để tiếp tục.</p>
        </div>

        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Tên đăng nhập</label>
            <input
              v-model="username"
              type="text"
              class="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              placeholder="Ví dụ: user123"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Họ lót</label>
              <input
                v-model="hoLot"
                type="text"
                class="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="Nguyễn"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Tên</label>
              <input
                v-model="ten"
                type="text"
                class="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="Văn A"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Số điện thoại</label>
            <input
              v-model="dienThoai"
              type="tel"
              class="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              placeholder="0901234567"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu</label>
              <input
                v-model="password"
                type="password"
                class="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Nhập lại mật khẩu</label>
              <input
                v-model="confirm"
                type="password"
                class="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div v-if="error" class="p-4 rounded-xl bg-rose-50 text-rose-600 text-sm border border-rose-100 flex items-center gap-2 font-medium animate-pulse">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ error }}
          </div>
          <div v-if="success" class="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100 flex items-center gap-2 font-medium">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Đăng ký thành công! <router-link to="/login" class="font-bold underline hover:text-emerald-800">Đăng nhập ngay</router-link></span>
          </div>

          <button
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95 text-base mt-2"
            type="submit"
          >
            Đăng ký tài khoản
          </button>

          <p class="text-center text-slate-500 text-sm mt-6 font-medium">
            Đã có tài khoản?
            <router-link to="/login" class="text-indigo-600 font-bold hover:text-indigo-700 transition hover:underline">
              Đăng nhập tại đây
            </router-link>
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
    error.value = "Đăng ký thất bại (Tên đăng nhập có thể đã tồn tại).";
  }
}
</script>
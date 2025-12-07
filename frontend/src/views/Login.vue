<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
    
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row border border-slate-100 min-h-[600px]">
      
      <div class="hidden md:flex md:w-5/12 bg-indigo-900 relative overflow-hidden items-center justify-center p-12 text-white">
        
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900"></div>
        <div class="absolute top-[-20%] right-[-20%] w-64 h-64 rounded-full bg-white opacity-10 blur-3xl animate-pulse"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        
        <div class="absolute inset-0 opacity-10" 
             style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;">
        </div>

        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex items-center gap-2 text-indigo-200 font-bold tracking-widest text-xs uppercase mb-8">
            <span class="text-xl">📚</span> Library System
          </div>
          
          <div>
            <h2 class="text-4xl font-black leading-tight mb-6">
              Khám phá tri thức
            </h2>
            <p class="text-indigo-100 text-lg font-medium leading-relaxed opacity-90">
              "Đăng nhập để tiếp tục hành trình khám phá kho tri thức vô tận của chúng tôi."
            </p>
          </div>

          <div class="space-y-4 mt-8">
             <div class="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <p class="text-sm font-medium text-white">🎉 Sự kiện tháng này</p>
                <p class="text-xs text-indigo-200 mt-1">Đọc sách miễn phí, nhận quà liền tay.</p>
             </div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-7/12 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
        <div class="mb-10 text-center md:text-left">
          <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Đăng nhập</h1>
          <p class="text-slate-500">Vui lòng nhập thông tin tài khoản của bạn.</p>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Tên đăng nhập</label>
            <div class="relative">
              <span class="absolute left-4 top-3.5 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
              <input
                v-model="username"
                type="text"
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="Nhập username"
                required
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-bold text-slate-700">Mật khẩu</label>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-3.5 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input
                :type="showPwd ? 'text' : 'password'"
                v-model="password"
                class="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="••••••••"
                required
              />
              <!-- <a href="#" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">Quên mật khẩu?</a> -->

              <button
                type="button"
                class="absolute right-4 top-3.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition uppercase tracking-wider"
                @click="showPwd = !showPwd"
              >
                {{ showPwd ? "Ẩn" : "Hiện" }}
              </button>
            </div>
          </div>

          <div v-if="error" class="p-4 rounded-xl bg-rose-50 text-rose-600 text-sm border border-rose-100 flex items-center gap-2 font-medium animate-pulse">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ error }}
          </div>

          <button
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95 text-base mt-2"
            type="submit"
          >
            Đăng nhập
          </button>

          <div class="text-center mt-6">
             <p class="text-slate-500 text-sm font-medium">
                Chưa có tài khoản?
                <router-link to="/register" class="text-indigo-600 font-bold hover:text-indigo-800 transition hover:underline ml-1">
                  Đăng ký ngay
                </router-link>
             </p>
          </div>
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
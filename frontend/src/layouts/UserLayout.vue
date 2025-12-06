<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm/50 backdrop-blur-md bg-white/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <div class="flex items-center gap-2 cursor-pointer" @click="$router.push('/books')">
            <div class="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-xl">📚</div>
            <span class="font-bold text-xl tracking-tight text-indigo-900">LibManager</span>
          </div>

          <nav class="hidden md:flex space-x-8">
            <router-link to="/books" active-class="text-indigo-600 bg-indigo-50" class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition">
              Thư viện sách
            </router-link>
            <router-link to="/history" active-class="text-indigo-600 bg-indigo-50" class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition">
              Lịch sử mượn
            </router-link>
            <router-link to="/profile" active-class="text-indigo-600 bg-indigo-50" class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition">
              Cá nhân
            </router-link>
          </nav>

          <div class="flex items-center gap-4">
             <div v-if="auth.user" class="flex items-center gap-3">
                <span class="hidden sm:block text-sm font-medium text-slate-600">Xin chào, {{ auth.user.username }}</span>
                <button @click="handleLogout" class="text-slate-400 hover:text-rose-600 transition" title="Đăng xuất">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
             </div>
             <div v-else class="flex gap-2">
                <router-link to="/login" class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">Đăng nhập</router-link>
             </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="border-t border-slate-200 mt-12 py-6 bg-white">
        <div class="text-center text-slate-400 text-sm">
            &copy; 2025 LibManager. Hệ thống quản lý thư viện hiện đại.
        </div>
    </footer>

    <Toast />
  </div>
</template>

<script setup>
import { auth } from "@/stores/auth";
import { useRouter } from "vue-router";
import Toast from "@/components/Toast.vue";

const router = useRouter();
function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

<style>
/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
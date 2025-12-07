<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm/50 backdrop-blur-md bg-white/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <div class="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" @click="$router.push('/')">
            <img 
                src="/favicon.ico" 
                alt="LibManager Logo" 
                class="w-10 h-10 object-contain rounded-lg shadow-sm"
            />
            <span class="font-bold text-xl tracking-tight text-indigo-900">LibManager</span>
          </div>

          <div class="flex items-center gap-8">
            
            <nav class="hidden md:flex space-x-6">
  <router-link 
    :to="{ name: 'home' }" 
    exact-active-class="text-indigo-600 bg-indigo-50" 
    class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
  >
    Trang chủ
  </router-link>

  <router-link 
    :to="{ name: 'library' }" 
    active-class="text-indigo-600 bg-indigo-50" 
    class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
  >
    Thư viện sách
  </router-link>

  <router-link 
    :to="{ name: 'history' }" 
    active-class="text-indigo-600 bg-indigo-50" 
    class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
  >
    Lịch sử mượn
  </router-link>

  <router-link 
    :to="{ name: 'profile' }" 
    active-class="text-indigo-600 bg-indigo-50" 
    class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
  >
    Cá nhân
  </router-link>
</nav>

            <div class="flex items-center gap-4 pl-8 md:border-l md:border-slate-200">
               <div v-if="auth.user" class="flex items-center gap-3">
                  <span class="hidden sm:block text-sm font-medium text-slate-600">Xin chào, {{ auth.user.username }}</span>
                  <button @click="handleLogout" class="text-slate-400 hover:text-rose-600 transition p-1" title="Đăng xuất">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
               </div>
               <div v-else class="flex gap-2">
                  <router-link to="/login" class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">Đăng nhập</router-link>
               </div>
            </div>

          </div> </div>
      </div>
    </header>

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto border-t border-slate-800">
      <div class="container mx-auto px-4 max-w-7xl">
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-slate-800 pb-12">
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-2 mb-6">
            <img 
                src="../../public/favicon.ico" 
                alt="LibManager Logo" 
                class="w-10 h-10 object-contain rounded-lg shadow-sm"
            />
              <span class="font-bold text-xl text-white">LibManager</span>
            </div>
            <p class="text-sm leading-relaxed mb-6 text-slate-400">
              Nền tảng quản lý thư viện số hàng đầu, mang đến trải nghiệm đọc sách hiện đại và tiện lợi cho cộng đồng.
            </p>
            <div class="flex gap-3">
              <a href="#" class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-slate-400">f</a>
              <a href="#" class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-slate-400">t</a>
              <a href="#" class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-slate-400">in</a>
            </div>
          </div>
          
          <div>
            <h4 class="text-white font-bold mb-6">Khám phá</h4>
            <ul class="space-y-3 text-sm text-slate-400">
              <li><router-link :to="{name: 'library'}" class="hover:text-indigo-400 transition">Sách mới</router-link></li>
              <li><router-link :to="{name: 'library'}" class="hover:text-indigo-400 transition">Sách xem nhiều</router-link></li>
              <li><a href="#" class="hover:text-indigo-400 transition">Bộ sưu tập</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition">Tác giả</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6">Hỗ trợ</h4>
            <ul class="space-y-3 text-sm text-slate-400">
              <li><a href="#" class="hover:text-indigo-400 transition">Quy định mượn</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition">Chính sách gia hạn</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition">Báo mất sách</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6">Liên hệ</h4>
            <ul class="space-y-4 text-sm text-slate-400">
              <li class="flex items-start gap-3">
                <span class="text-indigo-500 mt-0.5">📍</span> 123 Đường 3/2, Ninh Kiều, Cần Thơ
              </li>
              <li class="flex items-center gap-3">
                <span class="text-indigo-500">📞</span> 090 123 4567
              </li>
              <li class="flex items-center gap-3">
                <span class="text-indigo-500">📧</span> support@libmanager.com
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2025 LibManager. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-white transition">Privacy Policy</a>
            <a href="#" class="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
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
if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    auth.logout();
    router.push("/login");
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
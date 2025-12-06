<template>
  <div class="min-h-screen flex bg-slate-100">
    <!-- Sidebar -->
    <aside
      class="bg-white shadow-lg w-60 flex-shrink-0 fixed inset-y-0 left-0 z-20 transform transition-transform duration-200
             md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="h-full flex flex-col">
        <div class="px-4 py-4 border-b flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              📚
            </div>
            <div>
              <h1 class="text-sm font-bold text-indigo-700">Book Borrow</h1>
              <p class="text-[11px] text-slate-500">User portal</p>
            </div>
          </div>
          <button class="md:hidden text-slate-500" @click="toggleSidebar">✕</button>
        </div>

        <nav class="flex-1 px-2 py-4 text-sm space-y-1">
          <RouterLink
            v-for="item in links"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 text-slate-700"
            :class="isActive(item.to) ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="px-4 py-3 border-t text-xs text-slate-500 flex items-center justify-between">
          <span>
            Đang đăng nhập:
            <b>{{ auth.user?.username }}</b>
          </span>
          <button
            class="px-2 py-1 rounded-lg border border-slate-300 hover:bg-slate-50"
            @click="logout"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div
      class="fixed inset-0 bg-black/30 z-10 md:hidden"
      v-if="sidebarOpen"
      @click="toggleSidebar"
    ></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col md:ml-60">
      <header class="h-12 bg-white shadow-sm flex items-center px-4">
        <button class="md:hidden mr-3 text-slate-600" @click="toggleSidebar">
          ☰
        </button>
        <h2 class="text-sm font-semibold text-slate-700">Khu vực người dùng</h2>
      </header>

      <main class="p-4 flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterView, RouterLink, useRoute, useRouter } from "vue-router";
import { auth } from "@/stores/auth";

const sidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();

const links = [
  { to: "/", label: "Trang sách", icon: "📖" },
  { to: "/history", label: "Lịch sử mượn", icon: "📜" },
  { to: "/profile", label: "Thông tin cá nhân", icon: "👤" },
];

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
function isActive(path) {
  return route.path === path;
}
function logout() {
  auth.logout();
  router.push("/login");
}
</script>

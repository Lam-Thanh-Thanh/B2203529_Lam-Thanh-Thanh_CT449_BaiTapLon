<template>
  <section class="space-y-6 animate-fade-in pb-20">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-slate-800">Quản lý Tài khoản</h2>
      
      <button 
        v-if="activeTab === 'staff'"
        @click="openModal()" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
      >
        <span>+</span> Cấp tài khoản NV
      </button>
    </div>

    <div class="flex border-b border-slate-200">
        <button 
            @click="activeTab = 'reader'"
            class="px-6 py-3 text-sm font-bold transition-colors border-b-2"
            :class="activeTab === 'reader' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
            Độc giả
        </button>
        <button 
            @click="activeTab = 'staff'"
            class="px-6 py-3 text-sm font-bold transition-colors border-b-2"
            :class="activeTab === 'staff' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
            Nhân viên / Admin
        </button>
    </div>

    <div class="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden min-h-[400px]">
      
      <div class="p-4 border-b border-slate-100 flex gap-4">
        <div class="relative flex-1 max-w-md">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
                v-model="searchText"
                type="text" 
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                placeholder="Tìm kiếm username hoặc họ tên..."
            >
        </div>
        <div class="flex items-center text-xs text-slate-400">
            Tổng: {{ filteredUsers.length }} tài khoản
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th class="p-4 pl-6">Tên tài khoản</th>
              <th class="p-4">Họ và tên</th>
              
              <template v-if="activeTab === 'reader'">
                  <th class="p-4">Hoạt động lần cuối</th>
              </template>

              <template v-else>
                  <th class="p-4 text-center">Vai trò</th>
                  <th class="p-4">Mã NV</th>
              </template>

              <th class="p-4 text-right pr-6">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in paginatedUsers" :key="u._id" class="hover:bg-slate-50 transition">
              
              <td class="p-4 pl-6 font-bold text-slate-700">
                {{ u.username }}
              </td>

              <td class="p-4 text-slate-600">
                {{ u.fullName || '---' }}
              </td>

              <template v-if="activeTab === 'reader'">
                  <td class="p-4 text-slate-500 text-xs">
                      {{ fmtDate(u.updatedAt) }}
                  </td>
              </template>

              <template v-else>
                  <td class="p-4 text-center">
                    <span 
                      class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border"
                      :class="u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'"
                    >
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="p-4 text-slate-500 font-mono text-xs">
                      {{ u.staffId ? u.staffId.slice(-6).toUpperCase() : '--' }}
                  </td>
              </template>

              <td class="p-4 text-right pr-6">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    v-if="activeTab === 'staff'"
                    @click="openModal(u)" 
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" 
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  
                  <button 
                    @click="remove(u)" 
                    class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paginatedUsers.length">
              <td :colspan="activeTab === 'reader' ? 4 : 5" class="p-8 text-center text-slate-400">
                Không tìm thấy tài khoản nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
         <span class="text-xs text-slate-500">Trang {{ currentPage }} / {{ totalPages }}</span>
         <div class="flex gap-2">
            <button 
                @click="currentPage--" 
                :disabled="currentPage === 1" 
                class="px-3 py-1 border rounded bg-white hover:bg-slate-50 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Trước
            </button>
            
            <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="currentPage = page"
                class="w-8 h-8 flex items-center justify-center rounded border text-xs font-medium transition"
                :class="page === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 hover:bg-slate-50'"
            >
                {{ page }}
            </button>

            <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages" 
                class="px-3 py-1 border rounded bg-white hover:bg-slate-50 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Sau
            </button>
         </div>
      </div>

    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
        <h3 class="text-xl font-bold text-slate-800 mb-4">
          {{ editingId ? "Cập nhật tài khoản" : "Tạo tài khoản Nhân viên" }}
        </h3>
        
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
            <input v-model="form.username" class="input w-full p-2 border rounded" required :disabled="!!editingId" />
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">
              {{ editingId ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu" }}
            </label>
            <input v-model="form.password" type="password" class="input w-full p-2 border rounded" :required="!editingId" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Vai trò</label>
            <select v-model="form.role" class="input w-full p-2 border rounded bg-white">
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="staff">Nhân viên (Staff)</option>
            </select>
          </div>

          <div>
             <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Liên kết Nhân viên</label>
             <select v-model="form.staffId" class="input w-full p-2 border rounded bg-white">
                <option :value="null">-- Không liên kết --</option>
                <option v-for="s in staffList" :key="s._id" :value="s._id">
                    {{ s.hoLot }} {{ s.ten }} ({{ s._id.slice(-4) }})
                </option>
             </select>
             <p class="text-[10px] text-slate-400 mt-1">Chọn hồ sơ nhân viên để hiển thị tên.</p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Hủy</button>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700 transition">
              {{ editingId ? "Lưu thay đổi" : "Tạo tài khoản" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import UserService from "@/services/user.service";
import StaffService from "@/services/staff.service";
import { showToast } from "@/stores/toast";

const users = ref([]);
const staffList = ref([]);
const activeTab = ref("reader");
const showModal = ref(false);
const editingId = ref(null);

// Pagination & Search State
const searchText = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;

const form = reactive({ 
    username: "", 
    password: "", 
    role: "admin",
    staffId: null
});

// Load Data
async function load() {
  const [usersData, staffData] = await Promise.all([
      UserService.list(),
      StaffService.getAll()
  ]);
  users.value = usersData;
  staffList.value = staffData;
}

// 1. Filter Logic (Role + Search)
const filteredUsers = computed(() => {
    let data = [];
    // Lọc theo Role (Tab)
    if (activeTab.value === 'reader') {
        data = users.value.filter(u => u.role === 'user');
    } else {
        data = users.value.filter(u => u.role !== 'user');
    }

    // Lọc theo Search Text
    if (searchText.value) {
        const lower = searchText.value.toLowerCase();
        data = data.filter(u => 
            u.username.toLowerCase().includes(lower) || 
            (u.fullName && u.fullName.toLowerCase().includes(lower))
        );
    }
    return data;
});

// 2. Pagination Logic
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.value.slice(start, end);
});

const displayedPages = computed(() => {
    // Logic hiển thị số trang đơn giản
    if (totalPages.value <= 5) return Array.from({length: totalPages.value}, (_, i) => i + 1);
    // Nếu nhiều trang hơn có thể thêm logic ...
    return Array.from({length: totalPages.value}, (_, i) => i + 1); // Hiện tại cứ hiện hết cho đơn giản
});

// Reset page khi đổi tab hoặc search
watch([activeTab, searchText], () => {
    currentPage.value = 1;
});

function fmtDate(d) {
    if(!d) return 'Chưa hoạt động';
    return new Date(d).toLocaleString('vi-VN');
}

function openModal(u = null) {
  if (u) {
    editingId.value = u._id;
    form.username = u.username;
    form.password = "";
    form.role = u.role;
    form.staffId = u.staffId || null;
  } else {
    editingId.value = null;
    form.username = "";
    form.password = "";
    form.role = "admin";
    form.staffId = null;
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function submit() {
  try {
    const payload = { ...form };
    if (!payload.password) delete payload.password;

    if (editingId.value) {
      await UserService.update(editingId.value, payload);
      showToast("Cập nhật thành công", "success");
    } else {
      await UserService.create(payload);
      showToast("Tạo tài khoản thành công", "success");
    }
    await load();
    closeModal();
  } catch (e) {
    showToast("Lỗi: " + (e.response?.data?.message || e.message), "error");
  }
}

async function remove(u) {
  if (!confirm(`Xóa tài khoản ${u.username}?`)) return;
  try {
    await UserService.delete(u._id);
    showToast("Đã xóa tài khoản", "success");
    await load();
  } catch (e) { showToast("Lỗi xóa", "error"); }
}

onMounted(load);
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
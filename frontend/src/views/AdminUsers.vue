<template>
  <section class="space-y-6 animate-fade-in">
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

    <div class="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden min-h-[300px]">
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
            <tr v-for="u in filteredUsers" :key="u._id" class="hover:bg-slate-50 transition">
              
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
                      {{ u.staffId || '--' }}
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
            <tr v-if="!filteredUsers.length">
              <td :colspan="activeTab === 'reader' ? 4 : 5" class="p-8 text-center text-slate-400">
                Không có tài khoản nào.
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref, reactive, computed, onMounted } from "vue";
import UserService from "@/services/user.service";
import StaffService from "@/services/staff.service"; // Để lấy list nhân viên cho dropdown
import { showToast } from "@/stores/toast";

const users = ref([]);
const staffList = ref([]);
const activeTab = ref("reader"); // 'reader' | 'staff'
const showModal = ref(false);
const editingId = ref(null);

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

// Filter Users based on Tab
const filteredUsers = computed(() => {
    if (activeTab.value === 'reader') {
        return users.value.filter(u => u.role === 'user');
    } else {
        // Tab staff bao gồm cả admin và các role khác (nếu có sau này)
        return users.value.filter(u => u.role !== 'user');
    }
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
    if (!payload.password) delete payload.password; // Không gửi pass rỗng khi edit

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
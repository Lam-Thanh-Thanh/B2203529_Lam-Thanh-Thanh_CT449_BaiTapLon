<template>
  <section class="space-y-6 animate-fade-in">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-slate-800">Quản lý Tài khoản</h2>
      <button 
        @click="openModal()" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
      >
        <span>+</span> Tạo tài khoản
      </button>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th class="p-4 pl-6">Người dùng</th>
              <th class="p-4 text-center">Vai trò</th>
              <th class="p-4 text-center">Mã Reader/Staff</th>
              <th class="p-4 text-right pr-6">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in users" :key="u._id" class="hover:bg-slate-50 transition">
              <td class="p-4 pl-6">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border-2 border-white"
                    :class="u.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'"
                  >
                    {{ u.role === 'admin' ? '🛡️' : '👤' }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800">{{ u.username }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">ID: {{ u._id.slice(-6) }}</div>
                  </div>
                </div>
              </td>
              
              <td class="p-4 text-center">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-bold border shadow-sm uppercase tracking-wide"
                  :class="u.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
                >
                  {{ u.role }}
                </span>
              </td>

              <td class="p-4 text-center text-slate-500 font-mono text-xs">
                {{ u.readerId || '---' }}
              </td>

              <td class="p-4 text-right pr-6">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(u)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Sửa">
                    ✏️
                  </button>
                  <button @click="remove(u)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!users.length">
              <td colspan="4" class="p-8 text-center text-slate-400">Không có tài khoản nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
        <h3 class="text-xl font-bold text-slate-800 mb-4">
          {{ editingId ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới" }}
        </h3>
        
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
            <input v-model="form.username" class="input-field" required :disabled="!!editingId" />
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">
              {{ editingId ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu" }}
            </label>
            <input v-model="form.password" type="password" class="input-field" :required="!editingId" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Vai trò</label>
            <select v-model="form.role" class="input-field bg-white">
              <option value="user">User (Độc giả)</option>
              <option value="admin">Admin (Quản trị)</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm">Hủy</button>
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
import { ref, onMounted, reactive } from "vue";
import UserService from "@/services/user.service";
import { showToast } from "@/stores/toast";

const users = ref([]);
const showModal = ref(false);
const editingId = ref(null);
const form = reactive({ username: "", password: "", role: "user" });

async function load() {
  users.value = await UserService.list();
}

function openModal(u = null) {
  if (u) {
    editingId.value = u._id;
    form.username = u.username;
    form.password = "";
    form.role = u.role;
  } else {
    editingId.value = null;
    form.username = "";
    form.password = "";
    form.role = "user";
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function submit() {
  try {
    if (editingId.value) {
      const payload = { role: form.role };
      if (form.password) payload.password = form.password;
      await UserService.update(editingId.value, payload);
      showToast("Cập nhật thành công", "success");
    } else {
      await UserService.create({ ...form });
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
    showToast("Đã xóa", "success");
    await load();
  } catch (e) { showToast("Lỗi xóa", "error"); }
}

onMounted(load);
</script>

<style scoped>
.input-field {
  /* @apply w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm; */
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
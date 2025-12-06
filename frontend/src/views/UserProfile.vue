<template>
  <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
    <h2 class="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h2>

    <div v-if="loading" class="text-center py-8 text-slate-500">Đang tải thông tin...</div>

    <div v-else class="grid md:grid-cols-3 gap-6">
      
      <div class="md:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
          <div class="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-3xl mb-4 text-indigo-600 border-4 border-white shadow-md">
            {{ (reader.ten || 'U').charAt(0).toUpperCase() }}
          </div>
          <h3 class="text-xl font-bold text-slate-800">
            {{ reader.hoLot }} {{ reader.ten }}
          </h3>
          <p class="text-sm text-slate-500 uppercase tracking-wider mt-1">{{ profile.user?.role }}</p>
          
          <div class="mt-6 space-y-3 text-left text-sm">
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Username</span>
              <span class="font-medium text-slate-700">{{ profile.user?.username }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Giới tính</span>
              <span class="font-medium text-slate-700">{{ reader.phai || '---' }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">SĐT</span>
              <span class="font-medium text-slate-700">{{ reader.dienThoai || '---' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 space-y-6">
        
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-800">Cập nhật thông tin</h3>
            <span class="text-xl">📝</span>
          </div>
          
          <form @submit.prevent="saveProfile" class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Họ lót</label>
                <input v-model="reader.hoLot" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Tên</label>
                <input v-model="reader.ten" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Địa chỉ</label>
              <input v-model="reader.diaChi" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Số điện thoại</label>
                <input v-model="reader.dienThoai" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Giới tính</label>
                <select v-model="reader.phai" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition bg-white">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div class="text-right mt-2">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm hover:shadow-md">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
           <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-800">Đổi mật khẩu</h3>
            <span class="text-xl">🔒</span>
          </div>
          <form @submit.prevent="changePwd" class="space-y-3">
             <div class="grid md:grid-cols-3 gap-4">
               <input v-model="oldPassword" type="password" placeholder="Mật khẩu hiện tại" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition" required />
               <input v-model="newPassword" type="password" placeholder="Mật khẩu mới" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition" required />
               <input v-model="confirmPassword" type="password" placeholder="Nhập lại mới" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition" required />
             </div>
             <div class="text-right">
                <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm hover:shadow-md">
                  Cập nhật mật khẩu
                </button>
             </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import MeService from "@/services/me.service";
import { showToast } from "@/stores/toast";

const loading = ref(true);
const profile = reactive({ user: null, reader: {} });
const reader = reactive({});
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

onMounted(async () => {
  try {
    const data = await MeService.getProfile();
    profile.user = data.user;
    Object.assign(reader, data.reader || {});
  } catch(e) { showToast("Lỗi tải thông tin", "error"); } 
  finally { loading.value = false; }
});

async function saveProfile() {
  try {
    await MeService.updateProfile(reader);
    showToast("Cập nhật thành công", "success");
  } catch { showToast("Lỗi cập nhật", "error"); }
}

async function changePwd() {
  if(newPassword.value !== confirmPassword.value) return showToast("Mật khẩu không khớp", "error");
  try {
    await MeService.changePassword({ oldPassword: oldPassword.value, newPassword: newPassword.value });
    showToast("Đổi mật khẩu thành công", "success");
    oldPassword.value = ""; newPassword.value = ""; confirmPassword.value = "";
  } catch(e) { showToast(e.response?.data?.message || "Lỗi", "error"); }
}
</script>
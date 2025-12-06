<template>
  <div class="max-w-5xl mx-auto">
    <div v-if="loading" class="text-center py-10">Đang tải hồ sơ...</div>
    
    <div v-else class="grid md:grid-cols-3 gap-8 items-start">
      
      <div class="md:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center sticky top-24">
        <div class="w-28 h-28 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-4xl text-indigo-600 border-4 border-white shadow-lg mb-4">
          {{ (reader.ten || 'U').charAt(0).toUpperCase() }}
        </div>
        
        <h2 class="text-xl font-bold text-slate-800">
          {{ reader.hoLot }} {{ reader.ten }}
        </h2>
        <p class="text-sm text-slate-400 font-medium uppercase tracking-wider mt-1 mb-6">
          {{ profile.user?.role }} Account
        </p>

        <div class="space-y-3 text-left bg-slate-50 p-4 rounded-xl">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Username</span>
            <span class="font-bold text-slate-700">{{ profile.user?.username }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Giới tính</span>
            <span class="font-bold text-slate-700">{{ reader.phai || '--' }}</span>
          </div>
           <div class="flex justify-between text-sm">
            <span class="text-slate-400">SĐT</span>
            <span class="font-bold text-slate-700">{{ reader.dienThoai || '--' }}</span>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 space-y-8">
        
        <section class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <span class="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-xl">📝</span>
            <h3 class="text-lg font-bold text-slate-800">Cập nhật thông tin</h3>
          </div>

          <form @submit.prevent="saveProfile" class="grid gap-5">
            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Họ & tên lót</label>
                <input v-model="reader.hoLot" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên</label>
                <input v-model="reader.ten" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Địa chỉ</label>
              <input v-model="reader.diaChi" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Số điện thoại</label>
                <input v-model="reader.dienThoai" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Giới tính</label>
                <select v-model="reader.phai" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end mt-2">
              <button class="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-0.5">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <span class="bg-emerald-100 text-emerald-600 p-2 rounded-lg text-xl">🔒</span>
            <h3 class="text-lg font-bold text-slate-800">Đổi mật khẩu</h3>
          </div>

          <form @submit.prevent="changePwd" class="space-y-4">
             <div class="grid md:grid-cols-3 gap-4">
               <div>
                 <input v-model="oldPassword" type="password" placeholder="Mật khẩu cũ" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" required />
               </div>
               <div>
                 <input v-model="newPassword" type="password" placeholder="Mật khẩu mới" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" required />
               </div>
               <div>
                 <input v-model="confirmPassword" type="password" placeholder="Nhập lại mới" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" required />
               </div>
             </div>
             <div class="flex justify-end">
                <button class="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition transform hover:-translate-y-0.5">
                  Cập nhật mật khẩu
                </button>
             </div>
          </form>
        </section>

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
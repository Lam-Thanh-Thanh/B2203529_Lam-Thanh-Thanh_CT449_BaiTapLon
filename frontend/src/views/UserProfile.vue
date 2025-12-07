<template>
  <div class="min-h-screen bg-slate-50 pb-20 pt-10 font-sans">
    
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Hồ sơ cá nhân</h1>
        <p class="text-slate-500 mt-2">Quản lý thông tin tài khoản và bảo mật.</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <span class="text-slate-400 font-medium">Đang tải dữ liệu...</span>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
            
            <div class="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
               <div class="absolute inset-0 bg-black/10"></div>
            </div>

            <div class="px-6 pb-8 text-center relative">
              <div class="w-28 h-28 mx-auto -mt-14 relative z-10 bg-white rounded-full p-1.5 shadow-lg">
                <div class="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 uppercase">
                  {{ (reader.ten || 'U').charAt(0) }}
                </div>
              </div>
              
              <h2 class="text-2xl font-bold text-slate-800 mt-4">
                {{ reader.hoLot }} {{ reader.ten }}
              </h2>
              <div class="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mt-2 border border-indigo-100">
                {{ profile.user?.role || 'Member' }}
              </div>

              <div class="mt-8 space-y-4 text-left">
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">👤</span>
                    <span class="text-sm text-slate-500">Username</span>
                  </div>
                  <span class="font-semibold text-slate-700">{{ profile.user?.username }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">⚧</span>
                    <span class="text-sm text-slate-500">Giới tính</span>
                  </div>
                  <span class="font-semibold text-slate-700">{{ reader.phai || 'Chưa cập nhật' }}</span>
                </div>

                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">📞</span>
                    <span class="text-sm text-slate-500">Điện thoại</span>
                  </div>
                  <span class="font-semibold text-slate-700">{{ reader.dienThoai || 'Chưa cập nhật' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                📝
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Thông tin cá nhân</h3>
                <p class="text-sm text-slate-500">Cập nhật thông tin để chúng tôi hỗ trợ tốt hơn.</p>
              </div>
            </div>

            <form @submit.prevent="saveProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Họ & tên lót</label>
                  <input v-model="reader.hoLot" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Nhập họ..." />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Tên</label>
                  <input v-model="reader.ten" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Nhập tên..." />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ</label>
                <input v-model="reader.diaChi" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Nhập địa chỉ..." />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                  <input v-model="reader.dienThoai" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all" placeholder="090..." />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Giới tính</label>
                  <div class="relative">
                    <select v-model="reader.phai" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none bg-white">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition transform hover:-translate-y-1">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
             <div class="flex items-center gap-4 mb-8">
              <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Bảo mật</h3>
                <p class="text-sm text-slate-500">Đổi mật khẩu định kỳ để bảo vệ tài khoản.</p>
              </div>
            </div>

            <form @submit.prevent="changePwd" class="space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                   <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Mật khẩu cũ</label>
                   <input v-model="oldPassword" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" required placeholder="••••••" />
                 </div>
                 <div>
                   <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Mật khẩu mới</label>
                   <input v-model="newPassword" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" required placeholder="••••••" />
                 </div>
                 <div>
                   <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nhập lại mới</label>
                   <input v-model="confirmPassword" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" required placeholder="••••••" />
                 </div>
               </div>
               <div class="flex justify-end pt-2">
                  <button class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition transform hover:-translate-y-1">
                    Cập nhật mật khẩu
                  </button>
               </div>
            </form>
          </div>
          <section class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <span class="bg-rose-100 text-rose-600 p-2 rounded-lg text-xl">❤️</span>
            <h3 class="text-lg font-bold text-slate-800">Sách yêu thích ({{ favoriteBooks.length }})</h3>
          </div>

          <div v-if="favoriteBooks.length === 0" class="text-center text-slate-400 py-8">
              Chưa lưu cuốn sách nào.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="book in favoriteBooks" 
                :key="book._id" 
                class="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition cursor-pointer group bg-slate-50 hover:bg-white"
                @click="$router.push({ name: 'book.details', params: { id: book._id } })"
              >
                  <div class="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                      <img :src="book.image" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 class="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-indigo-600 transition">{{ book.title }}</h4>
                      <p class="text-xs text-slate-500 mt-1">{{ book.author }}</p>
                      <span class="text-[10px] mt-2 inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 w-fit font-bold" v-if="book.copies > 0">Còn hàng</span>
                  </div>
              </div>
          </div>
        </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import MeService from "@/services/me.service";
import { showToast } from "@/stores/toast";
import ReaderService from "@/services/reader.service"; // [THÊM]
const loading = ref(true);
const profile = reactive({ user: null, reader: {} });
const reader = reactive({});
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const favoriteBooks = ref([]); // [THÊM]

onMounted(async () => {
  try {
    const data = await MeService.getProfile();
    favoriteBooks.value = await ReaderService.getFavorites();
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
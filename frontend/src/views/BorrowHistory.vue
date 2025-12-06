<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <span>🗂️</span> Lịch sử mượn sách
      </h2>
      <div class="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
        Đã mượn <span class="font-bold text-indigo-600">{{ borrows.length }}</span> cuốn
      </div>
    </div>

    <div v-if="!readerId" class="p-6 bg-amber-50 border border-amber-100 rounded-xl text-center space-y-3">
      <div class="text-4xl">⚠️</div>
      <h3 class="text-amber-800 font-semibold">Chưa tìm thấy thông tin độc giả</h3>
      <p class="text-sm text-amber-700">
        Có thể phiên đăng nhập đã cũ. Vui lòng đăng xuất và đăng nhập lại để hệ thống cập nhật dữ liệu.
      </p>
      <button @click="reLogin" class="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition">
        Đăng nhập lại
      </button>
    </div>

    <div v-else-if="loading" class="py-12 text-center text-slate-500 flex flex-col items-center">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
      Đang tải dữ liệu...
    </div>

    <div v-else-if="borrows.length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div class="text-6xl mb-4 opacity-50">📚</div>
      <h3 class="text-lg font-medium text-slate-800">Bạn chưa mượn cuốn sách nào</h3>
      <p class="text-slate-500 text-sm mt-1 mb-6">Thư viện có rất nhiều sách hay đang chờ bạn.</p>
      <router-link to="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
        Khám phá ngay &rarr;
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="item in borrows" 
        :key="item._id" 
        class="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="statusColor(item.status)"></div>

        <div class="flex flex-col md:flex-row gap-5">
          <div class="w-full md:w-20 h-28 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
            <img 
              :src="item.bookImage || 'https://placehold.co/100x140?text=No+Img'" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              alt="Book Cover" 
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold text-slate-800 text-lg leading-tight truncate pr-4" :title="item.bookTitle">
                  {{ item.bookTitle || 'Sách không xác định' }}
                </h3>
                <p class="text-xs text-slate-400 font-mono mt-1">#{{ item._id }}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold border" :class="statusBadge(item.status)">
                {{ statusText(item.status) }}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">Ngày yêu cầu</span>
                <span class="font-medium text-slate-700">{{ formatDate(item.createdAt) }}</span>
              </div>
              
              <div v-if="item.ngayMuon">
                <span class="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">Ngày mượn</span>
                <span class="font-medium text-slate-700">{{ formatDate(item.ngayMuon) }}</span>
              </div>
              
              <div v-if="['borrowed', 'returned'].includes(item.status) && item.dueDate">
                <span class="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">Hạn trả</span>
                <span class="font-medium" :class="isOverdue(item) ? 'text-rose-600 font-bold' : 'text-slate-700'">
                  {{ formatDate(item.dueDate) }}
                  <span v-if="isOverdue(item)" class="text-[10px] bg-rose-100 text-rose-600 px-1.5 rounded ml-1">Quá hạn</span>
                </span>
              </div>

              <div v-if="item.status === 'returned'">
                 <span class="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">Ngày trả</span>
                 <span class="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{{ formatDate(item.ngayTra) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BorrowService from "@/services/borrow.service";
import { auth } from "@/stores/auth";
import { showToast } from "@/stores/toast";

const router = useRouter();
const borrows = ref([]);
const loading = ref(true);
const readerId = ref(null);

function formatDate(d) {
  if (!d) return "--/--";
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Logic màu sắc trạng thái
function statusColor(s) {
  switch(s) {
    case 'pending': return 'bg-yellow-400';
    case 'approved': return 'bg-indigo-500';
    case 'borrowed': return 'bg-blue-500';
    case 'returned': return 'bg-emerald-500';
    default: return 'bg-slate-300';
  }
}

function statusBadge(s) {
  switch(s) {
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'approved': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'borrowed': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'returned': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function statusText(s) {
  switch(s) {
    case 'pending': return 'Đang chờ duyệt';
    case 'approved': return 'Đã duyệt (Chờ lấy)';
    case 'borrowed': return 'Đang mượn';
    case 'returned': return 'Đã trả';
    default: return s;
  }
}

function isOverdue(item) {
  if (item.status !== 'borrowed' || !item.dueDate) return false;
  return new Date(item.dueDate) < new Date();
}

function reLogin() {
  auth.logout();
  router.push('/login');
}

onMounted(async () => {
  readerId.value = auth.readerId();
  
  // Nếu không có readerId, dừng lại và hiển thị cảnh báo
  if (!readerId.value) {
    loading.value = false;
    return;
  }

  try {
    // Gọi API lọc theo maDocGia
    borrows.value = await BorrowService.list({ maDocGia: readerId.value });
  } catch (error) {
    console.error(error);
    showToast("Không thể tải dữ liệu. Vui lòng thử lại.", "error");
  } finally {
    loading.value = false;
  }
});
</script>
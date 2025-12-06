<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-slate-200">
      <div>
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Lịch sử mượn sách</h2>
        <p class="text-slate-500 mt-2">Theo dõi trạng thái các yêu cầu mượn và trả sách của bạn.</p>
      </div>
      <div class="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm shadow-sm border border-indigo-100">
        Tổng cộng: {{ borrows.length }} phiếu
      </div>
    </div>

    <div v-if="loading" class="py-20 text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <span class="text-slate-400 font-medium">Đang tải dữ liệu...</span>
    </div>

    <div v-else-if="!borrows.length" class="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
      <div class="text-6xl mb-6 opacity-20">📭</div>
      <h3 class="text-xl font-bold text-slate-700">Chưa có lịch sử mượn</h3>
      <p class="text-slate-400 mb-6">Bạn chưa thực hiện yêu cầu mượn sách nào.</p>
      <router-link to="/books" class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
        Khám phá kho sách ngay
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="item in borrows" 
        :key="item._id" 
        class="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="statusColor(item.status)"></div>

        <div class="w-full md:w-24 h-36 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden shadow-inner relative">
          <img 
            :src="item.bookImage || 'https://placehold.co/100x140?text=No+Img'" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div class="flex-1 py-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-bold text-xl text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">{{ item.bookTitle }}</h3>
              <span class="px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider" :class="statusBadge(item.status)">
                {{ statusText(item.status) }}
              </span>
            </div>
            
            <div class="text-xs text-slate-400 font-mono bg-slate-50 inline-block px-2 py-1 rounded-md mb-4">
              Mã phiếu: #{{ item._id.slice(-6) }}
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-slate-50">
            <div>
              <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Ngày tạo</span>
              <span class="font-semibold text-slate-700">{{ fmt(item.createdAt) }}</span>
            </div>
            <div v-if="item.ngayMuon">
              <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Ngày mượn</span>
              <span class="font-semibold text-indigo-600">{{ fmt(item.ngayMuon) }}</span>
            </div>
            <div v-if="item.dueDate">
              <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Hạn trả</span>
              <span class="font-bold" :class="isOverdue(item) ? 'text-rose-600' : 'text-slate-700'">
                {{ fmt(item.dueDate) }}
                <span v-if="isOverdue(item)" class="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded ml-1">!</span>
              </span>
            </div>
            <div v-if="item.ngayTra">
              <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Ngày trả</span>
              <span class="font-semibold text-emerald-600">{{ fmt(item.ngayTra) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";
import { auth } from "@/stores/auth";
import { showToast } from "@/stores/toast";

const borrows = ref([]);
const loading = ref(true);

function fmt(d) {
  return d ? new Date(d).toLocaleDateString('vi-VN') : "--";
}

function statusColor(s) {
  if (s === 'pending') return 'bg-amber-400';
  if (s === 'approved') return 'bg-indigo-500';
  if (s === 'borrowed') return 'bg-blue-500';
  return 'bg-emerald-500';
}

function statusBadge(s) {
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (s === 'approved') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  if (s === 'borrowed') return 'bg-blue-50 text-blue-700 border-blue-100';
  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
}

function statusText(s) {
  if (s === 'pending') return 'Chờ duyệt';
  if (s === 'approved') return 'Đã duyệt';
  if (s === 'borrowed') return 'Đang đọc';
  return 'Đã trả';
}

function isOverdue(item) {
  return item.status === 'borrowed' && item.dueDate && new Date(item.dueDate) < new Date();
}

onMounted(async () => {
  loading.value = true;
  try {
    // KHÔNG gửi maDocGia từ client nữa
    borrows.value = await BorrowService.list();
  } catch (e) {
    showToast("Lỗi tải lịch sử", "error");
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
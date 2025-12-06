<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Lịch sử mượn sách</h2>
        <p class="text-slate-500 text-sm">Theo dõi trạng thái các cuốn sách bạn đã đăng ký</p>
      </div>
      <div class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm">
        Tổng cộng: {{ borrows.length }} phiếu
      </div>
    </div>

    <div v-if="loading" class="py-12 text-center text-slate-400">
      Đang tải dữ liệu...
    </div>

    <div v-else-if="!borrows.length" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
      <div class="text-6xl mb-4 opacity-20">📚</div>
      <h3 class="text-lg font-medium text-slate-700">Chưa có lịch sử mượn</h3>
      <router-link to="/books" class="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
        Tìm sách ngay
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="item in borrows" 
        :key="item._id" 
        class="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="statusColor(item.status)"></div>

        <div class="w-full md:w-24 h-32 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
          <img 
            :src="item.bookImage || 'https://placehold.co/100x140?text=No+Img'" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div class="flex-1 py-1">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg text-slate-800 line-clamp-1">{{ item.bookTitle }}</h3>
            <span class="px-3 py-1 rounded-full text-xs font-bold border" :class="statusBadge(item.status)">
              {{ statusText(item.status) }}
            </span>
          </div>
          
          <div class="text-xs text-slate-400 font-mono mb-4">ID: {{ item._id }}</div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-slate-50 pt-3">
            <div>
              <span class="block text-[10px] text-slate-400 uppercase font-bold">Ngày tạo</span>
              <span class="font-medium text-slate-700">{{ fmt(item.createdAt) }}</span>
            </div>
            <div v-if="item.ngayMuon">
              <span class="block text-[10px] text-slate-400 uppercase font-bold">Ngày mượn</span>
              <span class="font-medium text-slate-700">{{ fmt(item.ngayMuon) }}</span>
            </div>
            <div v-if="item.dueDate">
              <span class="block text-[10px] text-slate-400 uppercase font-bold">Hạn trả</span>
              <span class="font-medium" :class="isOverdue(item) ? 'text-rose-600 font-bold' : 'text-slate-700'">
                {{ fmt(item.dueDate) }}
              </span>
            </div>
            <div v-if="item.ngayTra">
              <span class="block text-[10px] text-slate-400 uppercase font-bold">Ngày trả</span>
              <span class="font-medium text-emerald-600">{{ fmt(item.ngayTra) }}</span>
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
  if (s === 'pending') return 'bg-yellow-400';
  if (s === 'approved') return 'bg-indigo-500';
  if (s === 'borrowed') return 'bg-blue-500';
  return 'bg-emerald-500';
}

function statusBadge(s) {
  if (s === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  if (s === 'approved') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  if (s === 'borrowed') return 'bg-blue-50 text-blue-700 border-blue-100';
  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
}

function statusText(s) {
  if (s === 'pending') return 'Chờ duyệt';
  if (s === 'approved') return 'Đã duyệt (Chờ lấy)';
  if (s === 'borrowed') return 'Đang mượn';
  return 'Đã trả';
}

function isOverdue(item) {
  return item.status === 'borrowed' && item.dueDate && new Date(item.dueDate) < new Date();
}

onMounted(async () => {
  const id = auth.readerId();
  if (!id) {
    loading.value = false;
    return;
  }
  try {
    borrows.value = await BorrowService.getAll({ maDocGia: id });
  } catch (e) {
    showToast("Lỗi tải lịch sử", "error");
  } finally {
    loading.value = false;
  }
});
</script>
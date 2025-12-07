<template>
  <div class="max-w-5xl mx-auto px-4 pb-20 animate-fade-in">
    
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 py-8 mb-4">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight mb-1">Lịch sử mượn sách</h2>
        <p class="text-slate-500">Quản lý và theo dõi tiến độ đọc sách của bạn.</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
        <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span class="text-sm font-bold text-slate-600">Tổng phiếu: <span class="text-indigo-600">{{ borrows.length }}</span></span>
      </div>
    </div>

    <div v-if="loading" class="py-32 text-center">
      <div class="relative w-16 h-16 mx-auto mb-4">
        <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span class="text-slate-400 font-medium animate-pulse">Đang đồng bộ dữ liệu...</span>
    </div>

    <div v-else-if="!borrows.length" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm text-center">
      <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mb-6">📚</div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">Chưa có lịch sử mượn</h3>
      <p class="text-slate-500 mb-8 max-w-md mx-auto">Hành trình tri thức của bạn chưa bắt đầu. Hãy ghé thăm thư viện và chọn cuốn sách đầu tiên nhé!</p>
      <router-link to="/library" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-200 hover:-translate-y-1 transform">
        Khám phá kho sách
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="item in borrows" 
        :key="item._id" 
        class="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div class="absolute left-6 top-0 h-1 w-20 rounded-b-lg" :class="statusColor(item.status)"></div>

        <div class="flex flex-col md:flex-row gap-6 mt-2">
          
          <div class="w-full md:w-28 flex-shrink-0">
            <div class="aspect-[2/3] rounded-2xl overflow-hidden shadow-md border border-slate-100 relative group-hover:shadow-lg transition">
              <img 
                :src="item.bookImage || 'https://placehold.co/100x140?text=Sách'" 
                class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-between">
            <div>
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div>
                  <h3 class="font-bold text-xl text-slate-800 leading-tight group-hover:text-indigo-600 transition mb-1">
                    {{ item.bookTitle }}
                  </h3>
                  <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span class="bg-slate-50 px-2 py-1 rounded border border-slate-100">ID: {{ item._id.slice(-6).toUpperCase() }}</span>
                  </div>
                </div>
                
                <span class="self-start px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 shadow-sm" :class="statusBadge(item.status)">
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ statusText(item.status) }}
                </span>
              </div>

              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="flex flex-col">
                  <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Ngày tạo phiếu</span>
                  <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {{ fmt(item.createdAt) }}
                  </div>
                </div>

                <div class="flex flex-col">
                  <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Ngày nhận sách</span>
                  <div class="flex items-center gap-2 text-sm font-semibold" :class="item.ngayMuon ? 'text-indigo-600' : 'text-slate-400'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    {{ item.ngayMuon ? fmt(item.ngayMuon) : '--' }}
                  </div>
                </div>

                <div class="flex flex-col">
                  <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Hạn trả</span>
                  <div class="flex items-center gap-2 text-sm font-semibold" :class="isOverdue(item) ? 'text-rose-600' : (item.dueDate ? 'text-slate-700' : 'text-slate-400')">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{{ item.dueDate ? fmt(item.dueDate) : '--' }}</span>
                    <span v-if="isOverdue(item)" class="flex h-2 w-2 relative">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  </div>
                </div>

                <div class="flex flex-col">
                  <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Ngày trả</span>
                  <div class="flex items-center gap-2 text-sm font-semibold" :class="item.ngayTra ? 'text-emerald-600' : 'text-slate-400'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ item.ngayTra ? fmt(item.ngayTra) : '--' }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="isOverdue(item)" class="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-2 rounded-lg text-xs font-bold border border-rose-100">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               Đã quá hạn trả sách! Vui lòng trả sách sớm để tránh bị phạt.
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
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'approved') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (s === 'borrowed') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
    borrows.value = await BorrowService.list();
  } catch (e) {
    showToast("Lỗi tải lịch sử", "error");
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <section class="space-y-6 animate-fade-in pb-20">
    
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Quản lý Phiếu Mượn</h2>
        <p class="text-sm text-slate-500 mt-1">Theo dõi và xử lý các yêu cầu mượn trả sách.</p>
      </div>

      <div class="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button 
          v-for="s in statusOptions" 
          :key="s.value"
          @click="changeStatus(s.value)"
          class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2"
          :class="currentStatus === s.value 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'"
        >
          <span>{{ s.label }}</span>
          <span v-if="currentStatus === s.value" class="bg-white/20 px-1.5 rounded text-[10px]">{{ filteredCount }}</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
                v-model="searchText"
                type="text" 
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                placeholder="Tìm kiếm theo Tên độc giả, Mã ĐG, hoặc Tên sách..."
            >
        </div>
        <div class="text-xs text-slate-400 font-medium">
            Hiển thị {{ paginatedRows.length }} / {{ processedRows.length }} kết quả
        </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
      
      <div v-if="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
         <div class="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider sticky top-0 backdrop-blur-sm z-9">
            <tr>
              <th class="p-4 pl-6">Độc giả</th>
              <th class="p-4">Sách mượn</th>
              <th class="p-4">Thời gian</th>
              <th class="p-4 text-center">Trạng thái</th>
              <th class="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in paginatedRows" :key="r._id" class="hover:bg-slate-50 transition group">
              
              <td class="p-4 pl-6 align-top">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm flex-shrink-0">
                    {{ (r.readerName || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800">{{ r.readerName || 'Unknown' }}</div>
                    <div class="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <span class="bg-slate-100 px-1.5 rounded">ID: {{ r.maDocGia ? r.maDocGia.slice(-4) : '---' }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="p-4 align-top">
                <div class="flex gap-3">
                   <div class="w-10 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-slate-100">
                       <img :src="r.bookImage || 'https://placehold.co/40x60?text=Book'" class="w-full h-full object-cover" />
                   </div>
                   <div class="max-w-[200px]">
                      <div class="font-bold text-slate-700 leading-tight line-clamp-2" :title="r.bookTitle">{{ r.bookTitle }}</div>
                      <div class="text-xs text-slate-400 mt-1">Copy: 1 cuốn</div>
                   </div>
                </div>
              </td>

              <td class="p-4 align-top">
                <div class="space-y-2">
                    <div class="flex items-center gap-2 text-xs">
                        <span class="w-16 text-slate-400 font-medium uppercase text-[10px]">Ngày mượn</span>
                        <span class="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {{ fmt(r.ngayMuon || r.createdAt) }}
                        </span>
                    </div>
                    <div v-if="r.dueDate" class="flex items-center gap-2 text-xs">
                        <span class="w-16 text-slate-400 font-medium uppercase text-[10px]">Hạn trả</span>
                        <span class="font-mono px-2 py-0.5 rounded border" :class="isOverdue(r) ? 'bg-rose-50 text-rose-600 border-rose-100 font-bold' : 'bg-slate-50 text-slate-600 border-slate-100'">
                            {{ fmt(r.dueDate) }}
                        </span>
                    </div>
                </div>
              </td>

              <td class="p-4 text-center align-top">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm uppercase tracking-wide" :class="statusClass(r.status)">
                  {{ statusText(r.status) }}
                </span>
                <div v-if="r.staffName" class="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <span>by</span>
                    <span class="font-semibold text-slate-500 bg-slate-100 px-1.5 rounded">{{ r.staffName }}</span>
                </div>
              </td>

              <td class="p-4 text-center align-middle">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    v-if="r.status === 'pending'" 
                    @click="approve(r)"
                    class="btn-icon text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    title="Duyệt yêu cầu"
                  >
                    <span class="text-lg">✓</span>
                  </button>

                  <button 
                    v-if="['pending', 'approved'].includes(r.status)" 
                    @click="borrowed(r)"
                    class="btn-icon text-blue-600 bg-blue-50 hover:bg-blue-100"
                    title="Xác nhận đã giao sách"
                  >
                    <span class="text-lg">📖</span>
                  </button>

                  <button 
                    v-if="r.status === 'borrowed'" 
                    @click="returned(r)"
                    class="btn-icon text-slate-600 bg-slate-100 hover:bg-slate-200"
                    title="Xác nhận trả sách"
                  >
                    <span class="text-lg">↩️</span>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!paginatedRows.length">
              <td colspan="5" class="py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                    <span class="text-4xl mb-2">📭</span>
                    <span>Không tìm thấy phiếu mượn nào.</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="totalPages > 1" class="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
         <span class="text-xs text-slate-500 font-medium">Trang {{ currentPage }} / {{ totalPages }}</span>
         <div class="flex gap-2">
            <button 
                @click="currentPage--" 
                :disabled="currentPage===1" 
                class="px-3 py-1.5 border rounded-lg bg-white hover:bg-indigo-50 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Trước
            </button>
            <button 
                @click="currentPage++" 
                :disabled="currentPage===totalPages" 
                class="px-3 py-1.5 border rounded-lg bg-white hover:bg-indigo-50 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Sau
            </button>
         </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import BorrowService from "@/services/borrow.service";
import { showToast } from "@/stores/toast";

// State
const rows = ref([]); // Dữ liệu gốc
const currentStatus = ref(""); // Filter trạng thái
const searchText = ref(""); // Filter tìm kiếm
const currentPage = ref(1);
const pageSize = ref(20); // Số dòng mỗi trang
const loading = ref(false);

const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'borrowed', label: 'Đang mượn' },
    { value: 'returned', label: 'Đã trả' }
];

// Helper Functions
function statusClass(s) {
  switch (s) {
    case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
    case "approved": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "borrowed": return "bg-blue-50 text-blue-700 border-blue-200";
    case "returned": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default: return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function statusText(s) {
  switch (s) {
    case "pending": return "Chờ duyệt";
    case "approved": return "Đã duyệt";
    case "borrowed": return "Đang đọc";
    case "returned": return "Đã trả";
    default: return s;
  }
}

function fmt(d) {
  return d ? new Date(d).toLocaleDateString('vi-VN') : "--";
}

function isOverdue(r) {
  return r.status === "borrowed" && r.dueDate && new Date(r.dueDate) < new Date();
}

// Logic Load Data
async function reload() {
  loading.value = true;
  // Load tất cả về Client rồi lọc (Client-side filtering)
  // Backend nên hỗ trợ lấy all, hoặc lọc status
  const params = {};
  if (currentStatus.value) params.status = currentStatus.value;
  
  try {
    rows.value = await BorrowService.list(params);
    currentPage.value = 1;
  } catch(e) {
    showToast("Lỗi tải dữ liệu", "error");
  } finally {
    loading.value = false;
  }
}

function changeStatus(s) {
  currentStatus.value = s;
  searchText.value = ""; // Reset tìm kiếm khi đổi tab
  reload();
}

// Logic Filter & Search & Pagination
const processedRows = computed(() => {
    // 1. Lọc theo Status (Đã lọc từ API khi gọi reload, nhưng lọc thêm ở đây nếu rows chứa all)
    let data = rows.value;
    
    // 2. Lọc theo Search Text (Tìm tên đọc giả, tên sách, mã độc giả)
    if (searchText.value) {
        const lower = searchText.value.toLowerCase();
        data = data.filter(r => 
            (r.readerName && r.readerName.toLowerCase().includes(lower)) ||
            (r.bookTitle && r.bookTitle.toLowerCase().includes(lower)) ||
            (r.maDocGia && r.maDocGia.toString().toLowerCase().includes(lower))
        );
    }
    return data;
});

const filteredCount = computed(() => processedRows.value.length);

const totalPages = computed(() => Math.ceil(processedRows.value.length / pageSize.value) || 1);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return processedRows.value.slice(start, start + pageSize.value);
});

// Watch search để reset page
watch(searchText, () => currentPage.value = 1);

onMounted(reload);

// Actions
async function approve(r) {
  if(!confirm("Duyệt yêu cầu mượn sách này?")) return;
  try { await BorrowService.approve(r._id); showToast("Đã duyệt!", "success"); reload(); } 
  catch (e) { showToast(e.message, "error"); }
}
async function borrowed(r) {
  if(!confirm("Xác nhận độc giả đã đến nhận sách?")) return;
  try { await BorrowService.markBorrowed(r._id); showToast("Xác nhận giao sách!", "success"); reload(); } 
  catch (e) { showToast(e.message, "error"); }
}
async function returned(r) {
  if(!confirm("Xác nhận độc giả đã trả sách?")) return;
  try { await BorrowService.markReturned(r._id); showToast("Xác nhận trả sách!", "success"); reload(); } 
  catch (e) { showToast(e.message, "error"); }
}
</script>

<style scoped>

/* Custom Scrollbar cho table nếu cần */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>
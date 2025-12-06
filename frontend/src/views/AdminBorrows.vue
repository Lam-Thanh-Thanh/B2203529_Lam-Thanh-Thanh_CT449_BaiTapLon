<template>
  <section class="space-y-6 animate-fade-in">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <h2 class="text-2xl font-bold text-slate-800">Quản lý Phiếu Mượn</h2>
      
      <div class="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
        <button 
          v-for="s in ['all', 'pending', 'approved', 'borrowed', 'returned']" 
          :key="s"
          @click="changeStatus(s)"
          class="px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all"
          :class="currentStatus === (s === 'all' ? '' : s) 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'"
        >
          {{ s === 'all' ? 'Tất cả' : s }}
        </button>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th class="p-4 pl-6">Độc giả</th>
              <th class="p-4">Sách mượn</th>
              <th class="p-4 text-center">Trạng thái</th>
              <th class="p-4">Thời gian</th>
              <th class="p-4">Người duyệt</th>
              <th class="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in paginatedRows" :key="r._id" class="hover:bg-slate-50/80 transition group">
              <td class="p-4 pl-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-white shadow-sm">
                    {{ (r.readerName || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-semibold text-slate-800">{{ r.readerName || 'Không rõ' }}</div>
                    <div class="text-[10px] text-slate-400 font-mono tracking-tight">{{ r.maDocGia }}</div>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <div class="flex items-center gap-3">
                   <img 
                      :src="r.bookImage || 'https://placehold.co/40x60?text=Sách'" 
                      class="w-8 h-10 object-cover rounded shadow-sm border border-slate-100"
                   />
                   <div class="max-w-[180px]">
                      <div class="font-medium text-slate-700 truncate" :title="r.bookTitle">{{ r.bookTitle || 'Sách đã xóa' }}</div>
                   </div>
                </div>
              </td>

              <td class="p-4 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm" :class="statusClass(r.status)">
                  {{ statusText(r.status) }}
                </span>
                <div v-if="isOverdue(r)" class="text-[10px] text-rose-600 font-bold mt-1 flex items-center justify-center gap-1">
                  <span>⚠️</span> Quá hạn
                </div>
              </td>

              <td class="p-4">
                <div class="text-xs space-y-1">
                  <div class="flex items-center gap-2 text-slate-600">
                    <span class="w-16 text-slate-400">Mượn:</span> 
                    <span class="font-mono">{{ fmt(r.ngayMuon || r.createdAt) }}</span>
                  </div>
                  <div v-if="r.dueDate" class="flex items-center gap-2" :class="isOverdue(r) ? 'text-rose-600 font-bold' : 'text-slate-600'">
                    <span class="w-16 text-slate-400">Hạn trả:</span> 
                    <span class="font-mono">{{ fmt(r.dueDate) }}</span>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <div v-if="r.staffName" class="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                  <span>🛡️</span> {{ r.staffName }}
                </div>
                <span v-else class="text-xs text-slate-400 italic">--</span>
              </td>

              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    v-if="r.status === 'pending'" 
                    @click="approve(r)"
                    class="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 hover:shadow-md transition"
                    title="Duyệt phiếu"
                  >
                    <span class="text-lg">✓</span>
                  </button>

                  <button 
                    v-if="['pending', 'approved'].includes(r.status)" 
                    @click="borrowed(r)"
                    class="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:shadow-md transition"
                    title="Xác nhận đã lấy sách"
                  >
                    <span class="text-lg">📖</span>
                  </button>

                  <button 
                    v-if="r.status === 'borrowed'" 
                    @click="returned(r)"
                    class="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 hover:shadow-md transition"
                    title="Xác nhận trả sách"
                  >
                    <span class="text-lg">↩️</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paginatedRows.length">
              <td colspan="6" class="p-8 text-center text-slate-400">
                Không có dữ liệu phiếu mượn.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="totalPages > 1" class="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
         <span class="text-xs text-slate-500">Trang {{ currentPage }} / {{ totalPages }}</span>
         <div class="flex gap-2">
            <button @click="currentPage--" :disabled="currentPage===1" class="px-3 py-1 border rounded bg-white hover:bg-slate-50 text-xs disabled:opacity-50">Trước</button>
            <button @click="currentPage++" :disabled="currentPage===totalPages" class="px-3 py-1 border rounded bg-white hover:bg-slate-50 text-xs disabled:opacity-50">Sau</button>
         </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";
import { showToast } from "@/stores/toast";

const currentStatus = ref("");
const rows = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);

function statusClass(s) {
  switch (s) {
    case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
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
    case "borrowed": return "Đang mượn";
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

async function reload() {
  const params = {};
  if (currentStatus.value) params.status = currentStatus.value;
  try {
    rows.value = await BorrowService.list(params);
    currentPage.value = 1;
  } catch(e) {
    showToast("Lỗi tải dữ liệu", "error");
  }
}

function changeStatus(s) {
  currentStatus.value = s === 'all' ? '' : s;
  reload();
}

onMounted(reload);

// Pagination Logic
const totalPages = computed(() => Math.ceil(rows.value.length / pageSize.value) || 1);
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return rows.value.slice(start, start + pageSize.value);
});

// Actions
async function approve(r) {
  try { await BorrowService.approve(r._id); showToast("Đã duyệt!", "success"); reload(); } 
  catch (e) { showToast(e.message, "error"); }
}
async function borrowed(r) {
  try { await BorrowService.markBorrowed(r._id); showToast("Xác nhận đã mượn!", "success"); reload(); } 
  catch (e) { showToast(e.message, "error"); }
}
async function returned(r) {
  try { await BorrowService.markReturned(r._id); showToast("Xác nhận đã trả!", "success"); reload(); } 
  catch (e) { showToast(e.message, "error"); }
}
</script>
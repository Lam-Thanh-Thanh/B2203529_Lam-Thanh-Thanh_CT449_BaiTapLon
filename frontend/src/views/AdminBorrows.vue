<template>
  <section>
    <h2 class="text-xl font-semibold mb-3">Quản lý phiếu mượn</h2>

    <div class="bg-white border rounded-xl p-4 shadow-sm">
      <div class="flex flex-col gap-2 mb-3 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-2 items-center">
          <span class="text-sm text-slate-600">Trạng thái:</span>
          <select class="border rounded-lg p-2 text-sm" v-model="status" @change="reload">
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="borrowed">Đang mượn</option>
            <option value="returned">Đã trả</option>
          </select>
          <button class="px-3 py-2 text-xs rounded-lg border hover:bg-slate-50" @click="reload">
            Làm mới
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border text-sm">
          <thead>
            <tr class="bg-slate-50">
              <th class="border p-2 text-left">Độc giả</th>
              <th class="border p-2 text-left">Sách</th>
              <th class="border p-2 text-center">NV Xử lý</th> <th class="border p-2 text-center" @click="setSort('status')">Trạng thái</th>
              <th class="border p-2 text-center" @click="setSort('ngayMuon')">Ngày mượn</th>
              <th class="border p-2 text-center">Hạn trả</th>
              <th class="border p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in paginatedRows" :key="r._id">
              <td class="border p-2">
                <div class="font-semibold">{{ r.readerName || 'Không rõ' }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ r.maDocGia }}</div>
              </td>
              <td class="border p-2">
                {{ r.bookTitle || 'Sách đã xóa' }}
              </td>
              <td class="border p-2 text-center text-indigo-600 font-medium">
                {{ r.staffName || '-' }}
              </td>

              <td class="border p-2 text-center">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(r.status)">
                  {{ r.status }}
                </span>
              </td>
              <td class="border p-2 text-center text-xs">
                {{ fmt(r.ngayMuon) }}
              </td>
              <td class="border p-2 text-center text-xs">
                {{ fmt(r.dueDate) }}
                <div v-if="isOverdue(r)" class="text-[11px] text-rose-600 mt-1">Quá hạn!</div>
              </td>
              <td class="border p-2 text-center">
                <div class="flex flex-wrap gap-1 justify-center text-xs">
                  <button v-if="r.status === 'pending'" class="px-2 py-1 border rounded hover:bg-green-50 text-green-700" @click="approve(r)">
                    Duyệt
                  </button>
                  <button v-if="['pending', 'approved'].includes(r.status)" class="px-2 py-1 border rounded hover:bg-blue-50 text-blue-700" @click="borrowed(r)">
                    Đã mượn
                  </button>
                  <button v-if="r.status === 'borrowed'" class="px-2 py-1 border rounded hover:bg-slate-50" @click="returned(r)">
                    Đã trả
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paginatedRows.length">
              <td colspan="7" class="border p-2 text-center text-slate-500">
                Không có phiếu mượn.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
       <div v-if="totalPages > 1" class="flex items-center justify-between mt-3 text-xs">
          </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";
import { showToast } from "@/stores/toast";

const status = ref("");
const rows = ref([]);

// Không cần load BookService nữa vì API đã trả về tên sách
const sortKey = ref("createdAt"); // Mặc định sort theo thời gian tạo mới nhất
const sortDir = ref("desc");
const currentPage = ref(1);
const pageSize = ref(10); // Tăng default size lên cho dễ nhìn

function fmt(d) {
  return d ? new Date(d).toLocaleString('vi-VN') : "";
}

function isOverdue(r) {
  return (
    r.status === "borrowed" &&
    r.dueDate &&
    new Date(r.dueDate).getTime() < Date.now()
  );
}

function statusClass(s) {
  switch (s) {
    case "pending": return "bg-gray-100 text-gray-700";
    case "approved": return "bg-yellow-100 text-yellow-800";
    case "borrowed": return "bg-blue-100 text-blue-800";
    case "returned": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-700";
  }
}

async function reload() {
  const params = {};
  if (status.value) params.status = status.value;
  rows.value = await BorrowService.list(params);
  currentPage.value = 1;
}

onMounted(async () => {
  await reload();
});

// Logic Sort & Pagination giữ nguyên nhưng tối ưu sortKey
const sortedRows = computed(() => {
  const arr = [...rows.value];
  arr.sort((a, b) => {
    let va = a[sortKey.value];
    let vb = b[sortKey.value];
    
    // Xử lý ngày tháng
    if (['ngayMuon', 'createdAt', 'dueDate', 'ngayTra'].includes(sortKey.value)) {
        va = va ? new Date(va).getTime() : 0;
        vb = vb ? new Date(vb).getTime() : 0;
    }

    if (va == null && vb == null) return 0;
    if (va == null) return sortDir.value === "asc" ? 1 : -1;
    if (vb == null) return sortDir.value === "asc" ? -1 : 1;

    if (typeof va === "number" && typeof vb === "number") {
      return sortDir.value === "asc" ? va - vb : vb - va;
    }

    const sa = String(va).toLowerCase();
    const sb = String(vb).toLowerCase();
    if (sa < sb) return sortDir.value === "asc" ? -1 : 1;
    if (sa > sb) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
  return arr;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
);

const paginatedRows = computed(() => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedRows.value.slice(start, start + pageSize.value);
});

function setSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

// Actions
async function approve(r) {
  try {
    await BorrowService.approve(r._id);
    showToast("Đã duyệt phiếu mượn", "success");
    await reload();
  } catch (e) {
    showToast("Lỗi duyệt: " + e.message, "error");
  }
}
async function borrowed(r) {
  try {
    await BorrowService.markBorrowed(r._id);
    showToast("Đã xác nhận mượn", "success");
    await reload();
  } catch (e) {
    showToast("Lỗi xác nhận: " + e.message, "error");
  }
}
async function returned(r) {
  try {
    await BorrowService.markReturned(r._id);
    showToast("Đã trả sách", "success");
    await reload();
  } catch (e) {
    showToast("Lỗi trả sách: " + e.message, "error");
  }
}
</script>
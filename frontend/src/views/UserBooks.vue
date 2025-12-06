<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h2 class="text-2xl font-bold text-slate-800">📚 Thư viện sách</h2>
      
      <div class="flex w-full md:w-auto gap-2">
        <div class="relative flex-1 md:w-80">
          <span class="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input
            v-model="q"
            class="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Tìm tên sách, tác giả..."
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div 
        v-for="b in filteredBooks" 
        :key="b._id"
        class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col"
      >
        <div class="relative aspect-[2/3] overflow-hidden bg-slate-100">
          <img 
            :src="b.image || 'https://placehold.co/400x600?text=No+Cover'" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Book cover"
          />
          <div class="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold shadow-sm"
            :class="(b.copies > 0) ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'">
            {{ b.copies > 0 ? `Còn ${b.copies}` : 'Hết hàng' }}
          </div>
        </div>

        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-slate-800 line-clamp-2 min-h-[3rem] mb-1" :title="b.title">
            {{ b.title }}
          </h3>
          <p class="text-sm text-slate-500 mb-2">{{ b.author }}</p>
          
          <div class="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
            <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
              {{ b.publishedYear || 'N/A' }}
            </span>
            
            <button
              @click="borrow(b)"
              :disabled="!canBorrow(b)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              :class="canBorrow(b) 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
            >
              <span>Mượn sách</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && filteredBooks.length === 0" class="text-center py-20">
      <div class="text-4xl mb-2">cS</div>
      <p class="text-slate-500">Không tìm thấy cuốn sách nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";
import { auth } from "@/stores/auth";
import { showToast } from "@/stores/toast";

const books = ref([]);
const q = ref("");
const loading = ref(true);

function canBorrow(b) {
  return auth.readerId() && (b.copies ?? 0) > 0;
}

onMounted(async () => {
  try {
    books.value = await BookService.getAll();
  } finally {
    loading.value = false;
  }
});

const filteredBooks = computed(() => {
  if (!q.value) return books.value;
  const key = q.value.toLowerCase();
  return books.value.filter((b) => 
    b.title?.toLowerCase().includes(key) || 
    b.author?.toLowerCase().includes(key)
  );
});

async function borrow(b) {
  if (!auth.readerId()) {
    showToast("Vui lòng đăng nhập để mượn sách.", "error");
    return;
  }
  try {
    await BorrowService.create({ maSach: b._id });
    showToast(`Đã gửi yêu cầu mượn: ${b.title}`, "success");
  } catch (e) {
    showToast(e.response?.data?.message || "Lỗi mượn sách", "error");
  }
}
</script>
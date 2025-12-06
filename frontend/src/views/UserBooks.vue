<template>
  <div class="space-y-8">
    <div class="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
      <div class="max-w-2xl mx-auto text-center space-y-6">
        <h1 class="text-3xl font-bold">Khám phá tri thức</h1>
        <p class="text-indigo-100">Hàng ngàn cuốn sách đang chờ bạn.</p>
        
        <div class="relative max-w-lg mx-auto">
          <input 
            v-model="searchText"
            type="text"
            placeholder="Tìm kiếm sách, tác giả..."
            class="w-full pl-12 pr-4 py-4 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 shadow-lg placeholder:text-slate-400"
          />
          <span class="absolute left-4 top-4 text-xl opacity-50 text-slate-800">🔍</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Đang tải sách...</div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div 
        v-for="book in filteredBooks" 
        :key="book._id"
        class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
      >
        <div class="relative aspect-[2/3] overflow-hidden bg-slate-100">
          <img 
            :src="book.image || 'https://placehold.co/400x600?text=No+Cover'" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-2 right-2">
            <span v-if="book.copies > 0" class="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-sm">
              Còn {{ book.copies }}
            </span>
            <span v-else class="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-md shadow-sm">
              Hết hàng
            </span>
          </div>
        </div>

        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-slate-800 line-clamp-2 mb-1 min-h-[3rem]" :title="book.title">
            {{ book.title }}
          </h3>
          <p class="text-xs text-slate-500 mb-4">{{ book.author }}</p>

          <div class="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400">{{ book.publishedYear || 'N/A' }}</span>
            <button 
              @click="handleBorrow(book)"
              :disabled="book.copies <= 0"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              :class="book.copies > 0 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
            >
              {{ book.copies > 0 ? 'Mượn sách' : 'Tạm hết' }}
            </button>
          </div>
        </div>
      </div>
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
const searchText = ref("");
const loading = ref(true);

const filteredBooks = computed(() => {
  if (!searchText.value) return books.value;
  const k = searchText.value.toLowerCase();
  return books.value.filter(b => 
    b.title.toLowerCase().includes(k) || 
    b.author.toLowerCase().includes(k)
  );
});

async function handleBorrow(book) {
  if (!auth.user) {
    showToast("Vui lòng đăng nhập để mượn sách", "error");
    return;
  }
  if (!confirm(`Bạn muốn mượn sách "${book.title}"?`)) return;

  try {
    await BorrowService.create({ maSach: book._id, maDocGia: auth.readerId() });
    showToast("Đã gửi yêu cầu mượn thành công!", "success");
  } catch (e) {
    showToast(e.response?.data?.message || "Lỗi khi mượn sách", "error");
  }
}

onMounted(async () => {
  try {
    books.value = await BookService.getAll();
  } finally {
    loading.value = false;
  }
});
</script>
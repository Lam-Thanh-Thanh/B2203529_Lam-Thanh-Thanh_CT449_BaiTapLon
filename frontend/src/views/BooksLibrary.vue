<template>
  <div class="space-y-12 pb-10">
    
    <div class="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/20 isolate">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      
      <div class="relative px-6 py-20 md:py-24 text-center z-10">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          Thư viện tri thức <br class="hidden md:block" />
          <span class="text-indigo-200">trong tầm tay bạn</span>
        </h1>
        <p class="text-indigo-100 text-lg max-w-2xl mx-auto mb-10 font-light">
          Khám phá hàng ngàn đầu sách hấp dẫn, từ văn học kinh điển đến khoa học hiện đại. 
          Đăng ký mượn sách ngay hôm nay.
        </p>
        
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:bg-white/30 transition duration-500"></div>
          <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex shadow-xl">
            <span class="pl-4 flex items-center text-white/70 text-xl">🔍</span>
            <input 
              v-model="searchText"
              type="text"
              placeholder="Tìm kiếm tên sách, tác giả..."
              class="w-full bg-transparent border-none text-white placeholder-white/60 px-4 py-3 focus:outline-none focus:ring-0 text-lg font-medium"
            />
            <button class="bg-white text-indigo-700 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition shadow-md">
              Tìm
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-xl">📚</span>
          Sách mới cập nhật
        </h2>
        <span class="text-slate-500 text-sm font-medium">Hiển thị {{ filteredBooks.length }} kết quả</span>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div v-for="i in 5" :key="i" class="animate-pulse space-y-3">
          <div class="bg-slate-200 aspect-[2/3] rounded-2xl"></div>
          <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          <div class="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="!filteredBooks.length" class="text-center py-20">
        <div class="text-6xl mb-4">🤔</div>
        <h3 class="text-xl font-bold text-slate-700">Không tìm thấy sách</h3>
        <p class="text-slate-500">Thử tìm kiếm với từ khóa khác xem sao.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
        <div 
          v-for="book in filteredBooks" 
          :key="book._id"
          class="group relative flex flex-col"
        >
          <div class="relative aspect-[2/3] mb-4 overflow-hidden rounded-2xl bg-slate-100 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
            <img 
              :src="book.image || 'https://placehold.co/400x600?text=No+Cover'" 
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
              <span v-if="book.copies > 0" class="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm">
                Còn hàng
              </span>
              <span v-else class="px-2.5 py-1 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm">
                Hết sách
              </span>
            </div>

            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <button 
                @click="goToDetails(book._id)"
                class="bg-white text-indigo-700 font-bold py-2.5 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          <div class="flex-1 flex flex-col">
            <h3 class="font-bold text-slate-800 text-lg leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors" :title="book.title">
              {{ book.title }}
            </h3>
            <p class="text-sm text-slate-500 font-medium mb-3">{{ book.author }}</p>
            
            <div class="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
              <div class="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                <span>🗓️</span> {{ book.publishedYear || 'N/A' }}
              </div>
              <div class="text-xs font-bold" :class="book.copies > 0 ? 'text-emerald-600' : 'text-rose-500'">
                SL: {{ book.copies }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import useRouter
import BookService from "@/services/book.service";
import { showToast } from "@/stores/toast";

const books = ref([]);
const searchText = ref("");
const loading = ref(true);
const router = useRouter(); // Khởi tạo router

const filteredBooks = computed(() => {
  if (!searchText.value) return books.value;
  const k = searchText.value.toLowerCase();
  return books.value.filter(b => 
    b.title.toLowerCase().includes(k) || 
    b.author.toLowerCase().includes(k)
  );
});

// Hàm chuyển hướng sang trang chi tiết
function goToDetails(id) {
  router.push({ name: 'book.details', params: { id } });
}

onMounted(async () => {
  try {
    books.value = await BookService.getAll();
  } catch (e) {
    console.error(e);
    showToast("Không thể tải danh sách sách", "error");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Hiệu ứng Blob Animation cho background */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
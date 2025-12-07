<template>
  <div class="book-library-page bg-slate-50 min-h-screen pb-20">
    
    <div class="relative pt-32 pb-40 overflow-hidden bg-slate-900">
        <div class="absolute inset-0">
            <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
            <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10 text-center">
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight" data-aos="fade-up">
                Khám phá <br class="md:hidden" />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tri Thức Vô Tận</span>
            </h1>
            
            <p class="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed" data-aos="fade-up" data-aos-delay="100">
                Hàng ngàn đầu sách hay đang chờ bạn. <br class="hidden md:block" /> 
                Tìm kiếm, tra cứu và đặt mượn chỉ trong vài giây.
            </p>

            <div class="max-w-3xl mx-auto relative group" data-aos="zoom-in" data-aos-delay="200">
                <div class="relative flex items-center p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:bg-white/15 focus-within:bg-white/20 focus-within:ring-4 focus-within:ring-indigo-500/20">
                    <div class="pl-4 pr-3 text-slate-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        v-model="searchText"
                        type="text" 
                        class="w-full bg-transparent border-none text-white placeholder-slate-400 text-lg focus:outline-none focus:ring-0 px-2 py-3" 
                        placeholder="Nhập tên sách, tác giả hoặc thể loại..." 
                    >
                    <button class="hidden sm:block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-indigo-500/40 transform hover:scale-105 whitespace-nowrap">
                        Tìm kiếm
                    </button>
                </div>
                <button class="sm:hidden mt-4 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Tìm kiếm</button>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 -mt-16 relative z-20">
        <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 min-h-[500px]">
            
            <div class="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span class="text-2xl">📚</span> Danh mục sách
                </h2>
                <span class="text-sm text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full font-bold border border-indigo-100">
                    {{ filteredBooks.length }} kết quả
                </span>
            </div>

            <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <div v-for="n in 10" :key="n" class="animate-pulse">
                    <div class="bg-slate-200 aspect-[2/3] rounded-2xl mb-3"></div>
                    <div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>

            <div v-else-if="filteredBooks.length === 0" class="text-center py-20">
                <div class="text-6xl mb-4 grayscale opacity-30">🔍</div>
                <h3 class="text-xl font-bold text-slate-600">Không tìm thấy sách nào</h3>
                <p class="text-slate-400 mt-2">Vui lòng thử tìm kiếm với từ khóa khác.</p>
            </div>

            <div v-else>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            <div 
                v-for="(book, index) in paginatedBooks" 
                :key="book._id"
                class="group relative flex flex-col h-full bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                :data-aos-delay="(index % 10) * 50" 
            >
            <div class="cursor-pointer aspect-[2/3] rounded-xl overflow-hidden relative bg-slate-100 mb-3" @click="goToDetails(book._id)">
                <img 
                    :src="book.image || 'https://placehold.co/400x600?text=No+Cover'" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                >
            <div class="absolute top-2 right-2 flex flex-col items-end gap-1">
                    <span v-if="book.copies > 0" class="px-2 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm">
                    Còn hàng
                </span>
                <span v-else class="px-2 py-1 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm">
                    Hết sách
                </span>
            </div>

            <div class="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button 
                    @click="goToDetails(book._id)"
                    class="cursor-pointer w-full py-2 bg-white text-indigo-900 font-bold rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-xs hover:bg-indigo-50"
                >
                    Xem chi tiết
                </button>
            </div>
        </div>

        <div class="flex-1 flex flex-col px-1">
            <h3 class="font-bold text-slate-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors cursor-pointer" @click="goToDetails(book._id)" :title="book.title">
                {{ book.title }}
            </h3>
            
            <p class="text-xs text-slate-500 mb-2">{{ book.author }}</p>
            <div class="flex flex-wrap gap-1 mb-2" v-if="book.tags && book.tags.length > 0">
                <span 
                    v-for="tag in book.tags.slice(0, 3)" 
                    :key="tag" 
                    class="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 whitespace-nowrap"
                >
                    #{{ tag }}
                </span>
                <span v-if="book.tags.length > 3" class="text-[10px] text-slate-400">+{{book.tags.length - 3}}</span>
            </div>
            <div class="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-1">
                <div class="text-lg font-extrabold text-red-600">
                    {{ book.price ? book.price.toLocaleString() + ' đ' : 'Miễn phí' }}
                </div>
                
                <div class="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span class="bg-slate-100 px-2 py-1 rounded font-medium text-slate-600">
                        Năm: {{ book.publishedYear || 'N/A' }}
                    </span>
                    <span class="font-bold flex items-center gap-1" :class="book.copies > 0 ? 'text-emerald-600' : 'text-rose-500'">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        SL: {{ book.copies }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

                <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 gap-2">
                    <button 
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &larr;
                    </button>

                    <div class="flex gap-2">
                        <button 
                            v-for="page in displayedPages" 
                            :key="page"
                            @click="changePage(page)"
                            class="w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition"
                            :class="page === currentPage 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
                        >
                            {{ page }}
                        </button>
                    </div>

                    <button 
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &rarr;
                    </button>
                </div>
                
                <div v-if="totalPages > 1" class="text-center mt-4 text-xs text-slate-400">
                    Trang {{ currentPage }} / {{ totalPages }}
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import BookService from "@/services/book.service";
import { showToast } from "@/stores/toast";
import AOS from 'aos';
import 'aos/dist/aos.css';

const books = ref([]);
const searchText = ref("");
const loading = ref(true);
const router = useRouter();

// --- PAGINATION LOGIC ---
const currentPage = ref(1);
const itemsPerPage = 20; // Số sách mỗi trang

const filteredBooks = computed(() => {
  if (!searchText.value) return books.value;
  const k = searchText.value.toLowerCase();
  return books.value.filter(b => 
    b.title.toLowerCase().includes(k) || 
    b.author.toLowerCase().includes(k) ||
    (Array.isArray(b.tags) && b.tags.some(tag => tag.toLowerCase().includes(k)))  );
});

// Tính tổng số trang
const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage));

// Lấy danh sách sách của trang hiện tại
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBooks.value.slice(start, end);
});

// Tính toán hiển thị số trang (để không hiện quá nhiều số nếu có 100 trang)
const displayedPages = computed(() => {
    const delta = 2; // Số trang hiện bên cạnh trang hiện tại
    const range = [];
    for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
        range.push(i);
    }
    if (currentPage.value - delta > 2) range.unshift("...");
    if (currentPage.value + delta < totalPages.value - 1) range.push("...");
    
    // Luôn hiện trang đầu và trang cuối
    let pages = [1];
    if (totalPages.value > 1) {
        if(range.length > 0 && range[0] !== 2 && range[0] !== "...") {
             // Logic đơn giản hóa: nếu ít trang thì hiện hết
             if(totalPages.value <= 7) {
                 pages = Array.from({length: totalPages.value}, (_, i) => i + 1);
                 return pages;
             }
        }
        
        // Logic phức tạp cho nhiều trang (đơn giản hóa cho bạn: chỉ hiện 1...5 hoặc all)
        // Nếu bạn muốn đơn giản:
        if (totalPages.value <= 5) return Array.from({length: totalPages.value}, (_, i) => i + 1);
        
        // Trả về danh sách đơn giản gồm trang hiện tại và lân cận
        const simpleRange = [];
        if (currentPage.value > 1) simpleRange.push(currentPage.value - 1);
        simpleRange.push(currentPage.value);
        if (currentPage.value < totalPages.value) simpleRange.push(currentPage.value + 1);
        
        // Đảm bảo luôn có 1 và last
        const final = new Set([1, ...simpleRange, totalPages.value]);
        return Array.from(final).sort((a,b) => a-b);
    }
    return pages;
});

// Khi đổi trang
function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        // Cuộn lên đầu danh sách sách
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }
}

// Khi tìm kiếm -> Reset về trang 1
watch(searchText, () => {
    currentPage.value = 1;
});

// --- END PAGINATION LOGIC ---

function goToDetails(id) {
  router.push({ name: 'book.details', params: { id } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(async () => {
  AOS.init({ once: true, offset: 50, duration: 600 });
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
</style>
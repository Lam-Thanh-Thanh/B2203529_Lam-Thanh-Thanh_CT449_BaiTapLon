<template>
  <div class="book-details-page bg-slate-50 min-h-screen pb-20">
    
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="text-sm font-medium text-slate-500 flex items-center gap-2">
          <router-link :to="{ name: 'home' }" class="hover:text-indigo-600 transition">Trang chủ</router-link>
          <span>/</span>
          <router-link :to="{ name: 'library' }" class="hover:text-indigo-600 transition">Thư viện</router-link>
          <span>/</span>
          <span class="text-slate-800 truncate max-w-[200px]">{{ book ? book.title : 'Đang tải...' }}</span>
        </nav>
      </div>
    </div>

    <div v-if="book" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      
      <div class="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 mb-10 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          
          <div class="md:col-span-5 lg:col-span-4" data-aos="fade-right">
            <div class="relative group rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[3/4]">
              <img 
                :src="book.image || 'https://placehold.co/400x600?text=No+Cover'" 
                class="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" 
                alt="Book Cover"
              >
              <div class="absolute top-4 left-4">
                <span v-if="book.copies > 0" class="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                  Sẵn sàng cho mượn
                </span>
                <span v-else class="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                  Tạm hết hàng
                </span>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 lg:col-span-8 flex flex-col" data-aos="fade-left">
            <div class="mb-6">
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 leading-tight">
                {{ book.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-sm mt-3">
                <span class="text-indigo-600 font-bold text-lg bg-indigo-50 px-3 py-1 rounded-lg">
                  {{ book.author }}
                </span>
                <span class="text-slate-400">|</span>
                <div class="flex items-center text-yellow-400 gap-1">
                  ★★★★★ <span class="text-slate-400 ml-1 text-xs">(120 đánh giá)</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Năm xuất bản</p>
                <p class="font-bold text-slate-800">{{ book.publishedYear }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Nhà xuất bản</p>
                <p class="font-bold text-slate-800">{{ book.publisher || 'NXB Kim Đồng' }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Giá bìa</p>
                <p class="font-bold text-slate-800">{{ book.price ? book.price.toLocaleString() : '---' }} đ</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Kho</p>
                <p class="font-bold text-indigo-600">{{ book.copies }} cuốn</p>
              </div>
            </div>

            <div class="flex-grow">
              <h3 class="font-bold text-slate-800 mb-2">Tóm tắt nội dung:</h3>
              <p class="text-slate-600 leading-relaxed line-clamp-4">
                {{ book.description || 'Cuốn sách này là một tác phẩm kinh điển, mang đến những góc nhìn mới mẻ và sâu sắc. Nội dung xoay quanh những chủ đề cốt lõi của cuộc sống, được tác giả diễn giải một cách tinh tế và đầy cảm xúc. Hãy mượn ngay để khám phá trọn vẹn câu chuyện.' }}
              </p>
            </div>

            <div class="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <button 
                @click="handleBorrow"
                :disabled="book.copies <= 0 || isBorrowing"
                class="flex-1 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <span v-if="isBorrowing" class="animate-spin">⏳</span>
                <span>{{ book.copies > 0 ? 'Đăng ký Mượn Sách' : 'Hết sách' }}</span>
              </button>
              
              <button class="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-rose-500 transition shadow-sm flex items-center gap-2 justify-center">
                <span>❤️</span> <span>Lưu yêu thích</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2" data-aos="fade-up">
          <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="flex border-b border-slate-100">
              <button 
                v-for="tab in ['Mô tả', 'Thông tin chi tiết', 'Đánh giá (12)']" 
                :key="tab"
                @click="activeTab = tab"
                class="px-6 py-4 text-sm font-bold transition border-b-2"
                :class="activeTab === tab ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 border-transparent hover:text-slate-700'"
              >
                {{ tab }}
              </button>
            </div>
            
            <div class="p-8 text-slate-600 leading-relaxed min-h-[200px]">
              <div v-if="activeTab === 'Mô tả'">
                <p class="mb-4">
                  Cuốn sách <strong>{{ book.title }}</strong> của tác giả <strong>{{ book.author }}</strong> là một trong những tác phẩm được yêu thích nhất tại thư viện.
                </p>
                <p>Nội dung sách được trình bày mạch lạc, logic, phù hợp với nhiều đối tượng độc giả. Sách không chỉ cung cấp kiến thức mà còn gợi mở nhiều suy ngẫm sâu sắc.</p>
              </div>
              <div v-else-if="activeTab === 'Thông tin chi tiết'">
                <ul class="space-y-2 text-sm">
                  <li class="flex"><span class="w-40 font-bold text-slate-800">Mã sách:</span> {{ book._id }}</li>
                  <li class="flex"><span class="w-40 font-bold text-slate-800">Ngôn ngữ:</span> Tiếng Việt</li>
                  <li class="flex"><span class="w-40 font-bold text-slate-800">Trọng lượng:</span> 300g</li>
                  <li class="flex"><span class="w-40 font-bold text-slate-800">Kích thước:</span> 14 x 20.5 cm</li>
                </ul>
              </div>
              <div v-else>
                <div class="space-y-6">
                  <div class="flex gap-4">
                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">A</div>
                    <div>
                      <h5 class="font-bold text-slate-800 text-sm">Nguyễn Văn A</h5>
                      <div class="text-yellow-400 text-xs mb-1">★★★★★</div>
                      <p class="text-sm">Sách rất hay, bìa đẹp, nội dung ý nghĩa. Thư viện phục vụ tốt.</p>
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <div class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center font-bold text-rose-600">B</div>
                    <div>
                      <h5 class="font-bold text-slate-800 text-sm">Trần Thị B</h5>
                      <div class="text-yellow-400 text-xs mb-1">★★★★☆</div>
                      <p class="text-sm">Nội dung hơi khó hiểu đoạn đầu nhưng càng đọc càng cuốn.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1" data-aos="fade-up" data-aos-delay="200">
          <h3 class="font-bold text-slate-800 mb-4 text-lg">Có thể bạn sẽ thích</h3>
          <div class="space-y-4">
            <div 
              v-for="rb in relatedBooks" 
              :key="rb.title" 
              class="group bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex gap-4 cursor-pointer"
            >
              <div class="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="rb.image" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div class="flex-1 min-w-0 py-1">
                <h4 class="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600">{{ rb.title }}</h4>
                <p class="text-xs text-slate-500 mb-2">{{ rb.author }}</p>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Có sẵn</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 font-medium">Đang tìm cuốn sách này...</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookService from '@/services/book.service';
import BorrowService from '@/services/borrow.service';
import { showToast } from '@/stores/toast';
import { auth } from '@/stores/auth';
import AOS from 'aos';

const route = useRoute();
const router = useRouter();
const book = ref(null);
const isBorrowing = ref(false);
const activeTab = ref('Mô tả');

const relatedBooks = [
  { title: "Nhà Giả Kim", author: "Paulo Coelho", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200" },
  { title: "Sapiens", author: "Yuval Noah Harari", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200" },
  { title: "Atomic Habits", author: "James Clear", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200" },
];

const fetchBook = async () => {
  book.value = null;
  const id = route.params.id;
  try {
    book.value = await BookService.get(id);
    setTimeout(() => AOS.refresh(), 100); 
  } catch (error) {
    console.error(error);
    showToast("Không tìm thấy sách hoặc lỗi kết nối", "error");
    router.push({ name: 'library' });
  }
};

const handleBorrow = async () => {
  if (!auth.user) {
    showToast("Vui lòng đăng nhập để mượn sách", "error");
    router.push('/login');
    return;
  }
  
  if (!confirm(`Xác nhận mượn cuốn: ${book.value.title}?`)) return;

  isBorrowing.value = true;
  try {
    // Chỉ gửi mã sách, backend tự lấy mã độc giả từ token
    await BorrowService.create({ maSach: book.value._id });
    showToast("Yêu cầu mượn thành công! Vui lòng chờ duyệt.", "success");
  } catch (e) {
    showToast(e.response?.data?.message || "Lỗi khi gửi yêu cầu", "error");
  } finally {
    isBorrowing.value = false;
  }
};

watch(() => route.params.id, fetchBook);

onMounted(() => {
  AOS.init();
  fetchBook();
});
</script>
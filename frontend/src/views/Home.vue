<template>
  <div class="home-page overflow-x-hidden bg-slate-50">
    
    <section class="relative h-[550px] lg:h-[650px] w-full">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :effect="'fade'"
        :loop="true"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        class="h-full w-full"
      >
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <div class="relative w-full h-full">
            <img :src="slide.image" class="w-full h-full object-cover" alt="Banner" />
            <div class="absolute inset-0 bg-slate-900/60"></div>
            
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="container mx-auto px-4 text-center text-white z-10 pb-20">
                <h2 
                  class="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-2xl"
                  data-aos="fade-up"
                >
                  {{ slide.title }}
                </h2>
                <p 
                  class="text-lg md:text-2xl text-slate-200 font-light mb-10 max-w-3xl mx-auto"
                  data-aos="fade-up" data-aos-delay="100"
                >
                  "{{ slide.quote }}"
                </p>
                <div data-aos="zoom-in" data-aos-delay="200">
                  <router-link 
                    :to="{ name: 'library' }"
                    class="inline-block px-10 py-4 bg-white text-indigo-900 font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all transform"
                  >
                    Khám phá ngay
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      
      <div class="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg class="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="fill-slate-50"></path>
        </svg>
      </div>
    </section>

    <div class="container mx-auto px-4 relative z-20 -mt-24 mb-32">
      <div class="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 lg:p-16 border border-slate-100">
        
        <section class="mb-20">
           <div class="text-center mb-10" data-aos="fade-up">
              <h3 class="text-xl font-bold text-slate-800 uppercase tracking-wide">Danh mục phổ biến</h3>
              <div class="w-12 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
           </div>

           <div class="grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up">
              <div v-for="(cat, idx) in categories" :key="idx" class="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 transition-all group">
                <div class="text-4xl mb-3 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">{{ cat.icon }}</div>
                <h4 class="font-bold text-slate-800 group-hover:text-indigo-600">{{ cat.name }}</h4>
                <p class="text-xs text-slate-500 mt-1">{{ cat.count }} đầu sách</p>
              </div>
           </div>
        </section>

        <section id="trending" class="mb-24">
          <div class="text-center mb-12" data-aos="fade-up">
            <span class="inline-block py-1 px-3 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase mb-2">Weekly Highlights</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Sách Hot Tuần Này 🔥</h2>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div 
              v-for="(book, index) in trendingBooks" 
              :key="index"
              class="group cursor-pointer"
              data-aos="fade-up" 
              :data-aos-delay="index * 50"
            >
              <div class="aspect-[2/3] rounded-2xl overflow-hidden shadow-md relative bg-slate-200 mb-4 group-hover:shadow-2xl transition-all duration-300">
                <img :src="book.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" :alt="book.title">
                
                <div v-if="index < 3" class="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl shadow-md z-10">
                  TOP {{ index + 1 }}
                </div>

                <div class="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button class="px-4 py-2 bg-white text-indigo-900 text-xs font-bold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Xem chi tiết
                  </button>
                </div>
              </div>
              
              <h3 class="font-bold text-slate-900 truncate text-base group-hover:text-indigo-600 transition">{{ book.title }}</h3>
              <p class="text-slate-500 text-xs mt-1">{{ book.author }}</p>
            </div>
          </div>

          <div class="text-center mt-12" data-aos="fade-up">
            <router-link 
              :to="{ name: 'library' }"
              class="inline-flex items-center gap-2 px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <span>Xem tất cả sách</span>
              <span class="text-xl leading-none">&rarr;</span>
            </router-link>
          </div>
        </section>

        <section id="features" class="space-y-24">
          <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div class="lg:w-1/2 relative group" data-aos="fade-right">
              <div class="absolute -inset-4 bg-indigo-100 rounded-[2.5rem] transform -rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop" 
                class="relative z-10 rounded-3xl shadow-xl w-full object-cover h-[350px] lg:h-[450px]" 
                alt="Feature 1"
              >
            </div>
            <div class="lg:w-1/2" data-aos="fade-left">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">🛋️</div>
              <h3 class="text-3xl font-bold text-slate-900 mb-4">Không gian đọc sách lý tưởng</h3>
              <p class="text-slate-600 text-lg leading-relaxed mb-6">
                Tận hưởng không gian yên tĩnh, ánh sáng chuẩn và wifi tốc độ cao. LibManager giúp bạn đặt chỗ trước, tìm vị trí sách trên kệ chỉ trong vài giây.
              </p>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div class="lg:w-1/2 relative group" data-aos="fade-left">
              <div class="absolute -inset-4 bg-orange-100 rounded-[2.5rem] transform rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop" 
                class="relative z-10 rounded-3xl shadow-xl w-full object-cover h-[350px] lg:h-[450px]" 
                alt="Feature 2"
              >
            </div>
            <div class="lg:w-1/2 lg:pr-10" data-aos="fade-right">
              <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-6">🚀</div>
              <h3 class="text-3xl font-bold text-slate-900 mb-4">Mượn trả siêu tốc 24/7</h3>
              <p class="text-slate-600 text-lg leading-relaxed mb-6">
                Quy trình mượn sách được tối ưu hóa hoàn toàn. Đặt lịch online, quét mã QR nhận sách, và gia hạn tự động mà không cần thủ tục rườm rà.
              </p>
            </div>
          </div>
        </section>

        <section class="mt-24 pt-16 border-t border-slate-100">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-900">Độc giả nói gì về chúng tôi?</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-slate-50 p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="0">
              <div class="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p class="text-slate-600 italic mb-6">"Hệ thống tìm kiếm sách cực kỳ nhanh. Tôi thích cách website gợi ý những cuốn sách phù hợp với sở thích của mình."</p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">M</div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">Minh Tuấn</h4>
                  <p class="text-xs text-slate-500">Sinh viên năm cuối</p>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
              <div class="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p class="text-slate-600 italic mb-6">"Không gian thư viện rất tuyệt vời, nhưng tính năng đặt sách online mới là thứ giữ chân tôi ở lại lâu dài."</p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">L</div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">Lan Anh</h4>
                  <p class="text-xs text-slate-500">Giảng viên</p>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="200">
              <div class="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p class="text-slate-600 italic mb-6">"Admin hỗ trợ rất nhiệt tình. Tôi từng bị mất tài khoản và được khôi phục chỉ trong vòng 5 phút."</p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">H</div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">Hoàng Nam</h4>
                  <p class="text-xs text-slate-500">Kỹ sư phần mềm</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
    
    <section class="py-20 bg-indigo-900 relative overflow-hidden text-center pb-32"> <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
       <div class="container mx-auto px-4 relative z-10">
          <h2 class="text-4xl font-bold text-white mb-6" data-aos="zoom-in">Bắt đầu hành trình tri thức</h2>
          <p class="text-indigo-200 mb-8 max-w-xl mx-auto" data-aos="fade-up">Hàng ngàn cuốn sách đang chờ bạn khám phá. Đăng ký ngay hôm nay.</p>
          <div data-aos="fade-up" data-aos-delay="200">
             <router-link to="/register" class="inline-block px-12 py-4 bg-yellow-400 text-yellow-900 font-extrabold rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 transition transform">
               Đăng ký ngay
             </router-link>
          </div>
       </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import AOS from 'aos';
import 'aos/dist/aos.css';
import StatsService from "@/services/stats.service"; // [THÊM]

const modules = [Autoplay, EffectFade, Pagination];

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop',
    title: 'Thư viện số trong tầm tay',
    quote: 'Sách là bằng chứng duy nhất cho thấy con người có khả năng tạo ra phép màu.'
  },
  {
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop',
    title: 'Kết nối tri thức toàn cầu',
    quote: 'Một cuốn sách hay là một người bạn tốt, hôm nay và mãi mãi.'
  },
  {
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop',
    title: 'Không gian học tập sáng tạo',
    quote: 'Việc đọc rất quan trọng. Nếu bạn biết cách đọc, cả thế giới sẽ mở ra với bạn.'
  }
];

const categories = [
  { name: 'Văn học', count: 120, icon: '📖' },
  { name: 'Kinh tế', count: 85, icon: '📈' },
  { name: 'Kỹ năng', count: 200, icon: '⚡' },
  { name: 'Thiếu nhi', count: 150, icon: '🧸' },
];

const trendingBooks = ref([]);

// Thay thế onMounted cũ bằng:
onMounted(async () => {
  AOS.init({ once: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });
  
  try {
    // Gọi API lấy sách trending thật
    const res = await StatsService.getTrending();
    
    // Map dữ liệu để khớp với giao diện (backend trả về field hơi khác một chút)
    trendingBooks.value = res.map(book => ({
      title: book.title,
      author: book.author,
      image: book.image || 'https://placehold.co/400x600?text=No+Cover',
      // Có thể thêm logic tính số sao giả lập nếu DB chưa có rating
      reviews: Math.floor(Math.random() * 100) + 50 
    }));

    // Nếu không có sách nào được mượn (DB mới), fallback về dữ liệu mẫu để web không trống
    if (trendingBooks.value.length === 0) {
        trendingBooks.value = [
            { title: "Đắc Nhân Tâm", author: "Dale Carnegie", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400" },
            { title: "Nhà Giả Kim", author: "Paulo Coelho", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" },
            { title: "Sapiens", author: "Yuval Noah Harari", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400" },
            { title: "Atomic Habits", author: "James Clear", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400" },
        ];
    }

  } catch (e) {
    console.error("Lỗi tải trending books:", e);
  }
});

</script>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background: white; opacity: 0.5; width: 10px; height: 10px;
}
:deep(.swiper-pagination-bullet-active) {
  opacity: 1; background: white; width: 30px; border-radius: 5px; transition: all 0.3s;
}
</style>
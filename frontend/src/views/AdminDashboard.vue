<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-bold text-slate-800">Dashboard Tổng quan</h2>

    <div v-if="loading" class="text-center py-10">Đang tải dữ liệu...</div>

    <div v-else class="space-y-6">
      <div class="grid gap-6 md:grid-cols-3">
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
          <div class="text-indigo-100 text-sm font-medium mb-1">Tổng đầu sách</div>
          <div class="text-4xl font-bold">{{ stats.counts.books }}</div>
          <div class="mt-4 text-xs bg-white/20 inline-block px-2 py-1 rounded">Kho sách hiện tại</div>
        </div>
        
        <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div class="text-slate-500 text-sm font-medium mb-1">Độc giả đăng ký</div>
          <div class="text-3xl font-bold text-slate-800">{{ stats.counts.readers }}</div>
          <div class="mt-2 text-xs text-emerald-600 font-medium">Hoạt động tích cực</div>
        </div>

        <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div class="text-slate-500 text-sm font-medium mb-1">Phiếu mượn</div>
          <div class="text-3xl font-bold text-slate-800">{{ stats.counts.borrows }}</div>
          <div class="mt-3 flex gap-2 text-[10px] font-bold">
            <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Chờ: {{ stats.counts.pending }}</span>
            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">Đang mượn: {{ stats.counts.borrowing }}</span>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Sách mượn nhiều trong tháng
          </h3>
          
          <div class="space-y-4">
            <div v-for="(book, index) in stats.topBooks" :key="index" class="flex items-center gap-4">
              <span class="text-lg font-bold text-slate-300 w-6">#{{ index + 1 }}</span>
              <img 
                :src="book.image || 'https://placehold.co/40x60'" 
                class="w-10 h-14 object-cover rounded shadow-sm border border-slate-100"
              />
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-slate-700 line-clamp-1">{{ book.title }}</span>
                  <span class="text-xs font-bold text-indigo-600">{{ book.count }} lượt</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-indigo-500 rounded-full"
                    :style="{ width: (book.count / (stats.topBooks[0]?.count || 1) * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            
            <div v-if="!stats.topBooks?.length" class="text-center text-slate-400 text-sm py-4">
              Chưa có dữ liệu mượn trong tháng này.
            </div>
          </div>
        </div>

        <div class="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <h3 class="font-bold text-indigo-900 mb-2">Ghi chú quản trị</h3>
          <p class="text-sm text-indigo-700 mb-4">
            Hệ thống đang hoạt động ổn định. Hãy kiểm tra các phiếu mượn đang ở trạng thái "Chờ duyệt".
          </p>
          <router-link to="/admin/borrows" class="block text-center bg-white text-indigo-600 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-50 transition">
            Xử lý phiếu mượn &rarr;
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatsService from "@/services/stats.service";

const stats = ref({
  counts: {},
  topBooks: []
});
const loading = ref(true);

onMounted(async () => {
  try {
    stats.value = await StatsService.getOverview();
  } catch(e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
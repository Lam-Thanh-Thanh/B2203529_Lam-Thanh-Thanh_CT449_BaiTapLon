<template>
  <section class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Tổng quan</h2>
        <p class="text-slate-500 mt-1">Chào mừng quay lại, hệ thống đang hoạt động ổn định.</p>
      </div>
      <div class="text-right">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian thực</div>
        <div class="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
          {{ currentDate }}
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-20 text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <span class="text-slate-400 font-medium">Đang tổng hợp dữ liệu...</span>
    </div>

    <div v-else class="space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-sm">📚</div>
          <div>
            <div class="text-sm text-slate-500 font-medium">Tổng đầu sách</div>
            <div class="text-2xl font-bold text-slate-800">{{ stats.counts.totalBooks }}</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-sm">👥</div>
          <div>
            <div class="text-sm text-slate-500 font-medium">Độc giả</div>
            <div class="text-2xl font-bold text-slate-800">{{ stats.counts.totalReaders }}</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-sm">📄</div>
          <div>
            <div class="text-sm text-slate-500 font-medium">Tổng lượt mượn</div>
            <div class="text-2xl font-bold text-slate-800">{{ stats.counts.totalBorrows }}</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-lg shadow-orange-200 text-white flex items-center justify-between gap-4 transform hover:-translate-y-1 transition-transform">
          <div>
            <div class="text-orange-100 font-medium text-sm mb-1">Cần xử lý ngay</div>
            <div class="text-3xl font-bold">{{ stats.counts.pending }}</div>
            <div class="text-xs text-orange-200 mt-1">Yêu cầu đang chờ duyệt</div>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl backdrop-blur-sm">🔔</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800 flex items-center gap-2">
              <span>🔥</span> Top Trending Tuần
            </h3>
            <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded border">Tuần này</span>
          </div>

          <div class="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]"> <div v-for="(book, index) in stats.topBooks" :key="index" class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div class="relative flex-shrink-0">
                <img :src="book.image || 'https://placehold.co/40x60'" class="w-12 h-16 object-cover rounded shadow-sm" />
                <div class="absolute -top-2 -left-2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md border-2 border-white">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-bold text-slate-800 truncate" :title="book.title">{{ book.title }}</h4>
                <p class="text-sm text-slate-500 truncate">{{ book.author }}</p>
                <div class="mt-1 flex items-center gap-2 text-xs text-slate-400">
                   <span>XB: {{ book.publishedYear || '---' }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-indigo-600">{{ book.borrowCount }}</div>
                <div class="text-[10px] text-slate-400">lượt</div>
              </div>
            </div>

            <div v-if="!stats.topBooks.length" class="text-center py-12 text-slate-400 text-sm flex flex-col items-center">
              <span class="text-4xl mb-2 opacity-50">📉</span>
              Chưa có dữ liệu mượn tuần này.
            </div>
          </div>
          
          <router-link to="/admin/borrows" class="mt-4 block w-full py-3 bg-slate-50 text-slate-600 text-center rounded-xl text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 transition">
            Xem chi tiết mượn trả &rarr;
          </router-link>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>📊</span> Thống kê trạng thái phiếu mượn
          </h3>
          <div class="flex-1 flex items-center justify-center min-h-[300px]">
             <Doughnut v-if="chartData.datasets[0].data.some(x => x > 0)" :data="chartData" :options="chartOptions" />
             <div v-else class="flex flex-col items-center justify-center text-slate-400">
                <span class="text-6xl mb-4 opacity-20">📊</span>
                <span class="font-medium">Chưa có đủ dữ liệu biểu đồ</span>
                <span class="text-xs mt-1 text-slate-300">Biểu đồ sẽ hiện khi có phiếu mượn</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import StatsService from "@/services/stats.service";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const stats = ref({
  counts: { totalBooks: 0, totalReaders: 0, totalBorrows: 0, pending: 0, borrowed: 0, returned: 0 },
  topBooks: []
});
const loading = ref(true);
const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Chart Data
const chartData = computed(() => ({
  labels: ['Đang chờ duyệt', 'Đang mượn', 'Đã trả'],
  datasets: [
    {
      backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'], // Amber, Blue, Emerald
      borderWidth: 0,
      hoverOffset: 10,
      data: [
        stats.value.counts.pending, 
        stats.value.counts.borrowed, 
        stats.value.counts.returned
      ]
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // Làm biểu đồ rỗng giữa (Donut) mỏng hơn chút nhìn sang hơn
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, family: "'Inter', sans-serif" }
      }
    }
  }
};

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
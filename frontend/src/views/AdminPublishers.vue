<template>
  <section>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Quản lý Nhà Xuất Bản</h2>
        <p class="text-slate-500 text-sm" v-if="viewMode === 'list'">Danh sách các nhà xuất bản đối tác</p>
        <p class="text-slate-500 text-sm" v-else>{{ isEditing ? 'Cập nhật thông tin NXB' : 'Thêm nhà xuất bản mới' }}</p>
      </div>

      <button 
        v-if="viewMode === 'list'"
        @click="switchToCreate"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
      >
        <span>+</span> Thêm NXB mới
      </button>

      <button 
        v-else
        @click="switchToList"
        class="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        &larr; Quay lại danh sách
      </button>
    </div>

    <div v-if="viewMode === 'list'" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div class="p-4 border-b border-slate-100 flex gap-4">
        <input 
          v-model="searchText" 
          placeholder="Tìm kiếm theo tên NXB, địa chỉ..." 
          class="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th class="p-4 pl-6">Tên Nhà Xuất Bản</th>
              <th class="p-4">Địa chỉ</th>
              <th class="p-4 text-center w-32">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in filteredPublishers" :key="p._id" class="hover:bg-slate-50 transition">
              <td class="p-4 pl-6">
                <div class="font-bold text-slate-800 text-base">{{ p.tenNXB }}</div>
              </td>
              <td class="p-4 text-slate-600">
                <span v-if="p.diaChi" class="flex items-center gap-2">
                    📍 {{ p.diaChi }}
                </span>
                <span v-else class="text-slate-400 italic">-- Chưa cập nhật --</span>
              </td>
              <td class="p-4 text-center">
                <div class="flex justify-center gap-2">
                  <button @click="editPublisher(p)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Sửa">
                    ✏️
                  </button>
                  <button @click="deletePublisher(p._id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredPublishers.length">
                <td colspan="3" class="p-8 text-center text-slate-400">Không tìm thấy nhà xuất bản nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="flex justify-center animate-fade-in">
        <div class="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Thông tin chi tiết
            </h3>
            
            <form @submit.prevent="submitForm" class="space-y-5">
                <div>
                    <label class="label">Tên Nhà Xuất Bản <span class="text-rose-500">*</span></label>
                    <input v-model="form.tenNXB" class="input" required placeholder="Ví dụ: Nhà xuất bản Kim Đồng" />
                </div>
                
                <div>
                    <label class="label">Địa chỉ</label>
                    <input v-model="form.diaChi" class="input" placeholder="Ví dụ: 55 Quang Trung, Hai Bà Trưng, Hà Nội" />
                </div>

                <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                    <button type="button" @click="switchToList" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition">
                        Hủy bỏ
                    </button>
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition transform active:scale-95">
                        {{ isEditing ? 'Lưu thay đổi' : 'Thêm mới' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import PublisherService from "@/services/publisher.service";
import { showToast } from "@/stores/toast";

// State
const viewMode = ref("list"); // 'list' | 'form'
const publishers = ref([]);
const searchText = ref("");
const isEditing = ref(false);

const initialForm = { tenNXB: "", diaChi: "" };
const form = reactive({ ...initialForm });

// Computed
const filteredPublishers = computed(() => {
  if (!searchText.value) return publishers.value;
  const k = searchText.value.toLowerCase();
  return publishers.value.filter(p => 
    p.tenNXB.toLowerCase().includes(k) || 
    (p.diaChi && p.diaChi.toLowerCase().includes(k))
  );
});

// Methods
async function loadPublishers() {
  try {
    publishers.value = await PublisherService.getAll();
  } catch (e) {
    console.error(e);
  }
}

function switchToList() {
  viewMode.value = "list";
}

function switchToCreate() {
  Object.assign(form, initialForm);
  delete form._id;
  isEditing.value = false;
  viewMode.value = "form";
}

function editPublisher(pub) {
  Object.assign(form, pub);
  isEditing.value = true;
  viewMode.value = "form";
}

async function submitForm() {
  try {
    if (isEditing.value) {
      await PublisherService.update(form._id, form);
      showToast("Cập nhật NXB thành công", "success");
    } else {
      await PublisherService.create(form);
      showToast("Thêm NXB mới thành công", "success");
    }
    await loadPublishers();
    switchToList();
  } catch (e) {
    showToast("Có lỗi xảy ra: " + (e.response?.data?.message || e.message), "error");
  }
}

async function deletePublisher(id) {
  if (!confirm("Bạn có chắc muốn xóa NXB này? Các sách thuộc NXB này có thể bị ảnh hưởng.")) return;
  try {
    await PublisherService.delete(id);
    showToast("Đã xóa NXB", "success");
    await loadPublishers();
  } catch (e) {
    showToast("Lỗi xóa NXB (có thể đang có ràng buộc dữ liệu)", "error");
  }
}

onMounted(loadPublishers);
</script>

<style scoped>
.label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
}
.input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 200ms;
}
.input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>
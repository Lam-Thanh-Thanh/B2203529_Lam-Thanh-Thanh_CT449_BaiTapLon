<template>
  <section>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Quản lý Sách</h2>
        <p class="text-slate-500 text-sm" v-if="viewMode === 'list'">Danh sách tất cả sách trong hệ thống</p>
        <p class="text-slate-500 text-sm" v-else>{{ isEditing ? 'Chỉnh sửa thông tin sách' : 'Thêm sách mới vào kho' }}</p>
      </div>

      <button 
        v-if="viewMode === 'list'"
        @click="switchToCreate"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
      >
        <span>+</span> Thêm sách mới
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
          placeholder="Tìm kiếm theo tên sách..." 
          class="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th class="p-4">Thông tin sách</th>
              <th class="p-4 text-center">Số lượng</th>
              <th class="p-4">Năm XB</th>
              <th class="p-4 text-right">Giá tiền</th>
              <th class="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="book in filteredBooks" :key="book._id" class="hover:bg-slate-50 transition">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-14 bg-slate-200 rounded overflow-hidden flex-shrink-0 border border-slate-200">
                     <img 
                        :src="book.image || 'https://placehold.co/40x60?text=No+Img'" 
                        class="w-full h-full object-cover" 
                        alt="cover"
                     />
                  </div>
                  <div>
                    <div class="font-bold text-slate-800 line-clamp-1 text-base">{{ book.title }}</div>
                    <div class="text-slate-500 text-xs">{{ book.author }}</div>
                  </div>
                </div>
              </td>
              <td class="p-4 text-center font-medium" :class="book.copies > 0 ? 'text-emerald-600' : 'text-rose-500'">
                {{ book.copies }}
              </td>
              <td class="p-4 text-slate-600">{{ book.publishedYear }}</td>
              <td class="p-4 text-right font-mono text-slate-700">{{ book.price?.toLocaleString() }} đ</td>
              <td class="p-4 text-center">
                <div class="flex justify-center gap-2">
                  <button @click="editBook(book)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Sửa">✏️</button>
                  <button @click="deleteBook(book._id)" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition" title="Xóa">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        
        <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Thông tin chi tiết
            </h3>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="label">Tên sách <span class="text-rose-500">*</span></label>
                    <input v-model="form.title" class="input" required placeholder="Nhập tên sách..." />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="label">Tác giả <span class="text-rose-500">*</span></label>
                        <input v-model="form.author" class="input" required />
                    </div>
                    <div>
                      <label class="label">Nhà xuất bản</label>
                      <select v-model="form.maNXB" class="input bg-white">
                          <option value="" disabled>-- Chọn NXB --</option>
                          <option v-for="nx in publishers" :key="nx._id" :value="nx._id">
                              {{ nx.tenNXB }}
                          </option>
                      </select>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="label">Giá (VNĐ)</label>
                        <input v-model.number="form.price" type="number" class="input" />
                    </div>
                     <div>
                        <label class="label">Số lượng</label>
                        <input v-model.number="form.copies" type="number" class="input" />
                    </div>
                     <div>
                        <label class="label">Năm XB</label>
                        <input v-model.number="form.publishedYear" type="number" class="input" />
                    </div>
                </div>

                <div>
                    <label class="label">Ảnh bìa</label>
                    <input 
                      type="file" 
                      ref="fileInput"
                      @change="handleFileUpload" 
                      class="input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                      accept="image/*" 
                    />
                    <p class="text-[11px] text-slate-400 mt-1">Chọn ảnh từ máy tính (JPG, PNG, WEBP).</p>
                </div>

                <div class="pt-4 flex items-center justify-end gap-3">
                    <button type="button" @click="switchToList" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition">
                        Hủy bỏ
                    </button>
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition transform active:scale-95">
                        {{ isEditing ? 'Cập nhật sách' : 'Thêm sách mới' }}
                    </button>
                </div>
            </form>
        </div>

        <div class="lg:col-span-1">
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-6 text-center">
                <h3 class="font-bold text-slate-800 mb-4">Xem trước ảnh bìa</h3>
                <div class="w-full aspect-[2/3] bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                    
                    <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
                    <img v-else-if="form.image" :src="form.image" class="w-full h-full object-cover" />
                    
                    <div v-else class="text-slate-400 flex flex-col items-center">
                        <span class="text-4xl mb-2">🖼️</span>
                        <span class="text-xs">Chưa có ảnh</span>
                    </div>
                </div>
                <div class="mt-4 text-sm text-slate-600 font-medium line-clamp-2">
                    {{ form.title || 'Tên sách sẽ hiện ở đây' }}
                </div>
            </div>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import BookService from "@/services/book.service";
import { showToast } from "@/stores/toast";
import PublisherService from "@/services/publisher.service"; // [Thêm]

const viewMode = ref("list");
const books = ref([]);
const searchText = ref("");
const isEditing = ref(false);
const fileInput = ref(null); // Ref để reset input file

const selectedFile = ref(null);
const previewImage = ref(null); // Chỉ dùng để preview ảnh vừa chọn
const publishers = ref([]); // [Thêm biến lưu danh sách NXB]

const initialForm = {
  title: "", author: "", price: 0, copies: 1, 
  publisher: "", publishedYear: new Date().getFullYear(),
  image: "" 
};
const form = reactive({ ...initialForm });

// Computed
const filteredBooks = computed(() => {
  if (!searchText.value) return books.value;
  const k = searchText.value.toLowerCase();
  return books.value.filter(b => 
    b.title.toLowerCase().includes(k) || 
    b.author.toLowerCase().includes(k)
  );
});

// Xử lý khi chọn file
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Tạo link blob để xem trước
    previewImage.value = URL.createObjectURL(file);
  }
}

async function loadBooks() {
  try {
    books.value = await BookService.getAll();
  } catch (error) {
    console.error(error);
  }
}

function switchToList() {
  viewMode.value = "list";
  // Clear preview
  if (previewImage.value) URL.revokeObjectURL(previewImage.value);
  previewImage.value = null;
  selectedFile.value = null;
}

function switchToCreate() {
  Object.assign(form, initialForm);
  delete form._id;
  
  selectedFile.value = null;
  previewImage.value = null;
  if(fileInput.value) fileInput.value.value = ""; // Reset input file HTML
  
  isEditing.value = false;
  viewMode.value = "form";
}

function editBook(book) {
  Object.assign(form, book);
  // Nếu book cũ chưa có maNXB (do dữ liệu cũ), có thể nó sẽ hiện ô trống
  selectedFile.value = null;
  previewImage.value = null;
  if(fileInput.value) fileInput.value.value = "";
  
  isEditing.value = true;
  viewMode.value = "form";
}

async function submitForm() {
  try {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    
    // Gửi maNXB
    if (form.maNXB) {
        formData.append("maNXB", form.maNXB);
        // Tìm tên NXB để gửi kèm (cho trường publisher string cũ - tương thích ngược)
        const selectedNXB = publishers.value.find(p => p._id === form.maNXB);
        if (selectedNXB) {
            formData.append("publisherName", selectedNXB.tenNXB);
        }
    }
    
    formData.append("price", form.price);
    formData.append("copies", form.copies);
    formData.append("publishedYear", form.publishedYear);
    
    if (selectedFile.value) {
        formData.append("image", selectedFile.value);
    }
    if (isEditing.value) {
      await BookService.update(form._id, formData);
      showToast("Cập nhật sách thành công", "success");
    } else {
      await BookService.create(formData);
      showToast("Thêm sách thành công", "success");
    }
    await loadBooks();
    switchToList();
  } catch (e) {
    showToast("Có lỗi xảy ra: " + (e.response?.data?.message || e.message), "error");
  }
}

async function deleteBook(id) {
  if (!confirm("Bạn có chắc muốn xóa sách này?")) return;
  try {
    await BookService.delete(id);
    showToast("Đã xóa sách", "success");
    await loadBooks();
  } catch (e) {
    showToast("Lỗi xóa sách", "error");
  }
}

onMounted(async () => {
    await Promise.all([loadBooks(), loadPublishers()]);
});
async function loadPublishers() {
    publishers.value = await PublisherService.getAll();
}
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
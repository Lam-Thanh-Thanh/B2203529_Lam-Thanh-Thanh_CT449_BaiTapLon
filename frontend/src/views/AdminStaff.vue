<template>
  <section>
    <h2 class="text-xl font-semibold mb-3">Quản lý Nhân viên</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <!-- Form -->
      <div class="bg-white border rounded-xl p-4 shadow-sm space-y-3">
        <h3 class="font-semibold">
          {{ editing ? "Sửa nhân viên" : "Thêm nhân viên mới" }}
        </h3>

        <form @submit.prevent="submit" class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm mb-1">Họ lót</label>
              <input
                v-model="form.hoLot"
                class="border rounded-lg p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Tên</label>
              <input
                v-model="form.ten"
                class="border rounded-lg p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm mb-1">Giới tính</label>
            <input
              v-model="form.phai"
              class="border rounded-lg p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nam/Nữ/Khác..."
            />
          </div>

          <div>
            <label class="block text-sm mb-1">Địa chỉ</label>
            <input
              v-model="form.diaChi"
              class="border rounded-lg p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm mb-1">Điện thoại</label>
            <input
              v-model="form.dienThoai"
              class="border rounded-lg p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="flex gap-2">
            <button
              class="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              type="submit"
            >
              {{ editing ? "Cập nhật" : "Thêm" }}
            </button>
            <button
              v-if="editing"
              type="button"
              class="px-3 py-2 rounded-lg border text-sm hover:bg-slate-50"
              @click="reset"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white border rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Danh sách nhân viên</h3>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-500">Sort theo:</span>
            <button
              class="px-2 py-1 border rounded"
              @click="setSort('ten')"
            >
              Tên
              <span v-if="sortKey === 'ten'" class="ml-1 text-[10px]">
                {{ sortDir === "asc" ? "▲" : "▼" }}
              </span>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border text-sm">
            <thead>
              <tr class="bg-slate-50">
                <th class="border p-2 text-left">Họ tên</th>
                <th class="border p-2 text-left">Giới tính</th>
                <th class="border p-2 text-left">Điện thoại</th>
                <th class="border p-2 text-left">Địa chỉ</th>
                <th class="border p-2 text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in sortedStaff" :key="s._id">
                <td class="border p-2">
                  {{ (s.hoLot || "") + " " + (s.ten || "") }}
                </td>
                <td class="border p-2">
                  {{ s.phai || "-" }}
                </td>
                <td class="border p-2">
                  {{ s.dienThoai || "-" }}
                </td>
                <td class="border p-2">
                  {{ s.diaChi || "-" }}
                </td>
                <td class="border p-2 text-center">
                  <button
                    class="text-xs text-indigo-600 mr-2"
                    @click="edit(s)"
                  >
                    Sửa
                  </button>
                  <button
                    class="text-xs text-rose-600"
                    @click="remove(s)"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              <tr v-if="!sortedStaff.length">
                <td colspan="5" class="border p-2 text-center text-slate-500">
                  Chưa có nhân viên nào.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import StaffService from "@/services/staff.service";
import { showToast } from "@/stores/toast";

const staff = ref([]);
const editing = ref(false);
const currentId = ref(null);
const form = ref({
  hoLot: "",
  ten: "",
  phai: "",
  diaChi: "",
  dienThoai: "",
});

const sortKey = ref("ten");
const sortDir = ref("asc");

function reset() {
  editing.value = false;
  currentId.value = null;
  form.value = { hoLot: "", ten: "", phai: "", diaChi: "", dienThoai: "" };
}

async function load() {
  staff.value = await StaffService.getAll();
}

onMounted(load);

const sortedStaff = computed(() => {
  const arr = [...staff.value];
  arr.sort((a, b) => {
    const ka = (a[sortKey.value] || "").toLowerCase();
    const kb = (b[sortKey.value] || "").toLowerCase();
    if (ka < kb) return sortDir.value === "asc" ? -1 : 1;
    if (ka > kb) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
  return arr;
});

function setSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

function edit(s) {
  editing.value = true;
  currentId.value = s._id;
  form.value = {
    hoLot: s.hoLot || "",
    ten: s.ten || "",
    phai: s.phai || "",
    diaChi: s.diaChi || "",
    dienThoai: s.dienThoai || "",
  };
}

async function submit() {
  try {
    if (editing.value && currentId.value) {
      const updated = await StaffService.update(currentId.value, form.value);
      const idx = staff.value.findIndex((x) => x._id === currentId.value);
      if (idx !== -1) staff.value[idx] = updated;
      showToast("Đã cập nhật nhân viên", "success");
    } else {
      const created = await StaffService.create(form.value);
      staff.value.push(created);
      showToast("Đã thêm nhân viên mới", "success");
    }
  } catch (e) {
    showToast("Thao tác với nhân viên thất bại", "error");
  } finally {
    reset();
  }
}

async function remove(s) {
  if (!confirm("Xóa nhân viên này?")) return;
  try {
    await StaffService.delete(s._id);
    staff.value = staff.value.filter((x) => x._id !== s._id);
    showToast("Đã xóa nhân viên", "success");
  } catch (e) {
    showToast("Không xóa được nhân viên", "error");
  }
}
</script>

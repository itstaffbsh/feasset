<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kategori Tools EWTR</h1>
        <p class="text-sm text-gray-500">Kelola master data daftar kategori tools untuk checklist EWTR.</p>
      </div>
      <button 
        @click="showAddModal" 
        class="w-full sm:w-auto bg-brand-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-brand-dark/20 hover:bg-brand-light flex items-center justify-center gap-2 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Tambah Kategori
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Tampilkan</label>
        <select 
          v-model="perPage" 
          @change="fetchItems" 
          class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-brand-dark focus:border-brand-dark outline-none bg-gray-50"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <span class="text-sm text-gray-600">data</span>
      </div>
      <div class="relative w-full sm:w-72">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari kategori..." 
          class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" 
          @input="debounceSearch" 
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-20">No</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Kategori Tools</th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="3" class="px-6 py-8 text-center text-gray-400 font-medium">Memuat data...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="3" class="px-6 py-8 text-center text-gray-400 font-medium">Belum ada kategori tools EWTR.</td>
            </tr>
            <tr v-else v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td class="px-6 py-4 text-sm font-bold text-gray-900">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-dark"></span>
                  {{ item.name }}
                </div>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <button 
                  @click="showEditModal(item)" 
                  class="inline-block p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mx-1"
                  title="Edit Kategori"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button 
                  @click="deleteItem(item.id)" 
                  class="inline-block p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Kategori"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.total > 0" class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-500">
          Menampilkan <span class="font-bold text-gray-900">{{ meta.from || 0 }}</span> sampai <span class="font-bold text-gray-900">{{ meta.to || 0 }}</span> dari <span class="font-bold text-gray-900">{{ meta.total || 0 }}</span> data
        </div>
        <div class="inline-flex items-center gap-1 bg-white p-1 rounded-md shadow-sm border border-gray-200">
          <button 
            @click="changePage(meta.current_page - 1)" 
            :disabled="meta.current_page === 1" 
            class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <template v-for="(p, i) in paginationLinks" :key="i">
            <span v-if="p === '...'" class="flex items-center justify-center w-8 h-8 text-gray-400 font-medium">...</span>
            <button 
              v-else 
              @click="changePage(p)" 
              class="flex items-center justify-center w-8 h-8 rounded text-sm font-bold transition-all"
              :class="p === meta.current_page ? 'bg-brand-dark text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
            >
              {{ p }}
            </button>
          </template>

          <button 
            @click="changePage(meta.current_page + 1)" 
            :disabled="meta.current_page === meta.last_page" 
            class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form (Add & Edit) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditMode ? 'Edit Kategori Tools' : 'Tambah Kategori Tools' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Kategori Tools <span class="text-red-500">*</span></label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              placeholder="Contoh: HP, Laptop, Komputer..." 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-dark focus:border-brand-dark outline-none transition"
              :class="formErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''"
            />
            <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">Nama kategori tools wajib diisi.</p>
          </div>

          <div class="flex justify-end gap-3 pt-3">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-5 py-2 bg-brand-dark hover:bg-brand-light text-white rounded-lg text-sm font-bold shadow-md transition disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Kategori') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'

const swal = inject('swal')
const items = ref([])
const meta = ref(null)
const pending = ref(true)
const saving = ref(false)

const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchItems()
  }, 350)
}

const fetchItems = async () => {
  pending.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage.value,
      q: searchQuery.value
    })
    const res = await $api(`/ewtr-categories?${params.toString()}`)
    items.value = res.data || []
    meta.value = {
      current_page: res.current_page,
      last_page: res.last_page,
      from: res.from,
      to: res.to,
      total: res.total
    }
  } catch (e) {
    console.error('Failed fetching EWTR categories:', e)
  } finally {
    pending.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || (meta.value && page > meta.value.last_page)) return
  currentPage.value = page
  fetchItems()
}

const paginationLinks = computed(() => {
  if (!meta.value) return []
  const current = meta.value.current_page
  const last = meta.value.last_page
  const delta = 2
  const range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }
  if (current - delta > 2) range.unshift('...')
  if (current + delta < last - 1) range.push('...')
  range.unshift(1)
  if (last > 1) range.push(last)
  return range
})

// Modal & Form State
const isModalOpen = ref(false)
const isEditMode = ref(false)
const selectedItem = ref(null)
const form = ref({
  name: ''
})
const formErrors = ref({
  name: false
})

const showAddModal = () => {
  isEditMode.value = false
  selectedItem.value = null
  form.value = { name: '' }
  formErrors.value = { name: false }
  isModalOpen.value = true
}

const showEditModal = (item) => {
  isEditMode.value = true
  selectedItem.value = item
  form.value = { name: item.name }
  formErrors.value = { name: false }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitForm = async () => {
  if (!form.value.name.trim()) {
    formErrors.value.name = true
    return
  }
  formErrors.value.name = false
  saving.value = true

  try {
    if (isEditMode.value) {
      await $api(`/ewtr-categories/${selectedItem.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      swal.fire({
        title: 'Berhasil!',
        text: 'Kategori tools EWTR berhasil diperbarui.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      await $api('/ewtr-categories', {
        method: 'POST',
        body: form.value
      })
      swal.fire({
        title: 'Berhasil!',
        text: 'Kategori tools EWTR berhasil ditambahkan.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    }
    closeModal()
    fetchItems()
  } catch (error) {
    const msg = error.response?._data?.message || error.data?.message || 'Gagal menyimpan kategori.'
    swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const deleteItem = async (id) => {
  const result = await swal.fire({
    title: 'Hapus Kategori Tools?',
    text: 'Kategori ini akan dihapus dari daftar master data.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/ewtr-categories/${id}`, { method: 'DELETE' })
      swal.fire({
        title: 'Terhapus!',
        text: 'Kategori tools EWTR berhasil dihapus.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      fetchItems()
    } catch (e) {
      swal.fire('Error', 'Gagal menghapus kategori tools.', 'error')
    }
  }
}

onMounted(() => {
  fetchItems()
})
</script>

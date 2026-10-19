<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Departemen</h1>
        <p class="text-sm text-gray-500">Kelola master data daftar departemen.</p>
      </div>
      <button @click="showAddModal" class="w-full sm:w-auto bg-brand-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-brand-dark/20 hover:bg-brand-light flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Tambah Departemen
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Tampilkan</label>
        <select v-model="perPage" @change="fetchItems" class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-brand-dark focus:border-brand-dark outline-none bg-gray-50">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <span class="text-sm text-gray-600">data</span>
      </div>
      <div class="relative w-full sm:w-72">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Cari..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" @input="debounceSearch" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">No</th>
              <th @click="sortBy('kode_asset')" class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Kode Asset <span v-if="sortCol === 'kode_asset'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th @click="sortBy('nama_departemen')" class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Nama Departemen <span v-if="sortCol === 'nama_departemen'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th class="hidden md:table-cell px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="4" class="px-6 py-8 text-center text-gray-400 font-medium">Memuat data...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-400 font-medium">Data tidak ditemukan.</td>
            </tr>
            <template v-else v-for="(item, index) in items" :key="item.id">
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex justify-between items-center">
                    <span>{{ ((meta.current_page - 1) * meta.per_page) + index + 1 }}</span>
                    <button @click="toggleRow(item.id)" class="md:hidden p-2 text-gray-500 bg-gray-100 rounded-lg">
                      <svg v-if="!expandedRows.includes(item.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"></path></svg>
                    </button>
                  </div>
                </td>
                <td class="hidden md:table-cell px-6 py-4 text-sm font-medium text-brand-dark">{{ item.kode_asset }}</td>
                <td class="hidden md:table-cell px-6 py-4 text-sm font-bold text-gray-900">{{ item.nama_departemen }}</td>
                <td class="hidden md:table-cell px-6 py-4 text-right text-sm font-medium">
                  <button @click="showEditModal(item)" class="inline-block p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mx-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button @click="deleteItem(item.id)" class="inline-block p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
              <!-- Mobile Expanded Row -->
              <tr v-if="expandedRows.includes(item.id)" class="md:hidden bg-gray-50/80">
                <td colspan="4" class="px-6 py-4">
                  <div class="space-y-3">
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kode Asset</p>
                      <div class="text-sm font-medium text-brand-dark">{{ item.kode_asset }}</div>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Departemen</p>
                      <div class="text-sm font-bold text-gray-900">{{ item.nama_departemen }}</div>
                    </div>
                    <div class="pt-3 flex gap-2 border-t border-gray-200">
                      <button @click="showEditModal(item)" class="flex-1 text-center py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-blue-600 shadow-sm">Edit</button>
                      <button @click="deleteItem(item.id)" class="flex-1 text-center py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 shadow-sm">Hapus</button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
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
              :class="p === meta.current_page ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
const { $swal: swal } = useNuxtApp()

const items = ref([])
const meta = ref(null)
const pending = ref(true)

const searchQuery = ref('')
const perPage = ref(10)
const page = ref(1)
const sortCol = ref('id')
const sortDir = ref('desc')

const expandedRows = ref([])
const toggleRow = (id) => {
  const idx = expandedRows.value.indexOf(id)
  if (idx > -1) expandedRows.value.splice(idx, 1)
  else expandedRows.value.push(id)
}

const sortBy = (col) => {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
  page.value = 1
  fetchItems()
}

const changePage = (p) => {
  if (p < 1 || p > (meta.value?.last_page || 1)) return
  page.value = p
  fetchItems()
}

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchItems()
  }, 300)
}

const paginationLinks = computed(() => {
  if (!meta.value) return []
  const current = meta.value.current_page
  const last = meta.value.last_page
  
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', last]
  }
  
  if (current >= last - 3) {
    return [1, '...', last - 4, last - 3, last - 2, last - 1, last]
  }
  
  return [1, '...', current - 1, current, current + 1, '...', last]
})

const fetchItems = async () => {
  pending.value = true
  try {
    const data = await $api(`/departments?q=${searchQuery.value}&per_page=${perPage.value}&page=${page.value}&sort_by=${sortCol.value}&sort_dir=${sortDir.value}`)
    items.value = data?.data || []
    meta.value = data?.meta || data || null
  } catch(e) {
    console.error(e)
  } finally {
    pending.value = false
  }
}

const showAddModal = async () => {
  const { value: formValues } = await swal.fire({
    title: 'Tambah Departemen',
    html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Kode Asset</label>
            <input id="swal-input1" type="text" placeholder="Contoh: IT, HR..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Departemen</label>
            <input id="swal-input2" type="text" placeholder="Ketik nama departemen..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors">
          </div>
        </div>
      `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: '#2d3e50',
    preConfirm: () => {
      return {
        kode_asset: document.getElementById('swal-input1').value,
        nama_departemen: document.getElementById('swal-input2').value
      }
    }
  })

  if (formValues && formValues.kode_asset && formValues.nama_departemen) {
    try {
      await $api('/departments', { method: 'POST', body: formValues })
      swal.fire({ title: 'Berhasil!', text: 'Departemen ditambahkan.', icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchItems()
    } catch (e) {
      swal.fire('Error', e.data?.message || 'Gagal menyimpan.', 'error')
    }
  } else if(formValues) {
    swal.fire('Error', 'Lengkapi seluruh form.', 'error')
  }
}

const showEditModal = async (item) => {
  const { value: formValues } = await swal.fire({
    title: 'Edit Departemen',
    html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Kode Asset</label>
            <input id="swal-input1" type="text" placeholder="Contoh: IT, HR..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors" value="${item.kode_asset}">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Departemen</label>
            <input id="swal-input2" type="text" placeholder="Ketik nama departemen..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors" value="${item.nama_departemen}">
          </div>
        </div>
      `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: '#2d3e50',
    preConfirm: () => {
      return {
        kode_asset: document.getElementById('swal-input1').value,
        nama_departemen: document.getElementById('swal-input2').value
      }
    }
  })

  if (formValues && formValues.kode_asset && formValues.nama_departemen) {
    try {
      await $api(`/departments/${item.id}`, { method: 'PUT', body: formValues })
      swal.fire({ title: 'Berhasil!', text: 'Departemen diupdate.', icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchItems()
    } catch (e) {
      swal.fire('Error', e.data?.message || 'Gagal menyimpan.', 'error')
    }
  } else if(formValues) {
    swal.fire('Error', 'Lengkapi seluruh form.', 'error')
  }
}

const deleteItem = async (id) => {
  const result = await swal.fire({
    title: 'Yakin hapus?',
    text: "Data akan dihapus permanen!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/departments/${id}`, { method: 'DELETE' })
      swal.fire({ title: 'Terhapus!', text: 'Data telah dihapus.', icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchItems()
    } catch (e) {
      swal.fire('Error', 'Gagal menghapus.', 'error')
    }
  }
}

onMounted(() => fetchItems())
</script>

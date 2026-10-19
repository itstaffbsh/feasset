<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Riwayat Mutasi</h1>
        <p class="text-sm text-gray-500">Log transaksi pinjam dan kembali aset.</p>
      </div>
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
        <input v-model="searchQuery" type="text" placeholder="Cari riwayat..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" @input="debounceSearch" />
      </div>
    </div>

<!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th @click="sortBy('created_at')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Tanggal <span v-if="sortCol === 'created_at'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div class="flex items-center gap-1">Aset</div>
              </th>
              <th @click="sortBy('jenis_transaksi')" class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Status <span v-if="sortCol === 'jenis_transaksi'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div class="flex items-center gap-1">Oleh</div>
              </th>
              <th class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div class="flex items-center gap-1">Keterangan</div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400 font-medium">Memuat data...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400 font-medium">Tidak ada riwayat mutasi.</td>
            </tr>
            <template v-else v-for="item in items" :key="item.id">
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500">{{ new Date(item.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) }}</span>
                    <button @click="toggleRow(item.id)" class="md:hidden p-2 text-gray-500 bg-gray-100 rounded-lg">
                      <svg v-if="!expandedRows.includes(item.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"></path></svg>
                    </button>
                  </div>
                </td>
                <td class="hidden md:table-cell px-6 py-4 text-sm font-bold text-gray-900">{{ item.product?.description || '-' }}</td>
                <td class="hidden md:table-cell px-6 py-4 text-sm">
                  <span class="px-2.5 py-1 text-xs font-medium rounded-full" 
                    :class="item.jenis_transaksi === 'mengembalikan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                    {{ item.jenis_transaksi === 'mengembalikan' ? 'Kembali' : 'Pinjam' }}
                  </span>
                </td>
                <td class="hidden md:table-cell px-6 py-4 text-sm text-gray-900">{{ item.receiver?.name || item.sender?.name || '-' }}</td>
                <td class="hidden md:table-cell px-6 py-4 text-sm text-gray-500">{{ item.catatan || '-' }}</td>
              </tr>
              <!-- Mobile Expanded Row -->
              <tr v-if="expandedRows.includes(item.id)" class="md:hidden bg-gray-50/80">
                <td colspan="5" class="px-6 py-4">
                  <div class="space-y-3">
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Aset</p>
                      <div class="text-sm font-bold text-gray-900">{{ item.product?.description || '-' }}</div>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <span class="px-2.5 py-1 text-xs font-medium rounded-full inline-block" 
                        :class="item.jenis_transaksi === 'mengembalikan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                        {{ item.jenis_transaksi === 'mengembalikan' ? 'Kembali' : 'Pinjam' }}
                      </span>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Oleh</p>
                      <div class="text-sm text-gray-900">{{ item.receiver?.name || item.sender?.name || '-' }}</div>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keterangan</p>
                      <div class="text-sm text-gray-500">{{ item.catatan || '-' }}</div>
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

const items = ref([])
const meta = ref(null)
const pending = ref(true)

const searchQuery = ref('')
const perPage = ref(10)
const page = ref(1)
const sortCol = ref('created_at')
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
    const res = await $api(`/history?q=${searchQuery.value}&per_page=${perPage.value}&page=${page.value}&sort_by=${sortCol.value}&sort_dir=${sortDir.value}`)
    items.value = res?.data || []
    meta.value = res?.meta || res || null
  } finally {
    pending.value = false
  }
}

onMounted(() => fetchItems())
</script>

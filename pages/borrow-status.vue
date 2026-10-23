<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 flex items-start md:items-center gap-2">
            <svg class="w-6 h-6 text-brand-dark mt-1 md:mt-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="leading-tight">Status Peminjaman & Pengembalian</span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">Pantau status dokumen STTB (Surat Tanda Terima Barang) untuk setiap transaksi.</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="border-b border-gray-100 grid grid-cols-1 md:flex md:flex-row">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="text-kecil px-4 py-3 md:px-6 md:py-4 text-sm font-bold transition-colors flex items-center justify-start md:justify-center gap-3 border-l-4 md:border-l-0 md:border-b-2"
            :class="activeTab === tab.id ? 'border-brand-dark text-brand-dark bg-brand-dark/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
            <svg class="w-5 h-5 flex-shrink-0" :class="tab.color" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"></path></svg>
            <span class="text-center w-full md:w-auto leading-tight whitespace-normal">{{ tab.name }}</span>
          </button>
        </div>

        <!-- Toolbar -->
        <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div class="relative w-full sm:w-72">
            <input type="text" v-model="searchQuery" placeholder="Cari nama aset, nomor seri..." 
              class="w-full pl-10 pr-4 py-2 rounded-lg border-gray-200 focus:border-brand-dark focus:ring-brand-dark text-sm">
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <span class="text-sm text-gray-500">Tampilkan:</span>
            <select v-model="perPage" class="border-gray-200 rounded-lg text-sm focus:border-brand-dark focus:ring-brand-dark py-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse block md:table">
              <thead class="hidden md:table-header-group">
                <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th class="p-4 font-semibold">Transaksi</th>
                  <th class="p-4 font-semibold">Aset</th>
                  <th class="p-4 font-semibold">Tanggal</th>
                  <th class="p-4 font-semibold text-center">Preview PDF (STTB)</th>
                  <th class="p-4 font-semibold text-center">List Scan</th>
                </tr>
              </thead>
              <tbody class="text-sm md:divide-y md:divide-gray-50 block md:table-row-group p-4 md:p-0 space-y-4 md:space-y-0 bg-gray-50/50 md:bg-transparent">
                <template v-if="pending">
                  <tr v-for="i in perPage" :key="'skeleton-'+i" class="animate-pulse bg-white block md:table-row border border-gray-100 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none p-2 md:p-0">
                    <td class="p-3 md:p-4 block md:table-cell border-b border-gray-50 md:border-none">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div class="space-y-2">
                          <div class="h-4 bg-gray-200 rounded w-24"></div>
                          <div class="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3 md:p-4 block md:table-cell border-b border-gray-50 md:border-none">
                      <div class="space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                        <div class="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </td>
                    <td class="p-3 md:p-4 block md:table-cell border-b border-gray-50 md:border-none">
                      <div class="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td class="p-3 md:p-4 block md:table-cell border-b border-gray-50 md:border-none flex justify-end md:table-cell">
                      <div class="h-8 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td class="p-3 md:p-4 block md:table-cell flex justify-end md:table-cell">
                      <div class="h-8 bg-gray-200 rounded w-28 md:mx-auto"></div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-if="!histories.length" class="hover:bg-gray-50/50 block md:table-row">
                  <td colspan="5" class="p-12 text-center block md:table-cell">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Tidak Ada Data</h3>
                    <p class="text-gray-500">Belum ada riwayat transaksi dengan status ini.</p>
                  </td>
                </tr>
                  <tr v-for="history in histories" :key="history.id" class="hover:bg-gray-50/50 transition-colors group block md:table-row bg-white border border-gray-100 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none p-2 md:p-0">
                  <td class="p-3 md:p-4 align-top block md:table-cell border-b border-gray-50 md:border-none flex flex-col justify-start items-start gap-2">
                    <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">Transaksi</div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="history.jenis_transaksi === 'meminjam' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'">
                        <svg v-if="history.jenis_transaksi === 'meminjam'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <div class="text-left">
                        <p class="font-bold text-gray-900 capitalize">{{ history.jenis_transaksi === 'meminjam' ? 'Peminjaman' : 'Pengembalian' }}</p>
                        <p class="text-xs text-gray-500">{{ history.pihak_pertama?.name || history.sender?.name || 'Sistem' }} &rarr; {{ history.receiver?.name || 'Kantor' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 md:p-4 align-top block md:table-cell border-b border-gray-50 md:border-none flex flex-col justify-start items-start text-left gap-2">
                    <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Aset</div>
                    <div>
                      <p class="font-bold text-gray-900 line-clamp-1 md:line-clamp-none">{{ history.product?.description || 'Aset Tidak Diketahui' }}</p>
                      <p class="text-xs text-gray-500 font-mono">{{ history.product?.full_nomor_unik || '-' }}</p>
                    </div>
                  </td>
                  <td class="p-3 md:p-4 align-top block md:table-cell border-b border-gray-50 md:border-none flex flex-col justify-start items-start text-left gap-2">
                    <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Tanggal</div>
                    <p class="text-gray-900 font-medium text-sm md:text-base text-left">{{ formatDate(history.tanggal_pinjam || history.created_at) }}</p>
                  </td>
                  <td class="p-3 md:p-4 align-top text-left md:text-center block md:table-cell border-b border-gray-50 md:border-none flex flex-col justify-start items-start md:items-center gap-2 overflow-hidden">
                    <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Preview PDF</div>
                    <div class="flex justify-end md:justify-center mt-1 sm:mt-0">
                      <NuxtLink v-if="history.batch_id" :to="`/products/sttb/${history.batch_id}`" target="_blank" class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-xs font-bold transition-colors whitespace-nowrap">
                        <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>
                        Lihat STTB
                      </NuxtLink>
                      <span v-else class="text-xs text-gray-400 italic">Tidak ada STTB</span>
                    </div>
                  </td>
                  <td class="p-3 md:p-4 align-top text-left md:text-center block md:table-cell flex flex-col justify-start items-start md:items-center gap-2 overflow-hidden">
                    <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">List Scan</div>
                    <div class="flex justify-end md:justify-center mt-1 sm:mt-0">
                      <div v-if="history.scanned_pdf" class="flex flex-col items-end md:items-center gap-1.5">
                        <div class="inline-flex items-center gap-1">
                          <a :href="getFileUrl(history.scanned_pdf)" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-md text-xs font-bold transition-colors shadow-sm" title="Buka PDF hasil scan di tab baru">
                            <svg class="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>
                            <span>Lihat PDF</span>
                          </a>
                          <button @click="downloadPdf(history.scanned_pdf)" type="button" class="p-1.5 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-brand-dark rounded-md text-xs transition-colors shadow-sm cursor-pointer" title="Download PDF langsung">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          </button>
                        </div>
                        <button v-if="can('borrow-status', 'edit')" @click="openModal(history)" class="text-[10px] text-gray-500 hover:text-brand-dark font-medium underline">Ganti File</button>
                      </div>
                      <button v-else-if="can('borrow-status', 'tambah')" @click="openModal(history)" class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-dark text-white hover:bg-brand-light rounded-md text-xs font-bold shadow-sm transition-colors whitespace-nowrap">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Tambah Scan
                      </button>
                    </div>
                  </td>
                  </tr>
                </template>
              </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50" v-if="totalPages > 1">
          <p class="text-sm text-gray-500">
            Menampilkan <span class="font-bold text-gray-900">{{ (currentPage - 1) * perPage + 1 }}</span> - 
            <span class="font-bold text-gray-900">{{ Math.min(currentPage * perPage, totalItems) }}</span> dari 
            <span class="font-bold text-gray-900">{{ totalItems }}</span> entri
          </p>
          <div class="flex gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button v-for="p in totalPages" :key="p" @click="currentPage = p" 
              class="w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors"
              :class="currentPage === p ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'">
              {{ p }}
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <Teleport to="body" v-if="isMounted">
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 9999;">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 class="text-lg font-bold text-gray-900">Upload Hasil Scan STTB</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitUpload" class="p-6">
          <div class="mb-6">
            <p class="text-sm text-gray-500 mb-4">
              Silakan upload file PDF hasil *scan* STTB untuk aset <span class="font-bold text-gray-900">{{ selectedHistory?.product?.description }}</span>.
            </p>
            
            <label class="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-brand-dark transition-colors" :class="{'border-brand-dark bg-brand-dark/5': file}">
              <input type="file" accept="application/pdf" class="hidden" @change="onFileChange" required>
              <div v-if="!file" class="space-y-2">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <p class="text-sm font-bold text-gray-700">Klik untuk memilih file PDF</p>
                <p class="text-xs text-gray-400">Maksimal 5MB</p>
              </div>
              <div v-else class="space-y-2">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p class="text-sm font-bold text-gray-900">{{ file.name }}</p>
                <p class="text-xs text-gray-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>
            </label>
          </div>
          
          <div class="flex gap-3 justify-end">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">Batal</button>
            <button type="submit" :disabled="uploading || !file" class="px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-bold hover:bg-brand-light shadow-sm disabled:opacity-50 flex items-center gap-2">
              <svg v-if="uploading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              {{ uploading ? 'Mengupload...' : 'Upload File' }}
            </button>
          </div>
        </form>
      </div>
      </div>
    </Teleport>
    

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

import { usePermissions } from '~/composables/usePermissions'

const { can } = usePermissions()
const { $swal: swal } = useNuxtApp()
const config = useRuntimeConfig()

const tabs = [
  { id: 'meminjam_belum', name: 'Peminjaman Belum Sukses', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-orange-500' },
  { id: 'meminjam_sukses', name: 'Peminjaman Sukses', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500' },
  { id: 'kembali_belum', name: 'Pengembalian Belum Sukses', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-orange-500' },
  { id: 'kembali_sukses', name: 'Pengembalian Sukses', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500' }
]

const isMounted = ref(false)
const activeTab = ref('meminjam_belum')
const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

const histories = ref([])
const pending = ref(false)
const totalItems = ref(0)
const totalPages = ref(1)

// Modal State
const showModal = ref(false)
const selectedHistory = ref(null)
const file = ref(null)
const uploading = ref(false)

const fetchData = async () => {
  pending.value = true
  try {
    const res = await $api('/borrow-status', {
      params: {
        type: activeTab.value,
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value
      }
    })
    histories.value = res.data || []
    totalItems.value = res.total || 0
    totalPages.value = res.last_page || 1
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    pending.value = false
  }
}

// Watchers
watch([activeTab, perPage, searchQuery], () => {
  currentPage.value = 1
  fetchData()
})

watch(currentPage, () => {
  fetchData()
})

onMounted(() => {
  isMounted.value = true
  fetchData()
})

// Utilities
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getFileUrl = (path) => {
  if (!path) return '#'
  const base = config.public.apiBase.replace(/\/api\/?$/, '')
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && path.startsWith('http://')) {
      return path.replace(/^http:\/\//, 'https://')
    }
    return path
  }

  const cleanPath = path.replace(/^\/?(public\/|storage\/)/, '')
  return `${base}/storage/${cleanPath}`
}

const getDownloadUrl = (path) => {
  const url = getFileUrl(path)
  if (url === '#') return '#'
  return url.includes('?') ? `${url}&download=1` : `${url}?download=1`
}

const downloadPdf = async (path, defaultName = 'dokumen_scan.pdf') => {
  const url = getFileUrl(path)
  if (!url || url === '#') return
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = path.split('/').pop() || defaultName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  } catch (e) {
    window.open(getDownloadUrl(path), '_blank')
  }
}

// Modal Actions
const openModal = (history) => {
  selectedHistory.value = history
  file.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedHistory.value = null
  file.value = null
}

const onFileChange = async (e) => {
  const f = e.target.files[0]
  if (f) {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      swal.fire('Format Salah', 'File harus berupa dokumen PDF asli (.pdf)!', 'error')
      e.target.value = ''
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      swal.fire('Ukuran Terlalu Besar', 'Ukuran file maksimal 10MB!', 'error')
      e.target.value = ''
      return
    }

    // Validasi magic header %PDF- di browser
    try {
      const slice = f.slice(0, 1024)
      const buffer = await slice.arrayBuffer()
      const header = new TextDecoder('utf-8').decode(buffer)
      if (!header.includes('%PDF-')) {
        swal.fire('File Tidak Valid', 'Dokumen yang dipilih bukan merupakan format PDF asli (header %PDF- tidak ditemukan).', 'error')
        e.target.value = ''
        file.value = null
        return
      }
    } catch (err) {
      console.warn('Gagal membaca header file:', err)
    }

    file.value = f
  }
}

const submitUpload = async () => {
  if (!file.value || !selectedHistory.value) return
  
  uploading.value = true
  const formData = new FormData()
  formData.append('scanned_pdf', file.value)
  
  try {
    await $api(`/borrow-status/${selectedHistory.value.id}/upload-scan`, {
      method: 'POST',
      body: formData
    })
    
    swal.fire({
      title: 'Berhasil!',
      text: 'File scan STTB berhasil diupload.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    
    closeModal()
    fetchData() // Refresh current tab data
    
  } catch (error) {
    console.error(error)
    closeModal()
    swal.fire('Error', error?.data?.message || 'Gagal mengupload file scan.', 'error')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
@media (max-width: 350px) {
  .text-kecil{
    font-size:12px !important;
  }
}
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>

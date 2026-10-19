<template>
  <div class="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p class="text-sm text-gray-500">Ikhtisar real-time perputaran aset dan informasi peminjaman.</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between">
      <div>
        <h3 class="font-bold">Gagal memuat data</h3>
        <p class="text-sm opacity-80 font-mono">\{\{ error \}\}</p>
      </div>
      <button @click="fetchData" class="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors">Coba Lagi</button>
    </div>

    <!-- Stat Cards -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
    
    <div v-else-if="data" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Card 1: Total Asset -->
      <div class="bg-brand-dark rounded-xl p-6 text-white relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 p-4 opacity-20">
          <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <div class="relative z-10">
          <h3 class="text-gray-300 text-sm font-medium mb-1">Jumlah Semua Asset</h3>
          <p class="text-3xl font-bold mb-4">{{ data.stats.total_assets }}</p>
          <div class="flex items-center text-xs">
            <span class="text-gray-300">Total aset terdaftar di sistem</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Tersedia -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative">
        <div class="flex justify-between items-start mb-1">
          <h3 class="text-gray-500 text-sm font-medium">Asset Tersedia</h3>
          <div class="text-brand-accent bg-green-50 p-1.5 rounded-full">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 mb-1">{{ data.stats.available_assets }} <span class="text-sm font-normal text-gray-500">Unit</span></p>
        <p class="text-xs text-gray-500 mb-4">Siap untuk digunakan/dipinjam</p>
        
      </div>

      <!-- Card 3: Sedang Dipinjam -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative">
        <div class="flex justify-between items-start mb-1">
          <h3 class="text-gray-500 text-sm font-medium">Asset yang Dipinjam</h3>
          <div class="text-blue-500 bg-blue-50 p-1.5 rounded-full">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 mb-1">{{ data.stats.borrowed_assets }} <span class="text-sm font-normal text-gray-500">Unit</span></p>
        <p class="text-xs text-gray-500 mb-4">Sedang digunakan oleh karyawan</p>
      </div>

      <!-- Card 4: Karyawan -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative">
        <div class="flex justify-between items-start mb-1">
          <h3 class="text-gray-500 text-sm font-medium">Jumlah Karyawan</h3>
          <div class="text-orange-500 bg-orange-50 p-1.5 rounded-full">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 mb-1">{{ data.stats.total_users }} <span class="text-sm font-normal text-gray-500">Orang</span></p>
        <p class="text-xs text-gray-500 mb-4">Terdaftar dalam sistem</p>
      </div>

    </div>

    <!-- Middle Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Chart -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm lg:col-span-2 flex flex-col h-[350px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-900">Grafik Peminjaman Aset</h3>
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">Tahun {{ data?.chart?.year || new Date().getFullYear() }}</span>
        </div>
        
        <div v-if="!pending && data" class="flex-1 mt-4 relative overflow-x-auto overflow-y-hidden pb-2"><div class="flex items-end justify-between gap-2 min-w-[500px] h-full">
          <!-- Custom Bar Chart via HTML/CSS -->
          <div v-for="(val, idx) in chartDataArray" :key="idx" class="flex flex-col items-center flex-1 group justify-end h-full">
            <div class="relative w-full flex justify-center h-[200px] items-end group-hover:opacity-80 transition-opacity">
              <div class="w-full max-w-[40px] bg-brand-dark rounded-t-sm transition-all duration-500" :style="{ height: getBarHeight(val) + '%' }"></div>
              <!-- Tooltip on hover -->
              <div class="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                {{ val }} Peminjaman
              </div>
            </div>
            <span class="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium uppercase">{{ getMonthName(idx) }}</span></div></div></div><div v-else class="flex-1 flex items-center justify-center">
          <div class="animate-spin w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full"></div>
        </div>
      </div>

      <!-- Shortcut Card -->
      <div class="bg-gradient-to-br from-brand-dark to-[#164175] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center h-[350px] relative overflow-hidden">
        <svg class="absolute top-0 left-0 w-32 h-32 text-white opacity-5 -translate-x-1/4 -translate-y-1/4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
        <div class="relative w-full flex flex-col items-center">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-4 backdrop-blur-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Pinjam Aset Baru</h3>
          <p class="text-gray-300 text-sm mb-6 max-w-[200px] mx-auto leading-relaxed">Buat dokumen STTB baru dan serah terima aset dengan cepat dan mudah.</p>
          <NuxtLink to="/products/transfer" class="w-full sm:w-auto px-6 py-3 bg-white text-brand-dark hover:bg-gray-50 rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
            Mulai Peminjaman
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </NuxtLink>
        </div>
      </div>
      
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h3 class="font-bold text-gray-900 text-lg">Riwayat Peminjaman Terkini</h3>
        <NuxtLink to="/history" class="text-sm font-bold text-brand-dark hover:underline">Lihat Semua</NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse block md:table">
          <thead class="hidden md:table-header-group">
            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <th class="px-6 py-4 font-bold">Waktu & Tanggal</th>
              <th class="px-6 py-4 font-bold">Informasi Aset</th>
              <th class="px-6 py-4 font-bold">Peminjam</th>
              <th class="px-6 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm md:divide-y md:divide-gray-100 block md:table-row-group p-4 md:p-0 space-y-4 md:space-y-0 bg-gray-50/50 md:bg-transparent">
            <tr v-if="pending" class="block md:table-row bg-white border border-gray-100 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none p-2 md:p-0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 block md:table-cell">Memuat data riwayat...</td>
            </tr>
            <tr v-else-if="!data?.recent_history?.length" class="block md:table-row bg-white border border-gray-100 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none p-2 md:p-0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 block md:table-cell">Belum ada riwayat peminjaman.</td>
            </tr>
            <tr v-else v-for="history in data.recent_history" :key="history.id" class="hover:bg-gray-50 transition-colors block md:table-row bg-white border border-gray-100 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none p-2 md:p-0">
              <td class="p-4 md:px-6 md:py-4 block md:table-cell border-b border-gray-50 md:border-none">
                <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Waktu & Tanggal</div>
                <p class="font-medium text-gray-900">{{ formatDate(history.created_at) }}</p>
                <p class="text-gray-500 text-xs">{{ formatTime(history.created_at) }}</p>
              </td>
              <td class="p-4 md:px-6 md:py-4 block md:table-cell border-b border-gray-50 md:border-none">
                <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Informasi Aset</div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 line-clamp-1">{{ history.product?.nama_asset || history.product?.description || '-' }}</p>
                    <p class="text-gray-500 text-xs font-mono">SN: {{ history.product?.serial_number || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4 md:px-6 md:py-4 block md:table-cell border-b border-gray-50 md:border-none">
                <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Peminjam</div>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-[10px] font-bold">
                    {{ getInitials(history.receiver?.name) || '?' }}
                  </div>
                  <span class="font-medium text-gray-900">{{ history.receiver?.name || '-' }}</span>
                </div>
              </td>
              <td class="p-4 md:px-6 md:py-4 block md:table-cell">
                <div class="md:hidden text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                <span v-if="!history.tanggal_kembali && !history.returned_date" class="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 flex items-center gap-1 w-max">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Dipinjam
                </span>
                <span v-else class="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100 flex items-center gap-1 w-max">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Dikembalikan
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'



const data = ref(null)
const pending = ref(true)
const error = ref(null)

const fetchData = async () => {
  pending.value = true
  error.value = null
  try {
    const res = await $api('/dashboard')
    data.value = res
  } catch (err) {
    console.error('Gagal mengambil data dashboard:', err)
    error.value = "[HTTP ${err?.response?.status || 'Unknown'}] ${err?.data?.message || err?.message || 'Gagal terhubung'}"
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchData()
})

// Helper functions for chart
const chartDataArray = computed(() => {
  if (!data.value || !data.value.chart || !data.value.chart.data) return []
  return Object.values(data.value.chart.data)
})

const maxChartValue = computed(() => {
  const vals = chartDataArray.value
  if (!vals.length) return 10
  const max = Math.max(...vals)
  return max < 10 ? 10 : max
})

const getBarHeight = (val) => {
  const max = maxChartValue.value
  if (max === 0) return 0
  return (val / max) * 100
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const getMonthName = (idx) => months[idx]

// Helpers for table
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
}
const getInitials = (name) => {
  if (!name) return ''
  const words = name.split(' ')
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}
</script>

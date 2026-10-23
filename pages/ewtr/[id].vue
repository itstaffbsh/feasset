<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-0 pb-12">
    <!-- Top Bar Navigation -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink 
          to="/ewtr" 
          class="p-2 text-gray-500 hover:text-gray-800 hover:bg-white bg-white/70 border border-gray-200 rounded-xl transition shadow-sm shrink-0"
          title="Kembali ke Daftar EWTR"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2 sm:gap-3">
            <span>Detail Dokumen EWTR</span>
            <span 
              v-if="ewtr" 
              class="text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold border transition-colors inline-flex items-center gap-1.5"
              :class="ewtr.status === 'sukses' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
            >
              <span class="w-2 h-2 rounded-full" :class="ewtr.status === 'sukses' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"></span>
              {{ ewtr.status === 'sukses' ? 'Sukses (Selesai)' : 'Belum Sukses' }}
            </span>
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Nomor: <span class="font-mono font-bold text-gray-800">{{ ewtr?.nomor_ewtr || '-' }}</span>
          </p>
        </div>
      </div>

      <!-- Action: Open & Download full PDF -->
      <div v-if="pdfUrl" class="w-full sm:w-auto flex items-center gap-2">
        <a 
          :href="pdfBlobUrl || pdfUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white border border-gray-200 hover:border-brand-dark text-gray-700 hover:text-brand-dark text-xs font-bold rounded-xl shadow-sm transition"
        >
          <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
          <span>Buka di Tab Baru</span>
        </a>
        <button 
          @click="downloadPdf" 
          type="button"
          class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 bg-brand-dark text-white hover:bg-brand-light text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
          title="Download file PDF"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span class="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <div class="text-gray-400 font-medium">Memuat data EWTR...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="!ewtr" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <div class="text-red-500 font-bold mb-2">Dokumen EWTR tidak ditemukan</div>
      <NuxtLink to="/ewtr" class="text-sm text-blue-600 hover:underline">Kembali ke Daftar EWTR</NuxtLink>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="space-y-4 sm:space-y-6">
      <!-- 1. Header Information & Progress Card -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <!-- Col 1: Document details -->
          <div class="space-y-1 min-w-0">
            <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Keterangan Dokumen</span>
            <p class="text-sm text-gray-800 font-medium leading-relaxed break-words">
              {{ ewtr.keterangan || 'Tidak ada keterangan khusus.' }}
            </p>
          </div>

          <!-- Col 2: Metadata -->
          <div class="space-y-1.5 md:border-l md:border-gray-100 md:pl-6 text-xs text-gray-600 min-w-0">
            <div class="flex items-start gap-1 min-w-0">
              <span class="text-gray-400 shrink-0">File Dokumen:</span> 
              <span class="font-bold text-gray-800 truncate" :title="ewtr.pdf_name || 'Dokumen EWTR.pdf'">
                {{ ewtr.pdf_name || 'Dokumen EWTR.pdf' }}
              </span>
            </div>
            <div class="flex items-center gap-1 min-w-0">
              <span class="text-gray-400 shrink-0">Tanggal Dibuat:</span> 
              <span class="font-bold text-gray-800">{{ formatDate(ewtr.created_at) }}</span>
            </div>
            <div class="flex items-start gap-1 min-w-0">
              <span class="text-gray-400 shrink-0">Status Akhir:</span> 
              <span 
                class="font-bold break-words"
                :class="ewtr.status === 'sukses' ? 'text-emerald-600' : 'text-amber-600'"
              >
                {{ ewtr.status === 'sukses' ? 'Sukses (Selesai)' : 'Belum Sukses' }}
              </span>
            </div>
          </div>

          <!-- Col 3: Checklist Progress Bar -->
          <div class="md:border-l md:border-gray-100 md:pl-6 min-w-0">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="font-bold text-gray-700">Progres Checklist</span>
              <span class="font-bold shrink-0 ml-2" :class="ewtr.status === 'sukses' ? 'text-emerald-600' : 'text-brand-dark'">
                {{ completedCount }} / {{ totalCount }} ({{ progressPercent }}%)
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5">
              <div 
                class="h-full rounded-full transition-all duration-500"
                :class="ewtr.status === 'sukses' ? 'bg-emerald-500' : 'bg-brand-dark'"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <p class="text-[10px] text-gray-400 mt-1.5">
              * Status EWTR akan otomatis menjadi <strong>Sukses</strong> apabila seluruh item checklist di bawah telah selesai.
            </p>
          </div>
        </div>
      </div>

      <!-- 2. Embedded PDF Preview -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-sm font-bold text-gray-900">Preview File Dokumen EWTR</h3>
          </div>
          <div class="flex items-center gap-3">
            <a v-if="pdfUrl" :href="pdfUrl" target="_blank" rel="noopener noreferrer" class="text-xs text-brand-dark hover:underline font-bold hidden sm:inline-flex items-center gap-1">
              Buka Layar Penuh &rarr;
            </a>
            <span class="text-xs text-gray-400">PDF Viewer Terintegrasi</span>
          </div>
        </div>
        
        <!-- Embedded Preview Container -->
        <div class="p-2 sm:p-4 bg-gray-100 flex flex-col items-center">
          <div class="w-full max-w-5xl bg-white rounded-xl shadow border border-gray-200 overflow-hidden min-h-[450px] sm:min-h-[650px] flex flex-col justify-center">
            <!-- Loading indicator -->
            <div v-if="pdfLoading" class="p-16 flex flex-col items-center justify-center gap-3">
              <div class="w-10 h-10 border-4 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"></div>
              <p class="text-sm font-semibold text-gray-600">Memuat preview file PDF...</p>
            </div>

            <!-- Fallback if error loading or no pdf -->
            <div v-else-if="pdfError || !pdfUrl" class="p-10 text-center flex flex-col items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h4 class="text-sm font-bold text-gray-800">Preview PDF Langsung Terbatas</h4>
              <p class="text-xs text-gray-500 mt-1 max-w-md">Dokumen PDF tetap aman tersimpan di server. Anda dapat langsung membuka file di tab baru atau mengunduhnya.</p>
              <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
                <a v-if="pdfUrl" :href="pdfUrl" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold shadow hover:bg-brand-light transition">
                  Buka File di Tab Baru
                </a>
                <button v-if="pdfUrl" @click="downloadPdf" type="button" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition cursor-pointer">
                  Download File PDF
                </button>
              </div>
            </div>

            <!-- Iframe with Blob URL (bypasses cross-origin SAMEORIGIN restrictions) -->
            <iframe 
              v-else-if="pdfBlobUrl" 
              :src="pdfBlobUrl" 
              class="w-full h-[450px] sm:h-[650px] border-0"
              title="Preview Dokumen EWTR"
            >
              <div class="p-8 text-center text-sm text-gray-500">
                Browser Anda tidak mendukung preview PDF langsung. 
                <button @click="downloadPdf" type="button" class="text-blue-600 underline font-bold ml-1">Klik di sini untuk mengunduh file PDF</button>.
              </div>
            </iframe>
          </div>
          <div v-if="pdfUrl" class="mt-2 text-xs text-gray-500 text-center">
            Jika preview PDF tidak tampil di browser, silakan 
            <a :href="pdfBlobUrl || pdfUrl" target="_blank" rel="noopener noreferrer" class="text-brand-dark underline font-bold">klik di sini untuk membuka di tab baru</a> atau 
            <button @click="downloadPdf" type="button" class="text-brand-dark underline font-bold cursor-pointer">unduh langsung</button>.
          </div>
        </div>
      </div>

      <!-- 3. List Checklist Items Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-sm font-bold text-gray-900">List Checklist Tools EWTR</h3>
            <p class="text-xs text-gray-500">Daftar item tools yang wajib dipersiapkan / diselesaikan untuk EWTR ini.</p>
          </div>
          <div class="text-xs font-bold text-gray-600">
            Total Item: {{ ewtr.items?.length || 0 }}
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div v-if="!ewtr.items || ewtr.items.length === 0" class="p-8 text-center text-gray-400 text-sm">
            Tidak ada item checklist dalam EWTR ini.
          </div>

          <div 
            v-else 
            v-for="(item, index) in ewtr.items" 
            :key="item.id"
            class="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors"
            :class="item.is_completed ? 'bg-emerald-50/30' : 'hover:bg-gray-50/60'"
          >
            <!-- Left: Checkbox Icon, Index, Item Name -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span 
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                :class="item.is_completed ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500'"
              >
                <svg v-if="item.is_completed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>{{ index + 1 }}</span>
              </span>

              <div class="min-w-0 flex-1">
                <p 
                  class="text-xs sm:text-sm font-bold truncate transition-colors"
                  :class="item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'"
                >
                  {{ item.item_name }}
                </p>
                <p v-if="item.is_completed && item.completed_at" class="text-[11px] text-emerald-600">
                  Diselesaikan pada: {{ formatDateTime(item.completed_at) }}
                </p>
                <p v-else class="text-[11px] text-gray-400">
                  Status: Menunggu penyelesaian
                </p>
              </div>
            </div>

            <!-- Right: Action Button or Selesai + Undo -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <!-- If NOT completed: Tombol Selesai (Triggers confirmation modal) -->
              <button 
                v-if="!item.is_completed"
                @click="confirmComplete(item)"
                class="bg-brand-dark hover:bg-brand-light active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-brand-dark/20 transition-all flex items-center gap-1.5"
              >
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Selesai</span>
              </button>

              <!-- If COMPLETED: Text Selesai with small Undo button next to it -->
              <div v-else class="flex items-center gap-2">
                <!-- Text Selesai Badge -->
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Selesai</span>
                </span>

                <!-- Small Undo Button (Kembalikan ke belum selesai) -->
                <button 
                  @click="undoComplete(item)"
                  class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-transparent hover:border-amber-200"
                  title="Kembalikan status item ini menjadi belum selesai"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4" />
                  </svg>
                  <span class="text-[11px]">Undo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()
const swal = inject('swal')

const ewtr = ref(null)
const pending = ref(true)
const pdfBlobUrl = ref(null)
const pdfLoading = ref(false)
const pdfError = ref(false)

const ewtrId = route.params.id

const fetchEwtrDetail = async () => {
  pending.value = true
  try {
    const res = await $api(`/ewtrs/${ewtrId}`)
    ewtr.value = res
  } catch (e) {
    console.error('Failed fetching EWTR detail:', e)
  } finally {
    pending.value = false
  }
}

const pdfUrl = computed(() => {
  if (!ewtr.value) return null
  const backendBase = config.public.apiBase.replace(/\/api\/?$/, '')
  if (ewtr.value.pdf_path) {
    const cleanPath = ewtr.value.pdf_path.replace(/^\/?storage\/?/, '')
    return `${backendBase}/storage/${cleanPath}`
  }
  return ewtr.value.pdf_url || null
})

const downloadUrl = computed(() => {
  if (!pdfUrl.value) return '#'
  return pdfUrl.value.includes('?') ? `${pdfUrl.value}&download=1` : `${pdfUrl.value}?download=1`
})

const loadPdfBlob = async (url) => {
  if (!url) {
    pdfBlobUrl.value = null
    return
  }
  pdfLoading.value = true
  pdfError.value = false
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
    }
    pdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (err) {
    console.error('Failed loading PDF blob for preview:', err)
    pdfError.value = true
  } finally {
    pdfLoading.value = false
  }
}

watch(pdfUrl, (newUrl) => {
  if (newUrl) {
    loadPdfBlob(newUrl)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
  }
})

const downloadPdf = async () => {
  const filename = ewtr.value?.pdf_name || `EWTR_${ewtr.value?.nomor_ewtr || 'document'}.pdf`
  if (pdfBlobUrl.value) {
    const a = document.createElement('a')
    a.href = pdfBlobUrl.value
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return
  }

  if (pdfUrl.value) {
    try {
      const res = await fetch(pdfUrl.value)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      window.open(downloadUrl.value, '_blank')
    }
  }
}

const totalCount = computed(() => {
  return ewtr.value?.items?.length || 0
})

const completedCount = computed(() => {
  return ewtr.value?.items?.filter(i => i.is_completed).length || 0
})

const progressPercent = computed(() => {
  if (!totalCount.value || totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 1. Confirm Complete Modal
const confirmComplete = async (item) => {
  const result = await swal.fire({
    title: 'Konfirmasi Penyelesaian',
    text: `Apakah Anda yakin checklist "${item.item_name}" ini sudah selesai?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2d3e50',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Selesai',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      const res = await $api(`/ewtrs/${ewtrId}/items/${item.id}/toggle`, {
        method: 'POST',
        body: { is_completed: true }
      })

      // Update local item
      item.is_completed = true
      item.completed_at = new Date().toISOString()
      
      // Update EWTR status from response
      if (res.ewtr) {
        ewtr.value.status = res.ewtr.status
      }

      // Check if all are completed
      if (ewtr.value.status === 'sukses') {
        swal.fire({
          title: 'EWTR Sukses!',
          text: `Semua checklist telah selesai! Status dokumen EWTR kini telah menjadi Sukses.`,
          icon: 'success',
          confirmButtonColor: '#2d3e50'
        })
      } else {
        swal.fire({
          title: 'Selesai!',
          text: `Item "${item.item_name}" berhasil ditandai selesai.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (e) {
      swal.fire('Error', 'Gagal memperbarui status checklist.', 'error')
    }
  }
}

// 2. Undo Complete Action
const undoComplete = async (item) => {
  try {
    const res = await $api(`/ewtrs/${ewtrId}/items/${item.id}/toggle`, {
      method: 'POST',
      body: { is_completed: false }
    })

    // Update local item
    item.is_completed = false
    item.completed_at = null

    // Update EWTR status from response
    if (res.ewtr) {
      ewtr.value.status = res.ewtr.status
    }

    swal.fire({
      title: 'Status Diubah',
      text: `Item "${item.item_name}" dikembalikan ke status belum selesai.`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (e) {
    swal.fire('Error', 'Gagal mengembalikan status item.', 'error')
  }
}

onMounted(() => {
  fetchEwtrDetail()
})
</script>

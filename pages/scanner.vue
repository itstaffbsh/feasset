<template>
  <div class="p-4 sm:p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-dark/10 text-brand-dark flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <span>Scan QR Aset</span>
        </h1>
        <NuxtLink to="/products" class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-dark transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Kembali</span>
        </NuxtLink>
      </div>

      <!-- Scanner Box -->
      <div class="flex flex-col items-center justify-center">
        
        <!-- Viewfinder Frame with Top-Right Flip Camera Button -->
        <div class="relative w-full max-w-md aspect-square bg-gray-950 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-inner mb-4 flex items-center justify-center">
          
          <!-- Camera Feed Target -->
          <div id="reader" class="w-full h-full object-cover"></div>

          <!-- Top-Right Flip Camera Button (Only button, no select) -->
          <button 
            v-if="isScanning" 
            type="button" 
            @click="flipCamera" 
            class="absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-md active:scale-90 border border-white/20 flex items-center justify-center"
            title="Ganti / Flip Kamera"
            aria-label="Flip Kamera"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <!-- Flip / Rotate Camera Icon -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <!-- Scanner Reticle / Crosshair Guide Overlay -->
          <div v-if="isScanning && !loading" class="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div class="w-56 h-56 sm:w-64 sm:h-64 border border-white/30 rounded-2xl relative shadow-2xl">
              <!-- Corner Highlights -->
              <div class="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
              <div class="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
              <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>
              
              <!-- Subtle Scanning Laser Line -->
              <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          <!-- Loading / Verifying State -->
          <div v-if="loading" class="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6">
            <svg class="animate-spin h-10 w-10 text-emerald-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="font-bold text-base text-emerald-400">QR Terdeteksi</p>
            <p class="text-xs text-gray-300 mt-1">Sedang membuka data aset...</p>
          </div>

          <!-- Camera Permission / Error State -->
          <div v-if="cameraError && !loading" class="absolute inset-0 z-20 bg-gray-900/90 text-white p-6 flex flex-col items-center justify-center text-center">
            <svg class="w-12 h-12 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm font-bold text-gray-100 mb-1">Akses Kamera Diperlukan</p>
            <p class="text-xs text-gray-400 max-w-xs mb-4">{{ cameraError }}</p>
            <button 
              type="button" 
              @click="startCamera" 
              class="px-4 py-2 bg-brand-dark hover:bg-brand-light text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Izinkan & Coba Lagi
            </button>
          </div>

        </div>

        <!-- Guidance Text -->
        <p class="text-xs sm:text-sm text-gray-500 text-center max-w-md leading-relaxed">
          Arahkan kamera ke QR Code yang tertempel pada fisik aset. Kamera belakang aktif otomatis saat membuka halaman ini.
        </p>

        <!-- Divider with OR text -->
        <div class="relative w-full max-w-md my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-3.5 text-gray-400 font-bold tracking-wider">OR</span>
          </div>
        </div>

        <!-- Upload Image QR Option -->
        <div class="w-full max-w-md">
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="onImageFileSelected" 
          />
          <button 
            type="button" 
            @click="$refs.fileInput.click()" 
            :disabled="loading || processingFile"
            class="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-dark bg-gray-50/70 hover:bg-gray-100/70 text-gray-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            <div class="w-8 h-8 rounded-lg bg-white border border-gray-200 group-hover:border-brand-dark flex items-center justify-center text-gray-500 group-hover:text-brand-dark transition-colors shadow-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span>{{ processingFile ? 'Sedang memindai gambar...' : 'Upload Gambar QR Code dari Perangkat' }}</span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { $swal: swal } = useNuxtApp()

const loading = ref(false)
const isScanning = ref(false)
const cameraError = ref('')
const currentFacingMode = ref('environment') // Otomatis kamera belakang di mobile
const availableCameras = ref([])
const currentCameraIndex = ref(0)
const fileInput = ref(null)
const processingFile = ref(false)

let html5QrCode = null

// Load html5-qrcode script via head
useHead({
  script: [
    {
      src: 'https://unpkg.com/html5-qrcode',
      onload: () => {
        startCamera()
      }
    }
  ]
})

const startCamera = async () => {
  if (typeof Html5Qrcode === 'undefined') return
  
  cameraError.value = ''

  try {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader")
    }

    if (html5QrCode.isScanning) {
      await html5QrCode.stop()
    }

    // Tentukan konfigurasi kamera: jika kamera spesifik terdeteksi, gunakan deviceId; jika tidak, gunakan facingMode (kamera belakang)
    let cameraConfig
    if (availableCameras.value.length > 0 && availableCameras.value[currentCameraIndex.value]?.id) {
      cameraConfig = { deviceId: { exact: availableCameras.value[currentCameraIndex.value].id } }
    } else {
      cameraConfig = { facingMode: currentFacingMode.value }
    }

    await html5QrCode.start(
      cameraConfig,
      {
        fps: 12,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const edge = Math.min(viewfinderWidth, viewfinderHeight) * 0.7
          return { width: Math.round(edge), height: Math.round(edge) }
        },
        aspectRatio: 1.0
      },
      onScanSuccess,
      onScanFailure
    )

    isScanning.value = true

    // Enumerasi kamera yang tersedia untuk flip multi-kamera jika didukung browser
    if (availableCameras.value.length === 0 && Html5Qrcode.getCameras) {
      try {
        const devices = await Html5Qrcode.getCameras()
        if (devices && devices.length > 0) {
          availableCameras.value = devices
        }
      } catch (e) {
        // Abaikan jika browser tidak mengizinkan enumerasi
      }
    }
  } catch (err) {
    console.warn("Gagal membuka kamera:", err)
    isScanning.value = false
    cameraError.value = 'Silakan izinkan permissions kamera browser untuk memindai QR Code aset.'
  }
}

// Tombol Flip Kamera di pojok kanan atas
const flipCamera = async () => {
  if (!html5QrCode) return

  try {
    if (availableCameras.value.length > 1) {
      currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length
    } else {
      currentFacingMode.value = currentFacingMode.value === 'environment' ? 'user' : 'environment'
    }

    await startCamera()
  } catch (err) {
    console.error("Gagal mengganti kamera:", err)
  }
}

// Memindai QR Code dari file gambar yang diupload
const onImageFileSelected = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Reset input agar file yang sama bisa dipilih ulang jika diinginkan
  e.target.value = ''

  if (!file.type.startsWith('image/')) {
    swal.fire('File Tidak Sesuai', 'Harap pilih file gambar (JPG, PNG, WebP, dll).', 'warning')
    return
  }

  processingFile.value = true

  try {
    // Hentikan kamera live jika sedang berjalan
    if (html5QrCode && html5QrCode.isScanning) {
      await html5QrCode.stop()
      isScanning.value = false
    }

    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader")
    }

    // Pindai gambar via Html5Qrcode scanFile
    const decodedText = await html5QrCode.scanFile(file, true)
    if (decodedText) {
      await onScanSuccess(decodedText)
    } else {
      throw new Error('QR code tidak ditemukan')
    }
  } catch (err) {
    console.warn("Scan image error:", err)
    swal.fire({
      title: 'QR Code Tidak Terdeteksi',
      text: 'Tidak dapat menemukan QR Code pada gambar yang diupload. Pastikan gambar jelas dan tidak blur.',
      icon: 'warning',
      confirmButtonText: 'Coba Lagi'
    })
    // Nyalakan kembali kamera live
    await startCamera()
  } finally {
    processingFile.value = false
  }
}

const onScanSuccess = async (decodedText) => {
  if (loading.value) return // Cegah trigger ganda

  loading.value = true

  // Segera hentikan kamera saat barcode terdeteksi
  if (html5QrCode && html5QrCode.isScanning) {
    try {
      await html5QrCode.stop()
      isScanning.value = false
    } catch (e) {
      console.error("Gagal menghentikan scanner:", e)
    }
  }

  // Ekstrak token dari URL hasil scan
  let token = decodedText ? decodedText.trim() : ''
  if (token.includes('/scan/')) {
    token = token.split('/scan/').pop()
  }

  await processToken(token)
}

const onScanFailure = () => {
  // Silent frame scan failure
}

const processToken = async (token) => {
  if (!token) {
    loading.value = false
    await startCamera()
    return
  }

  try {
    const res = await $api(`/scan/${token}`)
    const product = res.data?.product || res.data

    if (product && product.id) {
      router.push(`/scan/${token}`)
    } else {
      swal.fire('Error', 'Data aset tidak ditemukan dari token ini.', 'error')
      await startCamera()
    }
  } catch (e) {
    swal.fire('Error', 'Aset tidak ditemukan atau QR tidak valid.', 'error')
    await startCamera()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (typeof Html5Qrcode !== 'undefined') {
    startCamera()
  }
})

onBeforeUnmount(async () => {
  if (html5QrCode && html5QrCode.isScanning) {
    try {
      await html5QrCode.stop()
      await html5QrCode.clear()
    } catch (error) {
      console.error("Gagal membersihkan scanner:", error)
    }
  }
})
</script>

<style>
/* Memastikan video kamera mengisi penuh frame viewfinder secara bersih */
#reader {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}

#reader video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border-radius: 1rem;
}

#reader__scan_region {
  background: transparent !important;
}

#reader img {
  display: none !important;
}
</style>

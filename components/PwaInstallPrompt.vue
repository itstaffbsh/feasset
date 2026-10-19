<template>
  <!-- Only display on mobile devices when not in standalone mode and not dismissed -->
  <div 
    v-if="showPrompt && !isStandalone" 
    class="fixed top-3 inset-x-3 z-50 lg:hidden transition-all duration-300 transform"
  >
    <div class="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-200/80 flex items-center justify-between gap-3">
      <!-- App Icon & Info -->
      <div class="flex items-center gap-3 min-w-0">
        <img 
          src="/icon-192x192.png" 
          alt="Asset BSH" 
          class="w-12 h-12 rounded-xl shadow-md border border-gray-100 flex-shrink-0 object-cover"
        />
        <div class="min-w-0">
          <h4 class="text-sm font-bold text-gray-900 truncate">Asset BSH Mobile</h4>
          <p class="text-[11px] text-gray-500 leading-snug truncate">
            {{ isIOS ? 'Tambahkan ke Layar Utama' : 'Install aplikasi di HP Anda' }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Android / Desktop Chrome Install Button -->
        <button 
          v-if="isInstallable"
          @click="installPwa"
          class="bg-brand-dark hover:bg-brand-light text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-brand-dark/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Install
        </button>

        <!-- iOS Guide Trigger Button -->
        <button 
          v-else-if="isIOS"
          @click="showIOSGuide = !showIOSGuide"
          class="bg-brand-dark hover:bg-brand-light text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
        >
          <span>Panduan</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Dismiss Button -->
        <button 
          @click="dismissPrompt"
          class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          title="Tutup"
          aria-label="Tutup"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- iOS Instructions Dropdown -->
    <div 
      v-if="isIOS && showIOSGuide" 
      class="mt-2 bg-gray-900/95 text-white p-3.5 rounded-xl text-xs space-y-2 backdrop-blur-md shadow-2xl border border-gray-700 animate-fadeIn"
    >
      <div class="font-bold flex items-center gap-1.5 text-emerald-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Cara Pasang di Safari iOS:
      </div>
      <ol class="list-decimal list-inside space-y-1 text-gray-200">
        <li>Tap tombol <strong>Bagikan (Share)</strong> <span class="inline-block px-1 bg-gray-800 rounded">📤</span> di bilah bawah browser Safari.</li>
        <li>Gulir ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
        <li>Tap <strong>Tambah (Add)</strong> di pojok kanan atas.</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)
const isInstallable = ref(false)
const isIOS = ref(false)
const showIOSGuide = ref(false)
const showPrompt = ref(false)
const isStandalone = ref(false)

onMounted(() => {
  // Check if already running in standalone mode (installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    isStandalone.value = true
    return
  }

  // Check if user previously dismissed prompt in this session
  const dismissed = sessionStorage.getItem('pwa_prompt_dismissed')
  if (dismissed) {
    return
  }

  // Detect iOS
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
  if (isIosDevice) {
    isIOS.value = true
    showPrompt.value = true
  }

  // Listen for beforeinstallprompt (Android Chrome / Chromium)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
    showPrompt.value = true
  })

  // Listen for app installed
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
    isInstallable.value = false
  })
})

const installPwa = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    showPrompt.value = false
  }
  deferredPrompt.value = null
  isInstallable.value = false
}

const dismissPrompt = () => {
  showPrompt.value = false
  sessionStorage.setItem('pwa_prompt_dismissed', 'true')
}
</script>

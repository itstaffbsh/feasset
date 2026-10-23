<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Top Branding & Navigation Bar -->
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-brand-dark rounded-xl flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <span class="text-xl font-black text-brand-dark tracking-tight">ASSET<span class="text-brand-accent">PRO</span></span>
        </div>

        <!-- Action Buttons: Back to Home & Scan Lagi -->
        <div class="flex items-center gap-2">
          <NuxtLink 
            to="/scanner" 
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-brand-dark text-gray-700 hover:text-brand-dark rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="Scan QR aset lainnya"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Scan Lagi</span>
          </NuxtLink>

          <NuxtLink 
            to="/dashboard" 
            class="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-dark hover:bg-brand-light text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
            title="Kembali ke Dashboard Utama"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <svg class="animate-spin h-10 w-10 text-brand-dark mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm font-semibold text-gray-700">Memuat detail aset...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 text-center shadow-sm">
        <svg class="w-14 h-14 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h2 class="text-lg font-bold text-red-900">Aset Tidak Ditemukan</h2>
        <p class="text-sm text-red-600 mt-1 max-w-md mx-auto">QR Code tidak valid atau aset telah dihapus dari sistem.</p>
        
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink 
            to="/dashboard" 
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark hover:bg-brand-light text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home (Dashboard)</span>
          </NuxtLink>

          <NuxtLink 
            to="/scanner" 
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-brand-dark text-gray-700 hover:text-brand-dark rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Scan QR Lain</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left Column (Status Card & Action Buttons) -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            
            <div class="w-full text-center space-y-4">
              <div class="inline-flex items-center justify-center p-4 rounded-full mb-2" :class="isReady ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
                <svg v-if="isReady" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-gray-400 font-bold">Status Saat Ini</p>
                <p class="text-2xl font-black mt-0.5" :class="isReady ? 'text-green-600' : 'text-blue-600'">{{ isReady ? 'READY' : 'DIPINJAM' }}</p>
              </div>
              <div v-if="!isReady" class="bg-gray-50 rounded-xl p-3.5 text-left border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Peminjam</p>
                <p class="text-sm font-bold text-gray-900">{{ currentHistory?.receiver?.name || '-' }}</p>
              </div>
            </div>

            <!-- Divider -->
            <div class="w-full border-t border-gray-100 my-5"></div>

            <!-- Action Buttons Inside Card -->
            <div class="w-full space-y-2.5">
              <NuxtLink 
                to="/dashboard" 
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-dark hover:bg-brand-light text-white rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Back to Home</span>
              </NuxtLink>

              <NuxtLink 
                to="/scanner" 
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>Scan QR Lain</span>
              </NuxtLink>
            </div>

          </div>
        </div>

        <!-- Right Column (Asset Details) -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Informasi Aset
                  <span class="px-2.5 py-0.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 font-bold">{{ product?.full_nomor_unik || '-' }}</span>
                </h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p class="text-xs text-gray-400 mb-1">Nama Aset</p>
                  <p class="font-bold text-gray-900 text-base">{{ product.description || '-' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-400 mb-1">Nomor Seri / SN</p>
                  <p class="font-bold text-gray-900 text-base font-mono">{{ product.serial_number || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">Kategori Aset</p>
                  <p class="font-medium text-gray-900 text-sm">{{ product.classification?.nama_klasifikasi || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">Departemen / Lokasi</p>
                  <p class="font-medium text-gray-900 text-sm">{{ product.department?.nama_departemen || '-' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-400 mb-1">Processor / RAM</p>
                  <p class="font-medium text-gray-900 text-sm">{{ product.processor || '-' }} / {{ product.ram || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">OS / Penyimpanan</p>
                  <p class="font-medium text-gray-900 text-sm">{{ product.os || '-' }} / {{ product.ssd || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Bottom Back to Home Link (mobile convenience) -->
            <div class="pt-8 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Sistem Manajemen Aset Bali Superhost</span>
              <NuxtLink to="/dashboard" class="font-bold text-brand-dark hover:underline flex items-center gap-1">
                <span>Dashboard Utama</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()

const { data: fetchRes, pending: isPending, error: fetchErr } = await useApiFetch(`/scan/${route.params.token}`)

const product = computed(() => fetchRes.value?.data || null)
const pending = computed(() => isPending.value)
const error = computed(() => !!fetchErr.value || !fetchRes.value)

const isReady = computed(() => {
  if (!product.value) return true;
  if (!product.value.histories || product.value.histories.length === 0) return true;
  return product.value.histories[0].receiver == null;
})

const currentHistory = computed(() => {
  if (!product.value || !product.value.histories) return null;
  return product.value.histories[0];
})
</script>

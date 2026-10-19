<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Top Branding (Visible mostly for public) -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <span class="text-xl font-black text-brand-dark tracking-tight">ASSET<span class="text-brand-accent">PRO</span></span>
        </div>
      </div>

      <div v-if="pending" class="text-center py-12 text-gray-500">Memuat detail aset...</div>
      
      <div v-else-if="error" class="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center shadow-sm">
        <svg class="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h2 class="text-lg font-bold">Aset Tidak Ditemukan</h2>
        <p class="text-sm mt-1">QR Code tidak valid atau aset telah dihapus dari sistem.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left Column (Status Card) -->
        <div class="space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            
            <div class="w-full text-center space-y-4">
              <div class="inline-flex items-center justify-center p-4 rounded-full mb-2" :class="isReady ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
                <svg v-if="isReady" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Status Saat Ini</p>
                <p class="text-2xl font-black" :class="isReady ? 'text-green-600' : 'text-blue-600'">{{ isReady ? 'READY' : 'DIPINJAM' }}</p>
              </div>
              <div v-if="!isReady" class="bg-gray-50 rounded-lg p-3 text-left border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Peminjam</p>
                <p class="text-sm font-bold text-gray-900">{{ currentHistory?.receiver?.name || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column (Asset Details) -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full">
            <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                Informasi Aset
                <span class="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-500">{{ product?.full_nomor_unik || '-' }}</span>
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
        </div>
      </div>
      
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

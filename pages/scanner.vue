<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg class="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
          Scan QR Aset
        </h1>
        <NuxtLink to="/products" class="text-sm font-medium text-gray-500 hover:text-brand-dark">Kembali</NuxtLink>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div id="reader" class="w-full max-w-lg overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 mb-4"></div>
        <p v-if="loading" class="text-brand-dark font-medium animate-pulse">Sedang memverifikasi...</p>
        <p v-else class="text-sm text-gray-500 text-center max-w-md">
          Arahkan kamera ke QR Code yang tertempel pada fisik aset. Sistem akan otomatis mendeteksi dan membuka detail aset.
        </p>
      </div>

      <!-- Fallback Input -->
      <div class="mt-8 pt-8 border-t border-gray-100">
        <p class="text-sm text-gray-500 mb-3 font-medium text-center">Atau masukkan Token URL / Nomor Seri secara manual:</p>
        <form @submit.prevent="processToken(manualToken)" class="flex max-w-md mx-auto gap-2">
          <input v-model="manualToken" type="text" placeholder="Contoh: a1b2c3d4..." class="flex-1 rounded-lg border-gray-300 shadow-sm px-4 py-2 border focus:ring-brand-dark focus:border-brand-dark">
          <button type="submit" class="bg-brand-dark text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-light shadow-sm">Cari</button>
        </form>
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
const manualToken = ref('')

let html5QrcodeScanner = null

// Load html5-qrcode script
useHead({
  script: [
    {
      src: 'https://unpkg.com/html5-qrcode',
      onload: () => { initScanner() }
    }
  ]
})

const initScanner = () => {
  if (typeof Html5QrcodeScanner === 'undefined') return;
  
  html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { fps: 10, qrbox: {width: 250, height: 250}, rememberLastUsedCamera: true },
    /* verbose= */ false
  );
  
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

const onScanSuccess = (decodedText, decodedResult) => {
  if (loading.value) return; // Prevent multiple triggers
  
  // Clean up scanner immediately
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(error => {
      console.error("Failed to clear html5QrcodeScanner. ", error);
    });
  }

  // Extract token. The decoded text is usually a URL like "http://localhost:3000/scan/123xyz"
  // We can just extract the last part, or send it directly.
  let token = decodedText;
  if (token.includes('/scan/')) {
    token = token.split('/scan/').pop();
  }
  
  processToken(token);
}

const onScanFailure = (error) => {
  // handle scan failure, usually better to ignore and keep scanning
}

const processToken = async (token) => {
  if (!token) return;
  
  // First, we need to find the product ID associated with this token so we can redirect to /products/[id]
  loading.value = true;
  try {
    const res = await $api(`/scan/${token}`);
    const product = res.data?.product || res.data;
    
    if (product && product.id) {
       router.push(`/scan/${token}`);
    } else {
       swal.fire('Error', 'Data aset tidak lengkap dari token ini.', 'error');
       // Reload scanner
       initScanner();
    }
  } catch (e) {
    swal.fire('Error', 'Aset tidak ditemukan atau QR tidak valid.', 'error');
    initScanner();
  } finally {
    loading.value = false;
  }
}

onBeforeUnmount(() => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(error => {
      console.error("Failed to clear scanner on unmount", error);
    });
  }
})
</script>

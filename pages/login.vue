<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F2F4FD] py-6 px-4 sm:px-6 lg:px-8 font-sans antialiased">
    <!-- Main Card Container -->
    <div class="max-w-md md:max-w-4xl w-full bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(45,62,80,0.12)] border border-gray-100 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-stretch">
      
      <!-- Left Panel: Hidden on mobile, visible on md+ screens, background replaced with Gambar 2 (Villa) -->
      <div class="hidden md:flex relative rounded-[24px] overflow-hidden p-8 sm:p-10 flex-col justify-between min-h-[420px] md:min-h-[520px] text-white select-none">
        <!-- Background Image (Gambar 2: Villa BSH) -->
        <img 
          src="/img/login-bg.webp" 
          alt="BSH Property" 
          class="absolute inset-0 w-full h-full object-cover object-center"
        >

        <!-- Dark Gradient Overlay for optimal text readability & luxury contrast -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-gray-950/40"></div>

        <!-- Top Logo Icon: Asterisk -->
        <div class="relative z-10">
          <svg class="w-9 h-9 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v5.99l4.24-4.24a1.5 1.5 0 1 1 2.12 2.12l-4.24 4.24h5.88a1.5 1.5 0 1 1 0 3h-5.88l4.24 4.24a1.5 1.5 0 1 1-2.12 2.12l-4.24-4.24v5.88a1.5 1.5 0 1 1-3 0v-5.88l-4.24 4.24a1.5 1.5 0 1 1-2.12-2.12l4.24-4.24H3.5a1.5 1.5 0 1 1 0-3h5.88l-4.24-4.24a1.5 1.5 0 1 1 2.12-2.12l4.24 4.24V3.5A1.5 1.5 0 0 1 12 2z"/>
          </svg>
        </div>

        <!-- Bottom Text Hero -->
        <div class="relative z-10 mt-auto pt-16">
          <p class="text-white/80 text-sm font-medium tracking-wide mb-2">AssetCore Enterprise</p>
          <h2 class="text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-white drop-shadow-md">
            Get access your personal hub for clarity and productivity
          </h2>
          <p class="text-white/80 text-xs mt-3 leading-relaxed drop-shadow-sm">
            Sistem terpadu pengelolaan inventaris, spesifikasi perangkat, dan riwayat peminjaman aset perusahaan.
          </p>
        </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="flex flex-col justify-center px-2 py-4 sm:px-4 sm:py-6 lg:py-8">
        
        <!-- Asterisk Logo Icon -->
        <div class="mb-4 text-brand-dark">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v5.99l4.24-4.24a1.5 1.5 0 1 1 2.12 2.12l-4.24 4.24h5.88a1.5 1.5 0 1 1 0 3h-5.88l4.24 4.24a1.5 1.5 0 1 1-2.12 2.12l-4.24-4.24v5.88a1.5 1.5 0 1 1-3 0v-5.88l-4.24 4.24a1.5 1.5 0 1 1-2.12-2.12l4.24-4.24H3.5a1.5 1.5 0 1 1 0-3h5.88l-4.24-4.24a1.5 1.5 0 1 1 2.12-2.12l4.24 4.24V3.5A1.5 1.5 0 0 1 12 2z"/>
          </svg>
        </div>

        <!-- Heading & Description -->
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Masuk ke Akun</h1>
          <p class="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Silakan masukkan email dan password untuk mengakses sistem manajemen aset.
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="login">
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Karyawan</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              placeholder="nama@perusahaan.com"
              class="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
            >
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="••••••••"
                class="w-full px-4 py-2.5 sm:py-3 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
              >
              <!-- Toggle Visibility Button -->
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                tabindex="-1"
                :title="showPassword ? 'Sembunyikan password' : 'Lihat password'"
              >
                <!-- Eye Off -->
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                <!-- Eye -->
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="text-red-600 bg-red-50 border border-red-100 p-3.5 rounded-xl text-sm font-medium flex items-start gap-2">
            <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Submit Button: Masuk ke Sistem -->
          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="loading" 
              class="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-brand-dark hover:bg-brand-light shadow-lg shadow-brand-dark/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Mengautentikasi...' : 'Masuk ke Sistem' }}
            </button>
          </div>
        </form>

        <!-- Footer Info -->
        <div class="mt-8 pt-6 border-t border-gray-100 text-center">
          <p class="text-xs text-gray-400 font-medium">
            © 2025 AssetCore Enterprise • Keamanan Terproteksi
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const tokenCookie = useCookie('auth_token')

definePageMeta({
  layout: 'auth'
})

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await $api('/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    if (response && response.token) {
      tokenCookie.value = response.token
      await navigateTo('/dashboard')
    }
  } catch (err) {
    errorMessage.value = err.data?.message || 'Login failed, periksa kembali email & password Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-x-hidden font-sans antialiased selection:bg-brand-dark selection:text-white">
    
    <!-- FULLSCREEN BACKGROUND IMAGE (from left image /img/login-bg.webp) -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <img 
        src="/img/login-bg.webp" 
        alt="BSH Background" 
        class="w-full h-full object-cover object-center"
      >
      <!-- Refined Soft Overlay: image is more visible, vibrant, and clean -->
      <div class="absolute inset-0 bg-gradient-to-tr from-white/65 via-sky-50/45 to-blue-100/30"></div>

      <!-- Subtle ambient depth glows -->
      <div class="absolute -top-32 -left-32 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none"></div>
    </div>

    <!-- MAIN TWO-COLUMN CONTENT WRAPPER -->
    <div class="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[85vh]">
      
      <!-- LEFT COLUMN: Brand Hero & Statement (Hidden on Mobile, Visible on Desktop lg+) -->
      <div class="hidden lg:flex lg:col-span-7 flex-col justify-between py-6 lg:py-10 min-h-full select-none">
        
        <!-- Top Brand Badge with subtle glass backdrop for contrast -->
        <div class="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md border border-white/70 shadow-xs px-4 py-2 rounded-2xl w-fit">
          <div class="w-9 h-9 rounded-xl bg-brand-dark text-white flex items-center justify-center shadow-md shadow-brand-dark/25">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v5.99l4.24-4.24a1.5 1.5 0 1 1 2.12 2.12l-4.24 4.24h5.88a1.5 1.5 0 1 1 0 3h-5.88l4.24 4.24a1.5 1.5 0 1 1-2.12 2.12l-4.24-4.24v5.88a1.5 1.5 0 1 1-3 0v-5.88l-4.24 4.24a1.5 1.5 0 1 1-2.12-2.12l4.24-4.24H3.5a1.5 1.5 0 1 1 0-3h5.88l-4.24-4.24a1.5 1.5 0 1 1 2.12-2.12l4.24 4.24V3.5A1.5 1.5 0 0 1 12 2z"/>
            </svg>
          </div>
          <div>
            <span class="text-sm font-bold tracking-tight text-gray-900 block leading-tight">AssetCore Enterprise</span>
            <span class="text-[11px] font-medium text-gray-500">Balisuperhost Management</span>
          </div>
        </div>

        <!-- Center Hero Typography with enhanced clarity -->
        <div class="my-auto py-8 sm:py-12">
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.15] drop-shadow-xs">
            Fast, Efficient and Productive
          </h1>
          <p class="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 max-w-lg leading-relaxed font-medium drop-shadow-xs">
            Sistem terpadu pengelolaan inventaris, spesifikasi perangkat IT, dan riwayat peminjaman aset perusahaan.
          </p>
        </div>

        

      </div>

      <!-- RIGHT COLUMN: Elevated Floating White Card (Centered on Mobile, Right on Desktop) -->
      <div class="col-span-1 lg:col-span-5 flex justify-center items-center w-full my-auto">
        <div class="w-full max-w-[440px] sm:max-w-[460px] bg-white rounded-[32px] shadow-[0_25px_70px_-15px_rgba(15,23,42,0.18)] border border-gray-100/80 p-7 sm:p-10 lg:p-11 relative mx-auto">
          
          <!-- Card Header -->
          <div class="mb-7">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Masuk ke Akun
            </h2>
            <p class="text-xs sm:text-sm text-gray-400 font-medium mt-1.5">
              Masukkan kredensial akun Anda untuk melanjutkan
            </p>
          </div>

          <!-- Login Form -->
          <form class="space-y-4 sm:space-y-5" @submit.prevent="login">
            
            <!-- Email Input -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <input 
                v-model="email" 
                type="email" 
                required 
                placeholder="nama@perusahaan.com"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
              >
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div class="relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required 
                  placeholder="••••••••"
                  class="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
                >
                <!-- Eye Toggle Button -->
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none transition-colors p-1"
                  tabindex="-1"
                  :title="showPassword ? 'Sembunyikan password' : 'Lihat password'"
                >
                  <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p class="text-[11px] text-gray-400 mt-1.5 leading-snug">
                Gunakan minimal 8 karakter akun terdaftar Anda.
              </p>
            </div>

            <!-- Error Notification Alert -->
            <div v-if="errorMessage" class="text-red-600 bg-red-50 border border-red-100 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <svg class="w-4 h-4 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Submit Button (Primary System Color: Brand Dark) -->
            <div class="pt-2">
              <button 
                type="submit" 
                :disabled="loading" 
                class="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-brand-dark hover:bg-brand-light shadow-lg shadow-brand-dark/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ loading ? 'Mengautentikasi...' : 'Masuk ke Sistem' }}</span>
              </button>
            </div>
          </form>

          <!-- Card Footer Note -->
          <div class="mt-8 pt-5 border-t border-gray-100 text-center">
          </div>

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

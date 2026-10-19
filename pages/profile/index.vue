<template>
  <div class="max-w-5xl mx-auto pb-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Profil Pengguna</h1>
      <p class="text-sm text-gray-500">Kelola informasi pribadi dan keamanan akun Anda.</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col justify-center items-center py-20 space-y-3">
      <div class="animate-spin w-9 h-9 border-4 border-brand-dark border-t-transparent rounded-full"></div>
      <p class="text-sm text-gray-500 font-medium">Memuat data profil...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 text-red-600 p-5 rounded-xl border border-red-100 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <p class="font-bold">Gagal memuat data profil</p>
          <p class="text-xs text-red-500">Silakan periksa koneksi atau coba muat ulang.</p>
        </div>
      </div>
      <button @click="fetchUser" class="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
        Coba Lagi
      </button>
    </div>

    <div v-else-if="user" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Left Column: Photo -->
      <div class="md:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div class="relative group cursor-pointer mb-4" @click="$refs.photoInput.click()">
            <div class="w-32 h-32 rounded-full bg-brand-dark text-white flex items-center justify-center text-4xl font-bold shadow-md overflow-hidden border-4 border-white ring-4 ring-gray-100">
              <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" />
              <span v-else>{{ user.name ? user.name.substring(0,1).toUpperCase() : 'A' }}</span>
            </div>
            
            <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
          </div>
          
          <input type="file" accept="image/*" class="hidden" ref="photoInput" @change="onPhotoSelected" />
          
          <h2 class="text-xl font-bold text-gray-900">{{ user.name }}</h2>
          <p class="text-sm text-brand-dark font-medium mb-1">{{ user.role === 'super_admin' ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : 'User') }}</p>
          <p class="text-xs text-gray-500 mb-4">{{ user.email }}</p>
          
          <button @click="$refs.photoInput.click()" class="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors border border-gray-200 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Ubah Foto Profil
          </button>
          
          <!-- Upload feedback -->
          <div v-if="uploadSuccess" class="w-full mt-2 p-2 bg-green-50 text-green-700 text-xs rounded-lg border border-green-100 font-medium">
            Foto berhasil disimpan!
          </div>
          <div v-if="uploadError" class="w-full mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
            {{ uploadError }}
          </div>

          <div v-if="previewPhoto" class="w-full mt-3 flex flex-col gap-2">
            <button @click="uploadPhoto" :disabled="isSubmitting" class="w-full bg-brand-dark hover:bg-brand-light text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Simpan Foto Baru
            </button>
            <button @click="cancelPhotoPreview" type="button" class="text-xs text-gray-500 hover:text-gray-700 underline">
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Personal Data -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          
          <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Data Diri
            </h3>
            
            <!-- Dropdown Menu -->
            <div class="relative">
              <button @click="isDropdownOpen = !isDropdownOpen" class="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Edit
                <svg class="w-4 h-4 text-gray-400" :class="{'rotate-180': isDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <!-- Dropdown Content -->
              <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                <button @click="openEditDataModal" class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-dark flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Edit Data Diri
                </button>
                <button @click="openPasswordModal" class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-dark flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                  Edit Password
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Nama Lengkap</dt>
                <dd class="text-base text-gray-900 font-semibold">{{ user.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Alamat Email</dt>
                <dd class="text-base text-gray-900">{{ user.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Nomor Telepon</dt>
                <dd class="text-base text-gray-900">{{ user.phone || user.phone_number || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Alamat</dt>
                <dd class="text-base text-gray-900">{{ user.address || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Peran Akses</dt>
                <dd>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : (user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')">
                    {{ user.role === 'super_admin' ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : 'User') }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Kantor / Lokasi</dt>
                <dd class="text-base text-gray-900">{{ user.office?.nama_kantor || user.office?.name || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Departemen</dt>
                <dd class="text-base text-gray-900">{{ user.department?.nama_departemen || user.department?.name || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 mb-1">Tanggal Bergabung</dt>
                <dd class="text-base text-gray-900">{{ formatDate(user.created_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Edit Password -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900">Ubah Password</h3>
          <button @click="showPasswordModal = false" class="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitPassword" class="p-6 space-y-4">
          <div v-if="passwordError" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {{ passwordError }}
          </div>
          <div v-if="passwordSuccess" class="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 font-medium">
            Password berhasil diperbarui!
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
            <input v-model="passwordForm.current_password" type="password" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input v-model="passwordForm.password" type="password" required minlength="8" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow" />
            <p class="text-xs text-gray-500 mt-1">Minimal 8 karakter.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input v-model="passwordForm.password_confirmation" type="password" required minlength="8" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow" />
          </div>
          
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showPasswordModal = false" class="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-brand-dark text-white rounded-lg hover:bg-brand-light text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Simpan Password
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Edit Data Diri -->
    <div v-if="showDataModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900">Edit Data Diri</h3>
          <button @click="showDataModal = false" class="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitData" class="p-6 space-y-4">
          <div v-if="dataError" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {{ dataError }}
          </div>
          <div v-if="dataSuccess" class="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 font-medium">
            Data diri berhasil diperbarui!
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input v-model="dataForm.name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="dataForm.email" type="email" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
            <input v-model="dataForm.phone" type="tel" placeholder="Contoh: 081234567890" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea v-model="dataForm.address" rows="3" placeholder="Tuliskan alamat lengkap tempat tinggal..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-shadow text-sm"></textarea>
          </div>
          
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showDataModal = false" class="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-brand-dark text-white rounded-lg hover:bg-brand-light text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, computed } from 'vue'

const config = useRuntimeConfig()
const authUser = useState('auth_user', () => null)

const user = ref(null)
const pending = ref(true)
const error = ref(false)

const isDropdownOpen = ref(false)
const showPasswordModal = ref(false)
const showDataModal = ref(false)
const isSubmitting = ref(false)

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
})
const passwordError = ref('')
const passwordSuccess = ref(false)

const dataForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})
const dataError = ref('')
const dataSuccess = ref(false)

const photoInput = ref(null)
const previewPhoto = ref(null)
const photoFile = ref(null)
const uploadSuccess = ref(false)
const uploadError = ref('')

const userPhotoUrl = computed(() => {
  if (previewPhoto.value) return previewPhoto.value
  const photo = user.value?.photo_url || user.value?.photo || user.value?.avatar
  if (!photo) return null
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo
  const backendBase = config.public.apiBase.replace(/\/api\/?$/, '')
  return `${backendBase}/storage/${photo}`
})

const closeDropdown = (e) => {
  if (!e.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  fetchUser()
  window.addEventListener('click', closeDropdown)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown)
})

const fetchUser = async () => {
  pending.value = true
  error.value = false
  try {
    const res = await $api('/me')
    const userData = res?.user || res
    if (userData && userData.id) {
      user.value = userData
      authUser.value = userData
      dataForm.name = userData.name || ''
      dataForm.email = userData.email || ''
      dataForm.phone = userData.phone || userData.phone_number || ''
      dataForm.address = userData.address || ''
    } else {
      error.value = true
    }
  } catch (e) {
    console.error('Gagal memuat profil pengguna:', e)
    error.value = true
  } finally {
    pending.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

const openPasswordModal = () => {
  isDropdownOpen.value = false
  passwordForm.current_password = ''
  passwordForm.password = ''
  passwordForm.password_confirmation = ''
  passwordError.value = ''
  passwordSuccess.value = false
  showPasswordModal.value = true
}

const openEditDataModal = () => {
  isDropdownOpen.value = false
  dataForm.name = user.value?.name || ''
  dataForm.email = user.value?.email || ''
  dataForm.phone = user.value?.phone || user.value?.phone_number || ''
  dataForm.address = user.value?.address || ''
  dataError.value = ''
  dataSuccess.value = false
  showDataModal.value = true
}

const submitPassword = async () => {
  if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordError.value = 'Konfirmasi password tidak cocok.'
    return
  }
  
  isSubmitting.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  
  try {
    await $api('/profile/password', {
      method: 'POST',
      body: passwordForm
    })
    
    passwordSuccess.value = true
    setTimeout(() => { showPasswordModal.value = false }, 1500)
  } catch (e) {
    passwordError.value = e?.data?.message || 'Gagal mengubah password.'
  } finally {
    isSubmitting.value = false
  }
}

const submitData = async () => {
  isSubmitting.value = true
  dataError.value = ''
  dataSuccess.value = false
  
  try {
    const res = await $api('/profile', {
      method: 'PATCH',
      body: {
        name: dataForm.name,
        email: dataForm.email,
        phone: dataForm.phone,
        address: dataForm.address
      }
    })
    
    dataSuccess.value = true
    const updatedUser = res?.user || res
    if (updatedUser) {
      user.value = updatedUser
      authUser.value = updatedUser
    } else {
      user.value.name = dataForm.name
      user.value.email = dataForm.email
      user.value.phone = dataForm.phone
      user.value.address = dataForm.address
      authUser.value = { ...user.value }
    }
    setTimeout(() => { showDataModal.value = false }, 1200)
  } catch (e) {
    dataError.value = e?.data?.message || 'Terjadi kesalahan sistem saat menyimpan.'
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Kompres gambar menjadi format WebP beresolusi optimal sebelum diupload
 */
const compressImageToWebp = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height / width) * maxWidth)
            width = maxWidth
          } else {
            width = Math.round((width / height) * maxWidth)
            height = maxWidth
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, '')
              const compressedFile = new File([blob], `${baseName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/webp',
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = event.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

const onPhotoSelected = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  photoFile.value = file
  previewPhoto.value = URL.createObjectURL(file)
  uploadSuccess.value = false
  uploadError.value = ''
}

const cancelPhotoPreview = () => {
  previewPhoto.value = null
  photoFile.value = null
  uploadError.value = ''
}

const uploadPhoto = async () => {
  if (!photoFile.value) return
  
  isSubmitting.value = true
  uploadError.value = ''
  uploadSuccess.value = false
  
  try {
    // Kompresi gambar menjadi WebP sebelum upload
    const fileToUpload = await compressImageToWebp(photoFile.value)

    const formData = new FormData()
    formData.append('photo', fileToUpload)
    
    const res = await $api('/profile/photo', {
      method: 'POST',
      body: formData,
    })
    
    const updatedUser = res?.user || res
    if (updatedUser) {
      user.value = updatedUser
      authUser.value = updatedUser
    }
    previewPhoto.value = null
    photoFile.value = null
    uploadSuccess.value = true
    setTimeout(() => { uploadSuccess.value = false }, 3000)
  } catch(e) {
    console.error('Gagal mengunggah foto:', e)
    uploadError.value = e?.data?.message || 'Gagal mengunggah foto profil.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

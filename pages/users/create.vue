<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="flex items-center mb-6">
      <NuxtLink to="/users" class="text-gray-500 hover:text-gray-700 mr-4 font-medium flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Kembali ke Daftar
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Tambah Karyawan Baru</h1>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="pageLoading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6 animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-10 bg-gray-100 rounded-md w-full"></div></div>
        <div><div class="h-4 bg-gray-200 rounded w-48 mb-2"></div><div class="h-10 bg-gray-100 rounded-md w-full"></div></div>
        <div><div class="h-4 bg-gray-200 rounded w-20 mb-2"></div><div class="h-10 bg-gray-100 rounded-md w-full"></div></div>
        <div><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-10 bg-gray-100 rounded-md w-full"></div></div>
      </div>
    </div>

    <form v-else @submit.prevent="submitForm" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nama Lengkap -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" required placeholder="Contoh: Ni Wayan Yantiari" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Nomor Induk Karyawan -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">No / ID Karyawan (NIK)</label>
          <input v-model="form.employee_id" type="text" placeholder="Contoh: 00357" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none font-mono">
        </div>

        <!-- Email Utama (Login) -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email Utama / Login <span class="text-red-500">*</span></label>
          <input v-model="form.email" type="email" required placeholder="wayan.yantiari@balibsh.com" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Email BSH -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email BSH (Kantor)</label>
          <input v-model="form.email_bsh" type="email" placeholder="wayan.yantiari@balibsh.com" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Email Pribadi -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email Pribadi</label>
          <input v-model="form.personal_email" type="email" placeholder="yantiariyantiari02@gmail.com" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Nomor HP -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">No. HP / WhatsApp</label>
          <input v-model="form.phone_number" type="tel" placeholder="081234567890" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Organisasi / Departemen -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Organisasi / Departemen</label>
          <select v-model="form.department_id" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none bg-white">
            <option value="">(Pilih Departemen)</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.nama_departemen }}</option>
          </select>
        </div>

        <!-- Area / Kantor -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Area / Kantor Penempatan <span class="text-red-500">*</span></label>
          <select v-model="form.office_id" required class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none bg-white">
            <option value="">(Pilih Area / Kantor)</option>
            <option v-for="off in offices" :key="off.id" :value="off.id">{{ off.nama_kantor }}</option>
          </select>
        </div>

        <!-- Posisi Jabatan -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Posisi Jabatan (Job Position)</label>
          <input v-model="form.job_position" type="text" placeholder="Contoh: Office Attendant / IT Support" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Job Level -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Job Level (Golongan)</label>
          <input v-model="form.job_level" type="text" placeholder="Contoh: 7 - Staff" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Join Date -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Tanggal Bergabung (Join Date)</label>
          <input v-model="form.join_date" type="date" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Role Aplikasi -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Role Aplikasi <span class="text-red-500">*</span></label>
          <select v-model="form.role" required class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none bg-white">
            <option value="user">User / Karyawan Biasa</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Password (jika admin) -->
        <div v-if="form.role === 'admin'" class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Password Admin <span class="text-red-500">*</span></label>
          <input v-model="form.password" type="password" required placeholder="Minimal 8 karakter" class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none">
        </div>

        <!-- Alamat (Opsional) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Alamat Tempat Tinggal (Opsional)</label>
          <textarea v-model="form.address" rows="2" placeholder="Tuliskan alamat domisili karyawan..." class="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-brand-dark outline-none"></textarea>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <NuxtLink to="/users" class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          Batal
        </NuxtLink>
        <button type="submit" :disabled="loading" class="bg-brand-dark hover:bg-brand-light text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm disabled:opacity-50 flex items-center gap-2 transition">
          <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Karyawan' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const swal = inject('swal')
const loading = ref(false)
const pageLoading = ref(true)
const offices = ref([])
const departments = ref([])

const form = ref({
  name: '',
  employee_id: '',
  email: '',
  email_bsh: '',
  personal_email: '',
  phone_number: '',
  role: 'user',
  password: '',
  office_id: '',
  department_id: '',
  job_position: '',
  job_level: '',
  join_date: '',
  address: ''
})

onMounted(async () => {
  pageLoading.value = true
  try {
    const [offRes, deptRes] = await Promise.all([
      $api('/offices'),
      $api('/departments')
    ])
    if (offRes) offices.value = (offRes.data || offRes)
    if (deptRes) departments.value = (deptRes.data || deptRes)
    if (offices.value.length > 0 && !form.value.office_id) {
      form.value.office_id = offices.value[0].id
    }
  } catch (e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
})

const submitForm = async () => {
  loading.value = true
  try {
    if (!form.value.email && form.value.email_bsh) {
      form.value.email = form.value.email_bsh
    }
    await $api('/users', {
      method: 'POST',
      body: form.value
    })
    swal.fire({ title: 'Berhasil!', text: 'Data Karyawan berhasil ditambahkan.', icon: 'success', confirmButtonColor: '#2d3e50' })
    router.push('/users')
  } catch (err) {
    swal.fire('Error', err.data?.message || err.message || 'Gagal menyimpan.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="flex items-center mb-6">
      <NuxtLink to="/products" class="text-gray-500 hover:text-gray-700 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Edit Aset</h1>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="pageLoading" class="space-y-6 animate-pulse">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div class="space-y-4">
          <div><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-12 bg-gray-100 rounded-lg w-full"></div></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><div class="h-4 bg-gray-200 rounded w-40 mb-2"></div><div class="h-12 bg-gray-100 rounded-lg w-full"></div></div>
            <div><div class="h-4 bg-gray-200 rounded w-40 mb-2"></div><div class="h-12 bg-gray-100 rounded-lg w-full"></div></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><div class="h-4 bg-gray-200 rounded w-40 mb-2"></div><div class="h-12 bg-gray-100 rounded-lg w-full"></div></div>
            <div><div class="h-4 bg-gray-200 rounded w-40 mb-2"></div><div class="h-12 bg-gray-100 rounded-lg w-full"></div></div>
          </div>
          <div><div class="h-4 bg-gray-200 rounded w-48 mb-2"></div><div class="h-12 bg-gray-100 rounded-lg w-full"></div></div>
        </div>
      </div>
      <div class="flex justify-end gap-4 items-center">
        <div class="h-12 bg-gray-200 rounded-xl w-24"></div>
        <div class="h-12 bg-gray-300 rounded-xl w-40"></div>
      </div>
    </div>

    <!-- Form Section -->
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      
      <!-- Box 1: Identitas Spesifikasi Unit -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2 text-gray-900 font-bold">
            <div class="p-1.5 bg-gray-100 rounded text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            Ubah Identitas Unit
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Nama & Model Aset <span class="text-red-500">*</span>
            </label>
            <input v-model="form.description" type="text" required class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Klasifikasi / Jenis Barang <span class="text-red-500">*</span>
              </label>
              <select v-model="form.classification_id" required class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
                <option v-for="cls in classifications" :key="cls.id" :value="cls.id">{{ cls.nama_klasifikasi }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Departemen Pemilik <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <select v-model="form.department_id" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
                <option value="">-- Tanpa Departemen / Umum --</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.nama_departemen }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                ID Barang (Nomor Unik) <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center">
                <span v-if="selectedDeptPrefix" class="px-4 py-2.5 bg-gray-100 border border-gray-200 border-r-0 rounded-l-lg text-gray-600 font-mono font-bold">{{ selectedDeptPrefix }}</span>
                <input v-model="form.nomor_unik" type="text" required :class="selectedDeptPrefix ? 'rounded-r-lg' : 'rounded-lg'" class="flex-1 w-full border border-gray-200 px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors font-mono">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Serial Number (SN) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.serial_number" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors uppercase">
            </div>
          </div>
          
          <!-- Hardware Specs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Device Name <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.device_name" type="text" placeholder="Contoh: LAPTOP-IT-01" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Operating System (OS) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.os" type="text" placeholder="Contoh: Windows 11 Pro" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Processor <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.processor" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                RAM Bawaan <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.ram" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                NEW RAM (Upgrade) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.new_ram" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                SSD Bawaan <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.ssd" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                NEW SSD (Upgrade) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.new_ssd" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Screen ID <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.screen_id" type="text" placeholder="Contoh: External Display AC-00002" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                MAC Address <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.mac_address" type="text" placeholder="Contoh: AA:BB:CC:DD:EE:FF" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                IMEI 1 <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.imei1" type="text" placeholder="Masukkan IMEI 1" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                IMEI 2 <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.imei2" type="text" placeholder="Masukkan IMEI 2" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Catatan / Remarks <span class="text-xs font-normal text-gray-500">(Opsional)</span>
            </label>
            <textarea v-model="form.remarks" rows="2" placeholder="Contoh: Ex Baskoro, Kondisi Bagus..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors"></textarea>
          </div>

          <div class="mt-2 flex items-center gap-2">
            <input v-model="form.has_headset" type="checkbox" id="headset" class="w-4 h-4 text-brand-dark border-gray-300 rounded focus:ring-brand-dark">
            <label for="headset" class="text-sm font-semibold text-gray-700">Include Headset (Berikan centang jika perangkat disertai headset)</label>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 items-center">
        <NuxtLink to="/products" class="bg-white border border-gray-200 text-gray-700 py-3.5 px-6 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap">
          Batal
        </NuxtLink>
        <button type="submit" :disabled="loading" class="bg-brand-dark text-white py-3.5 px-8 rounded-xl font-bold hover:bg-brand-light flex items-center justify-center gap-2 shadow-lg shadow-brand-dark/20 transition-colors disabled:opacity-50 whitespace-nowrap">
          <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <svg v-else class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ loading ? 'Menyimpan...' : 'Update Aset' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { $swal: swal } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const pageLoading = ref(true)
const departments = ref([])
const classifications = ref([])
const selectedDeptPrefix = ref('')

const form = ref({
  description: '',
  classification_id: '',
  department_id: '',
  nomor_unik: '',
  serial_number: '',
  processor: '',
  ram: '',
  new_ram: '',
  ssd: '',
  new_ssd: '',
  os: '',
  screen_id: '',
  mac_address: '',
  imei1: '',
  imei2: '',
  device_name: '',
  remarks: '',
  has_headset: false
})

watch(() => form.value.department_id, (newVal) => {
  if (!newVal) {
    selectedDeptPrefix.value = ''
    return
  }
  const dept = departments.value.find(d => d.id === newVal)
  if (dept && dept.kode_asset) {
    selectedDeptPrefix.value = dept.kode_asset + '-'
  } else {
    selectedDeptPrefix.value = ''
  }
})

onMounted(async () => {
  pageLoading.value = true
  try {
    const [deptRes, classRes, productRes] = await Promise.all([
      $api('/departments'),
      $api('/classifications'),
      $api(`/products/${route.params.id}`)
    ])
    
    if (deptRes) departments.value = (deptRes.data || deptRes)
    if (classRes) classifications.value = (classRes.data || classRes)
    
    if (productRes) {
      const p = (productRes.data || productRes)
      
      let i1 = ''
      let i2 = ''
      if (p.imei) {
        const parts = p.imei.split(' / ')
        i1 = parts[0] || ''
        i2 = parts[1] || ''
      }
      
      form.value = {
        description: p.description || '',
        classification_id: p.classification_id || '',
        department_id: p.department_id || '',
        nomor_unik: p.nomor_unik || '',
        serial_number: p.serial_number || '',
        processor: p.processor || '',
        ram: p.ram || '',
        new_ram: p.new_ram || '',
        ssd: p.ssd || '',
        new_ssd: p.new_ssd || '',
        os: p.os || '',
        screen_id: p.screen_id || '',
        mac_address: p.mac_address || '',
        imei1: i1,
        imei2: i2,
        device_name: p.device_name || '',
        remarks: p.remarks || '',
        has_headset: p.has_headset ? true : false
      }
    }
  } finally {
    pageLoading.value = false
  }
})

const submitForm = async () => {
  loading.value = true
  try {
    const payload = { ...form.value }
    
    // Combine IMEI
    let imeiList = []
    if (payload.imei1) imeiList.push(payload.imei1)
    if (payload.imei2) imeiList.push(payload.imei2)
    payload.imei = imeiList.join(' / ')
    
    delete payload.imei1
    delete payload.imei2
    
    await $api(`/products/${route.params.id}`, {
      method: 'PUT',
      body: payload
    })
    
    swal.fire({ title: 'Berhasil!', text: 'Aset berhasil diupdate.', icon: 'success', confirmButtonColor: '#2d3e50' })
    router.push('/products')
  } catch (err) {
    swal.fire('Error', err.data?.message || err.message || 'Gagal menyimpan data.', 'error')
  } finally {
    loading.value = false
  }
}
</script>


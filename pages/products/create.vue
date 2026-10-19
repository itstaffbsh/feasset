<template>
  <div class="max-w-3xl mx-auto pb-12">
    <!-- Header Card -->
    <div class="bg-brand-dark rounded-xl p-6 text-white mb-6 relative overflow-hidden shadow-lg">
      <div class="absolute top-0 right-0 p-4 opacity-20">
        <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
      </div>
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-4">
          <NuxtLink to="/products" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </NuxtLink>
          <h1 class="text-xl font-bold">Registrasi Aset Baru</h1>
        </div>
        
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/30 text-xs font-bold mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> Asset Entry
        </div>
        <h2 class="text-2xl font-bold mb-2">Penambahan Unit Aset</h2>
        <p class="text-brand-bg/80 text-sm mb-6 max-w-md">Masukkan data aset sesuai dengan spesifikasi dan kelompok penggunanya.</p>
      </div>
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
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            Identitas Spesifikasi Unit
          </div>
          <span class="text-xs text-red-500 bg-red-50 px-2 py-1 rounded font-bold">*Wajib</span>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Nama & Model Aset <span class="text-red-500">*</span>
            </label>
            <input v-model="form.description" type="text" placeholder="Contoh: 1 Unit Laptop Lenovo Thinkpad..." required class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Klasifikasi / Jenis Barang <span class="text-red-500">*</span>
              </label>
              <select v-model="form.classification_id" required class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
                <option value="">-- Pilih Klasifikasi --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nama_klasifikasi }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Departemen Pemilik <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <select v-model="form.department_id" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
                <option value="">-- Tanpa Departemen / Umum --</option>
                <option v-for="dep in departments" :key="dep.id" :value="dep.id">{{ dep.nama_departemen }}</option>
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
                <input v-model="form.nomor_unik" type="text" placeholder="Contoh: AC-00001 atau 00001" required :disabled="loadingNomor" :class="selectedDeptPrefix ? 'rounded-r-lg' : 'rounded-lg'" class="flex-1 w-full border border-gray-200 px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors font-mono disabled:opacity-50">
              </div>
              <p class="text-xs mt-1" :class="loadingNomor ? 'text-gray-400' : 'text-gray-500'">
                {{ loadingNomor ? 'Sedang memuat nomor otomatis...' : (selectedDeptPrefix ? 'Nomor terisi otomatis (bisa diubah manual)' : 'Bisa ketik ID unik langsung atau pilih departemen') }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Serial Number (SN) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.serial_number" type="text" placeholder="Contoh: PW07J8ZV" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors uppercase">
            </div>
          </div>
          
          <!-- Hardware Specs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Device Name <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.device_name" type="text" placeholder="Contoh: BSH-ACCT-001" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Operating System (OS) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.os" type="text" placeholder="Contoh: Win 11 HSL V23H2" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Processor <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.processor" type="text" placeholder="Contoh: Intel Core i7 / Astina" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                RAM Bawaan <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.ram" type="text" placeholder="Contoh: 16.00 GB" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                NEW RAM (Upgrade) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.new_ram" type="text" placeholder="Contoh: 16.00 GB" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                SSD Bawaan <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.ssd" type="text" placeholder="Contoh: 512 GB" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                NEW SSD (Upgrade) <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <input v-model="form.new_ssd" type="text" placeholder="Contoh: 1 TB" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-colors">
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
        <button type="submit" :disabled="loading || loadingNomor" class="bg-brand-dark text-white py-3.5 px-8 rounded-xl font-bold hover:bg-brand-light flex items-center justify-center gap-2 shadow-lg shadow-brand-dark/20 transition-colors disabled:opacity-50 whitespace-nowrap">
          <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <svg v-else class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ loading ? 'Menyimpan...' : 'Simpan Aset' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue'

const swal = inject('swal')
const router = useRouter()
const loading = ref(false)
const loadingNomor = ref(false)
const pageLoading = ref(true)

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

const categories = ref([])
const departments = ref([])
const selectedDeptPrefix = ref('')

watch(() => form.value.department_id, async (newVal) => {
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

  loadingNomor.value = true
  try {
    const res = await $api(`/products/next-nomor/${newVal}`)
    if (res && res.next_nomor) {
      form.value.nomor_unik = res.next_nomor
    }
  } catch (e) {
  } finally {
    loadingNomor.value = false
  }
})

onMounted(async () => {
  pageLoading.value = true
  try {
    const [catRes, depRes] = await Promise.all([
      $api('/classifications'),
      $api('/departments')
    ])
    if (catRes) categories.value = catRes.data || catRes
    if (depRes) departments.value = depRes.data || depRes
  } catch (e) {
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
    
    await $api('/products', {
      method: 'POST',
      body: payload
    })
    
    swal.fire({ title: 'Berhasil!', text: 'Aset baru berhasil ditambahkan.', icon: 'success', confirmButtonColor: '#2d3e50' })
    router.push('/products')
  } catch (e) {
    const errorMsg = e.data?.message || e.message || 'Gagal menyimpan data'
    swal.fire('Error', errorMsg, 'error')
  } finally {
    loading.value = false
  }
}
</script>


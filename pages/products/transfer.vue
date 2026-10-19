<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Pinjam / Kembali Aset</h1>
      <p class="text-sm text-gray-500">Mutasi / pindah tangan aset ke karyawan atau pengembalian aset.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
      <form @submit.prevent="submitTransfer" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Jenis Transaksi</label>
          <select 
            v-model="form.type" 
            class="block w-full rounded-lg shadow-sm focus:ring-brand-dark focus:border-brand-dark sm:text-sm p-3 border cursor-pointer bg-white"
            :class="formErrors.type ? 'border-red-500' : 'border-gray-300'"
            @change="formErrors.type = false"
          >
            <option value="Pinjam">Peminjaman (Serah Terima)</option>
            <option value="Kembali">Pengembalian (Kembali ke IT/Gudang)</option>
          </select>
          <p v-if="formErrors.type" class="mt-1 text-xs text-red-500">Jenis transaksi wajib dipilih</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ form.type === 'Pinjam' ? 'Tanggal Peminjaman' : 'Tanggal Pengembalian' }}</label>
          <input 
            type="date" 
            v-model="form.tanggal_pinjam" 
            class="block w-full rounded-lg shadow-sm focus:ring-brand-dark focus:border-brand-dark sm:text-sm p-3 border cursor-pointer bg-white border-gray-300"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Pilih Aset</label>
          <SearchableSelect
            v-model="form.product_id"
            :options="formattedProducts"
            valueKey="id"
            labelKey="label"
            placeholder="Ketik untuk mencari ID barang atau nama aset..."
            :error="formErrors.product_id"
            errorMessage="Aset wajib dipilih"
            @update:modelValue="onProductSelected"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ form.type === 'Pinjam' ? 'Penerima (Karyawan)' : 'Peminjam (Yang Mengembalikan)' }}</label>
          <SearchableSelect
            v-model="form.user_id"
            :options="formattedUsers"
            valueKey="id"
            labelKey="label"
            placeholder="Ketik untuk mencari nama atau No. ID karyawan..."
            :error="formErrors.user_id"
            errorMessage="Karyawan wajib dipilih"
            @update:modelValue="formErrors.user_id = false"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Catatan / Keterangan</label>
          <textarea v-model="form.notes" rows="3" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand-dark focus:border-brand-dark sm:text-sm p-3 border" placeholder="Contoh: Kondisi fisik baik..."></textarea>
          
          <!-- Checklist Kelengkapan: Charger, Mouse, Headphone -->
          <div class="mt-3 flex items-center gap-6">
            <label class="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 select-none">
              <input 
                type="checkbox" 
                v-model="form.has_charger" 
                class="w-4 h-4 text-brand-dark rounded border-gray-300 focus:ring-brand-dark cursor-pointer" 
              />
              <span>Charger</span>
            </label>

            <label class="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 select-none">
              <input 
                type="checkbox" 
                v-model="form.has_mouse" 
                class="w-4 h-4 text-brand-dark rounded border-gray-300 focus:ring-brand-dark cursor-pointer" 
              />
              <span>Mouse</span>
            </label>

            <label class="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 select-none">
              <input 
                type="checkbox" 
                v-model="form.has_headphone" 
                class="w-4 h-4 text-brand-dark rounded border-gray-300 focus:ring-brand-dark cursor-pointer" 
              />
              <span>Headphone</span>
            </label>
          </div>
        </div>

        <button type="submit" class="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-brand-light transition-colors" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Proses Transaksi' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const swal = inject('swal')
const products = ref([])
const users = ref([])
const loading = ref(false)

const form = ref({
  type: 'Pinjam',
  tanggal_pinjam: new Date().toISOString().split('T')[0],
  product_id: '',
  user_id: '',
  notes: '',
  has_charger: false,
  has_mouse: false,
  has_headphone: false
})

const formErrors = ref({
  type: false,
  product_id: false,
  user_id: false
})

const formattedProducts = computed(() => {
  return products.value.map(p => {
    const code = p.full_nomor_unik || (p.department?.kode_asset ? `${p.department.kode_asset}-${p.nomor_unik}` : p.nomor_unik) || '-'
    const name = p.description || p.nama || p.device_name || 'Aset'
    return {
      id: p.id,
      code: code,
      name: name,
      label: `${code} | ${name}`,
      search: `${code} ${name} ${p.nomor_unik || ''} ${p.serial_number || ''} ${p.device_name || ''}`
    }
  })
})

const formattedUsers = computed(() => {
  return users.value.map(u => {
    const empId = u.employee_id || '-'
    const name = u.name || '-'
    return {
      id: u.id,
      code: empId,
      name: name,
      label: `${empId} - ${name}`,
      search: `${empId} ${name} ${u.email || ''} ${u.email_bsh || ''}`
    }
  })
})

onMounted(async () => {
  try {
    const [pRes, uRes] = await Promise.all([
      $api('/products?per_page=1000'),
      $api('/users?per_page=1000')
    ])
    products.value = Array.isArray(pRes) ? pRes : (pRes.data || [])
    users.value = Array.isArray(uRes) ? uRes : (uRes.data || [])
  } catch (e) {
    console.error("Failed fetching data", e)
  }
})

const onProductSelected = (val) => {
  formErrors.value.product_id = false
  if (form.value.type === 'Kembali' && val) {
    const product = products.value.find(p => p.id === val)
    if (product && product.histories && product.histories.length > 0) {
      // Find latest meminjam
      const meminjamHistories = product.histories.filter(h => h.jenis_transaksi === 'meminjam')
      if (meminjamHistories.length > 0) {
        const lastHistory = meminjamHistories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        if (lastHistory) {
          form.value.user_id = lastHistory.diterima_oleh
          formErrors.value.user_id = false
        }
      }
    }
  }
}

const submitTransfer = async () => {
  // Validate
  let hasError = false
  if (!form.value.type) {
    formErrors.value.type = true
    hasError = true
  }
  if (!form.value.product_id) {
    formErrors.value.product_id = true
    hasError = true
  }
  if (!form.value.user_id) {
    formErrors.value.user_id = true
    hasError = true
  }

  if (hasError) return

  loading.value = true
  try {
    const isPinjam = form.value.type === 'Pinjam'
    
    // Kumpulkan kelengkapan yang dicentang
    const accessories = []
    if (form.value.has_charger) accessories.push('Charger')
    if (form.value.has_mouse) accessories.push('Mouse')
    if (form.value.has_headphone) accessories.push('Headphone')

    const payload = isPinjam ? {
      jenis_transaksi: 'meminjam',
      diterima_oleh: form.value.user_id,
      tanggal_pinjam: form.value.tanggal_pinjam,
      product_ids: [form.value.product_id],
      quantities: [1],
      catatan: form.value.notes,
      accessories: accessories
    } : {
      jenis_transaksi: 'kembali',
      diterima_oleh: form.value.user_id,
      tanggal_pinjam: form.value.tanggal_pinjam,
      product_id: form.value.product_id,
      catatan: form.value.notes,
      accessories: accessories
    }

    const selectedProduct = products.value.find(p => p.id === form.value.product_id)
    const selectedUser = users.value.find(u => u.id === form.value.user_id)

    sessionStorage.setItem('transfer_preview', JSON.stringify({
      payload,
      product: selectedProduct,
      user: selectedUser,
      isPinjam,
      accessories
    }))

    router.push('/products/sttb/preview')
  } catch (error) {
    const msg = error.response?._data?.message || error.data?.message || 'Gagal menyiapkan preview.'
    swal.fire('Error', msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>

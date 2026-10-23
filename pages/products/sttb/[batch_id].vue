<template>
  <div>
    <div class="max-w-4xl mx-auto mb-6 flex flex-col space-y-4 print:hidden">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Surat Tanda Terima Barang</h1>
          <p class="text-sm text-gray-500">Pratinjau dokumen serah terima aset. Klik cetak untuk menyimpan sebagai PDF.</p>
        </div>
        <div class="flex space-x-3">
          <button @click="$router.push('/history')" class="bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
            Kembali
          </button>
          
        </div>
      </div>

      <!-- Pengaturan HR (Hanya tampil jika role memiliki hak akses tambah pada pinjam/kembali aset) -->
      <div v-if="can('transfer', 'tambah')" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Pengaturan Penyerah (PIHAK PERTAMA)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Penyerah (HR Manager)</label>
            <input type="text" v-model="hrName" class="w-full text-sm p-2 border border-gray-300 rounded focus:ring-brand-dark focus:border-brand-dark" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Jabatan Penyerah</label>
            <input type="text" v-model="hrPosition" class="w-full text-sm p-2 border border-gray-300 rounded focus:ring-brand-dark focus:border-brand-dark" />
          </div>
        </div>
      </div>
    </div>

    <!-- Area Kertas A4 -->
    <div v-if="!pending && data" class="bg-white shadow-lg mx-auto print:shadow-none print:mx-0 A4-container flex flex-col" style="width: 210mm; height: 297mm; box-sizing: border-box; overflow: hidden; margin-bottom: 2rem; font-family: 'Times New Roman', Times, serif;">
      
      <!-- Header / Kop Surat (Full width) -->
      <div class="w-full" style="padding-top: 2rem;">
        <img src="/img/sttb-header.png" alt="Header STTB" class="w-full h-auto" />
      </div>

      <!-- Konten Surat (Dengan Padding) -->
      <div class="flex-grow" style="padding: 0.2cm 2cm 0 2cm;">
        <!-- Judul -->
        <div class="text-center mb-4 mt-2">
          <h1 class="text-lg font-bold underline">SURAT TANDA TERIMA BARANG</h1>
        </div>

        <!-- Isi Surat -->
        <div class="text-sm leading-normal space-y-1.5 " style="font-size: 11pt; line-height: 1.4;">
          <p class="text-justify">
            Pada hari ini {{ formattedDate }} bertempat di PT Samasta Properti Manajemen Internasional kami yang bertanda tangan dibawah ini :
          </p>

          <div class="ml-4 space-y-0.5">
            <div class="flex"><span class="w-8">I.</span><span class="w-24">Nama</span><span>: {{ hrName }}</span></div>
            <div class="flex"><span class="w-8"></span><span class="w-24">Jabatan</span><span>: {{ hrPosition }}</span></div>
          </div>

          <p class="text-justify">
            Dalam surat serah terima ini bertindak untuk dan atas nama PT Samasta Properti Manajemen Internasional selaku yang mana selanjutnya disebut PIHAK PERTAMA
          </p>

          <div class="ml-4 space-y-0.5">
            <div class="flex">
              <span class="w-8">II.</span>
              <span class="w-24">Nama</span>
              <span>: {{ data.pihak_kedua?.name || '-' }}</span>
            </div>
            <div class="flex">
              <span class="w-8"></span>
              <span class="w-24">Jabatan</span>
              <span>: {{ data.pihak_kedua?.job_position || '-' }}</span>
            </div>
          </div>

          <p class="text-justify">
            Dalam hal ini bertindak untuk dan atas nama PT Samasta Properti Manajemen Internasional selaku yang mana selanjutnya akan disebut sebagai PIHAK KEDUA.
          </p>
          <p class="text-justify">
            Saat ini telah melakukan serah terima barang dari PIHAK PERTAMA kepada PIHAK KEDUA. PIHAK KEDUA telah menerima barang dari PIHAK PERTAMA sebagai berikut :
          </p>

          <!-- Tabel Barang -->
          <table class="w-full border-collapse border border-black text-center mt-2 mb-2">
            <thead>
              <tr class="font-bold">
                <th class="border border-black py-1 px-1 w-10">NO.</th>
                <th class="border border-black py-1 px-1">JENIS BARANG</th>
                <th class="border border-black py-1 px-1 w-28">TANGGAL</th>
                <th class="border border-black py-1 px-1 w-20">JUMLAH</th>
                <th class="border border-black py-1 px-1">KETERANGAN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in data.histories" :key="history.id">
                <td class="border border-black py-1 px-1">{{ index + 1 }}.</td>
                <td class="border border-black py-1 px-1 text-left">
                  {{ history.product?.description || '-' }}
                </td>
                <td class="border border-black py-1 px-1">
                  {{ formattedDateShort }}
                </td>
                <td class="border border-black py-1 px-1">{{ history.quantity || 1 }}</td>
                <td class="border border-black py-1 px-1 text-left">
                  {{ getKeterangan(history) }}
                </td>
              </tr>
            </tbody>
          </table>

          <p class="text-justify">
            Barang-barang tersebut diatas adalah hak milik PT Samasta Properti Manajemen Internasional sepenuhnya, dan tidak bisa dipindah tangankan kepada pihak lain.
          </p>

          <div>
            <p>Berikut persyaratan yang harus dipenuhi oleh Pihak Kedua antara lain:</p>
            <ol class="list-decimal ml-6 mt-0.5 space-y-0 text-justify" style="list-style-type: lower-latin;     padding-left: 2em;">
              <li class="pl-1">Menjaga dengan baik barang yang telah diserahkan kepada pihak kedua</li>
              <li class="pl-1">Tidak terkena air atau jatuh</li>
              <li class="pl-1">Hanya digunakan untuk keperluan pekerjaan kantor</li>
              <li class="pl-1">Jika terdapat damage atau kerusakan akan menjadi tanggung jawab masing-masing pihak</li>
              <li class="pl-1">Apabila pihak kedua mau mengundurkan diri, barang yang telah diterima agar dikembalikan dengan mengisi clearance form dari HRD</li>
            </ol>
          </div>

          <p class="text-justify mt-3">
            Demikian surat serah terima barang ini dibuat oleh kedua belah pihak yang bersangkutan. Setelah penandatanganan surat ini serah terima ini, maka semua barang yang tertera di atas akan menjadi tanggung jawab PIHAK KEDUA
          </p>

          <!-- Tanda Tangan -->
          <div class="flex justify-between mt-4 mb-2 text-center">
            <div class="w-64">
              <p>Yang Menyerahkan</p>
              <p>PIHAK PERTAMA</p>
              <div style="height: 100px;"></div>
              <p>{{ hrName }}</p>
            </div>
            <div class="w-64">
              <p>Yang Menerima</p>
              <p>PIHAK KEDUA</p>
              <div style="height: 100px;"></div>
              <p>{{ data.pihak_kedua?.name || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer (Full width) -->
      <div class="w-full mt-auto">
        <img src="/img/sttb-footer.png" alt="Footer STTB" class="w-full h-auto block" />
      </div>
      
    </div>

        <div v-if="!pending && data" class="max-w-4xl mx-auto mt-6 mb-12 flex justify-end print:hidden">
      <button @click="printPdf" class="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-brand-light transition-colors flex items-center text-lg">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Cetak PDF
      </button>
    </div>

    <div v-else-if="pending" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-gray-500 font-medium">Memuat dokumen STTB...</p>
    </div>

    <div v-else-if="!data" class="max-w-4xl mx-auto bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 space-y-3 shadow-sm">
      <div class="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <p class="text-base font-bold text-gray-800">Dokumen STTB Tidak Ditemukan</p>
      <p class="text-xs text-gray-500 max-w-md mx-auto">Data STTB tidak ditemukan atau akun Anda belum memiliki izin hak akses untuk melihat data transaksi ini.</p>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissions } from '~/composables/usePermissions'

const { can } = usePermissions()
const route = useRoute()
const data = ref(null)
const pending = ref(true)

// Reactive state untuk form Pengaturan HR
const hrName = ref('Artha Magdalena Lumban Tobing')
const hrPosition = ref('HR Manager')

const fetchSttb = async () => {
  pending.value = true
  try {
    const res = await $api(`/sttb/${route.params.batch_id}`)
    data.value = res.data || res
    if (data.value?.pihak_pertama?.name) {
      hrName.value = data.value.pihak_pertama.name
      hrPosition.value = data.value.pihak_pertama.job_position || 'HR Manager'
    }
  } catch (error) {
    console.error("Gagal memuat STTB", error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchSttb()
})

const getKeterangan = (history) => {
  const assetId = history.product?.full_nomor_unik 
    || ((history.product?.department?.kode_asset || 'SM') + '-' + (history.product?.nomor_unik || '-'))

  let accList = []
  if (Array.isArray(history.accessories)) {
    accList = history.accessories
  } else if (typeof history.accessories === 'string' && history.accessories.trim()) {
    accList = history.accessories.split(',').map(s => s.trim()).filter(Boolean)
  }

  let result = assetId
  if (accList.length > 0) {
    result += '+' + accList.join('+')
  }

  if (history.catatan && typeof history.catatan === 'string' && history.catatan.trim()) {
    const cleanCatatan = history.catatan.trim()
    if (!accList.includes(cleanCatatan) && !cleanCatatan.startsWith('+')) {
      result += ` (${cleanCatatan})`
    }
  }

  return result
}

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

const formattedDate = computed(() => {
  if (!data.value || !data.value.tanggal) return '-'
  const date = new Date(data.value.tanggal)
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
})

const formattedDateShort = computed(() => {
  if (!data.value || !data.value.tanggal) return '-'
  const date = new Date(data.value.tanggal)
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
})

const printPdf = () => {
  window.print()
}
</script>

<style>
.A4-container,
.A4-container * {
  font-family: 'Times New Roman', Times, serif !important;
}
@media print {
  body * {
    visibility: hidden;
  }
  .A4-container, .A4-container * {
    visibility: visible;
  }
  .A4-container {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    width: 210mm !important;
    height: 297mm !important;
    overflow: hidden !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page {
    size: A4 portrait;
    margin: 0;
  }
}
</style>










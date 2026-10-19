<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tempat Sampah Aset</h1>
        <p class="text-sm text-gray-500">Daftar aset yang telah dihapus sementara.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No. Seri</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Aset</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tgl Hapus</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Alasan Hapus</th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400 font-medium">Memuat data...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400 font-medium">Tempat sampah kosong.</td>
            </tr>
            <tr v-else v-for="item in items" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.full_nomor_unik || item.nomor_unik || '-' }}</td>
              <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ item.description }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ item.deleted_at ? new Date(item.deleted_at).toLocaleDateString() : '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ item.deletion_reason || '-' }}</td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <button @click="restoreItem(item.id)" class="inline-block p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors mr-2" title="Pulihkan">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
                <button @click="forceDelete(item.id)" class="inline-block p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Permanen">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const swal = inject('swal')
const items = ref([])
const pending = ref(true)

const fetchItems = async () => {
  pending.value = true
  try {
    const data = await $api('/products/trash')
    items.value = data || []
  } finally {
    pending.value = false
  }
}

const restoreItem = async (id) => {
  try {
    await $api(`/products/${id}/restore`, { method: 'POST' })
    swal.fire({ title: 'Dipulihkan!', text: 'Aset kembali ke daftar aktif.', icon: 'success', confirmButtonColor: '#2d3e50' })
    fetchItems()
  } catch (e) {
    swal.fire('Error', 'Gagal memulihkan.', 'error')
  }
}

const forceDelete = async (id) => {
  const result = await swal.fire({
    title: 'Hapus Permanen?',
    text: "Data akan hilang selamanya!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Musnahkan!'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/products/${id}/force`, { method: 'DELETE' })
      swal.fire({ title: 'Terhapus!', text: 'Data telah dihapus permanen.', icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchItems()
    } catch (e) {
      swal.fire('Error', 'Gagal menghapus.', 'error')
    }
  }
}

onMounted(() => fetchItems())
</script>

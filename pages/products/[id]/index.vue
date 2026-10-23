<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      
      <!-- Top Actions -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <NuxtLink to="/dashboard" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </NuxtLink>
            <span class="text-gray-300">/</span>
            <NuxtLink to="/products" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Daftar Aset
            </NuxtLink>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-3">
            Detail Aset <span class="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-500">{{ product?.full_nomor_unik || '-' }}</span>
            <span v-if="product?.device_name" class="px-2.5 py-1 bg-brand-dark text-white rounded text-xs font-mono font-bold">{{ product.device_name }}</span>
          </h1>
        </div>
      </div>

      <div v-if="pending" class="text-center py-12 text-gray-500">Memuat detail aset...</div>
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column (QR & Quick Actions) -->
        <div class="space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <div class="w-full max-w-[240px] flex flex-col items-center mb-6">
              <!-- Format Selector: Micro QR vs Standard QR -->
              <div class="w-full flex items-center justify-center gap-1 bg-gray-100 p-1 rounded-xl mb-3 shadow-inner">
                <button 
                  type="button"
                  @click="qrType = 'micro'" 
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  :class="qrType === 'micro' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-800'"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Micro QR (3cm)</span>
                </button>
                <button 
                  type="button"
                  @click="qrType = 'standard_qr'" 
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center"
                  :class="qrType === 'standard_qr' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-800'"
                >
                  <span>Standar QR</span>
                </button>
              </div>

              <div class="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-3 border border-gray-200 shadow-sm relative group">
                <img 
                  :src="'data:image/svg+xml;base64,' + activeQrSvg" 
                  alt="QR Code" 
                  class="w-full h-full object-contain transition-transform" 
                  v-if="activeQrSvg" 
                />
                <div v-else class="text-gray-400 text-sm">QR Code tidak tersedia</div>
                <div v-if="qrType === 'micro'" class="absolute bottom-1 right-1.5 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded border border-emerald-200">
                  Micro M3
                </div>
              </div>
              <div v-if="activeQrSvg" class="mt-3 text-lg font-extrabold text-gray-900 tracking-wider font-mono">
                {{ product?.full_nomor_unik || qrData?.full_nomor_unik || product?.nomor_unik || '-' }}
              </div>
            </div>
            
            <div class="w-full space-y-3">
              <button 
                @click="downloadQR('standard')" 
                class="w-full px-4 py-2.5 bg-brand-dark text-white rounded-lg text-sm font-bold hover:bg-brand-light transition-colors shadow-sm flex items-center justify-center gap-2"
                title="Download langsung PNG ukuran stiker 3cm x 3cm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Download QR (3×3 cm)</span>
              </button>

              <button 
                @click="isQrModalOpen = true" 
                class="w-full px-4 py-2 bg-white border border-gray-200 hover:border-brand-dark text-gray-700 hover:text-brand-dark rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                <span>Cetak & Pilihan Format</span>
              </button>
              
              <!-- Check if asset is Dipinjam or Ready -->
              <NuxtLink v-if="isReady" to="/products/transfer" class="w-full block text-center px-4 py-3 bg-brand-dark text-white rounded-lg text-sm font-bold hover:bg-brand-light transition-colors shadow-sm">
                Pinjamkan sekarang
              </NuxtLink>
              <button v-else disabled class="w-full px-4 py-3 bg-gray-200 text-gray-500 rounded-lg text-sm font-bold cursor-not-allowed">
                Sedang Dipinjam
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column (Asset Details) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
            <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h2 class="text-lg font-bold text-gray-900">Asset</h2>
              <NuxtLink :to="`/products/${product.id}/edit`" class="text-sm font-bold text-gray-600 hover:text-brand-dark">
                Edit
              </NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p class="text-xs text-gray-400 mb-1">Nama Aset</p>
                <p class="font-bold text-gray-900 text-lg">{{ product.description || '-' }}</p>
              </div>
              
              <div>
                <p class="text-xs text-gray-400 mb-1">Device Name</p>
                <p class="font-bold text-brand-dark text-base font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 inline-block">
                  {{ product.device_name || '-' }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-400 mb-1">Nomor Seri / SN</p>
                <p class="font-bold text-gray-900 text-base font-mono">{{ product.serial_number || '-' }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-400 mb-1">Kategori Aset</p>
                <div class="mt-1">
                  <span v-if="product.classification?.nama_klasifikasi" :class="getClassificationColor(product.classification.nama_klasifikasi)" class="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border">
                    {{ product.classification.nama_klasifikasi }}
                  </span>
                  <span v-else class="text-gray-400 font-bold text-base">-</span>
                </div>
              </div>

              <div>
                <p class="text-xs text-gray-400 mb-1">Departemen / Lokasi</p>
                <p class="font-bold text-gray-900 text-base">{{ product.department?.nama_departemen || '-' }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-400 mb-1">Status</p>
                <div class="flex items-center gap-2 mt-1">
                  <span v-if="!isReady" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Dipinjam
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ready
                  </span>
                </div>
              </div>

              <div>
                <p class="text-xs text-gray-400 mb-1">Headset</p>
                <p class="font-bold text-gray-900 text-base">
                  <span v-if="product.has_headset" class="text-green-600 font-medium">✓ Ya (Include Headset)</span>
                  <span v-else class="text-gray-400">Tidak ada</span>
                </p>
              </div>
            </div>

            <!-- Khusus Aset HP / Smartphone: Tampilkan IMEI 1 & 2 -->
            <div v-if="isHp || product.imei" class="mt-8 pt-6 border-t border-gray-100">
              <h3 class="text-sm font-bold text-purple-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                Identitas Khusus HP (IMEI 1 & IMEI 2)
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                <!-- IMEI 1 -->
                <div class="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                  <p class="text-xs text-gray-400 mb-1 font-medium">IMEI 1</p>
                  <p class="font-mono font-bold text-gray-900 text-sm tracking-wide">{{ imei1 }}</p>
                </div>

                <!-- IMEI 2 -->
                <div class="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                  <p class="text-xs text-gray-400 mb-1 font-medium">IMEI 2</p>
                  <p class="font-mono font-bold text-gray-900 text-sm tracking-wide">{{ imei2 }}</p>
                </div>
              </div>
            </div>

            <!-- Bagian Spesifikasi Lengkap Perangkat -->
            <div class="mt-8 pt-6 border-t border-gray-100">
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                Spesifikasi Teknis
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/70 p-5 rounded-xl border border-gray-100">
                <div>
                  <p class="text-xs text-gray-400 mb-1">Processor</p>
                  <p class="font-semibold text-gray-900 text-sm">{{ product.processor || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">RAM</p>
                  <p class="font-semibold text-gray-900 text-sm">
                    {{ product.ram || '-' }}
                    <span v-if="product.new_ram" class="block text-xs text-green-700 mt-0.5 font-bold">
                      Upgrade: {{ product.new_ram }}
                    </span>
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">Penyimpanan (SSD)</p>
                  <p class="font-semibold text-gray-900 text-sm">
                    {{ product.ssd || '-' }}
                    <span v-if="product.new_ssd" class="block text-xs text-green-700 mt-0.5 font-bold">
                      Upgrade: {{ product.new_ssd }}
                    </span>
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">Operating System (OS)</p>
                  <p class="font-semibold text-gray-900 text-sm">{{ product.os || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">Screen ID</p>
                  <p class="font-semibold text-gray-900 text-sm">{{ product.screen_id || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-gray-400 mb-1">MAC Address</p>
                  <p class="font-mono text-xs font-semibold text-gray-900">{{ product.mac_address || '-' }}</p>
                </div>

                <div v-if="product.imei" class="col-span-full">
                  <p class="text-xs text-gray-400 mb-1">IMEI</p>
                  <p class="font-mono text-xs font-semibold text-gray-900">{{ product.imei }}</p>
                </div>

                <div v-if="product.remarks" class="col-span-full">
                  <p class="text-xs text-gray-400 mb-1">Catatan / Remarks</p>
                  <p class="text-sm text-gray-800 bg-white p-3 rounded-lg border border-gray-200">{{ product.remarks }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
        <h2 class="text-xl font-bold mb-2">Gagal memuat aset</h2>
        <p>Aset tidak ditemukan atau terjadi kesalahan server.</p>
      </div>

      <!-- History Table Section -->
      <div v-if="!pending && product" class="mt-8">
        <div class="mb-4">
          <h2 class="text-lg font-bold text-gray-900">Riwayat Peminjaman & Pengembalian</h2>
          <p class="text-sm text-gray-500">Tabel mutasi khusus untuk aset ini.</p>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Tampilkan</label>
            <select v-model="perPage" class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-brand-dark focus:border-brand-dark outline-none bg-gray-50">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            <span class="text-sm text-gray-600">data</span>
          </div>
          <div class="relative w-full sm:w-72">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Cari keterangan / orang..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/50">
                <tr>
                  <th @click="sortBy('created_at')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                    <div class="flex items-center gap-1">Tanggal <span v-if="sortCol === 'created_at'">{{ sortDir === 'asc' ? 'â†‘' : 'â†“' }}</span></div>
                  </th>
                  <th @click="sortBy('jenis_transaksi')" class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                    <div class="flex items-center gap-1">Status <span v-if="sortCol === 'jenis_transaksi'">{{ sortDir === 'asc' ? 'â†‘' : 'â†“' }}</span></div>
                  </th>
                  <th @click="sortBy('oleh')" class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                    <div class="flex items-center gap-1">Oleh <span v-if="sortCol === 'oleh'">{{ sortDir === 'asc' ? 'â†‘' : 'â†“' }}</span></div>
                  </th>
                  <th class="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center gap-1">Keterangan</div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-if="filteredAndSortedHistories.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-gray-400 font-medium">Tidak ada riwayat mutasi.</td>
                </tr>
                <template v-else v-for="item in paginatedHistories" :key="item.id">
                  <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500">{{ new Date(item.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) }}</span>
                        <button @click="toggleRow(item.id)" class="md:hidden p-2 text-gray-500 bg-gray-100 rounded-lg">
                          <svg v-if="!expandedRows.includes(item.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"></path></svg>
                        </button>
                      </div>
                    </td>
                    <td class="hidden md:table-cell px-6 py-4 text-sm">
                      <span class="px-2.5 py-1 text-xs font-medium rounded-full" 
                        :class="item.jenis_transaksi === 'mengembalikan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                        {{ item.jenis_transaksi === 'mengembalikan' ? 'Kembali' : 'Pinjam' }}
                      </span>
                    </td>
                    <td class="hidden md:table-cell px-6 py-4 text-sm text-gray-900">{{ item.receiver?.name || item.sender?.name || '-' }}</td>
                    <td class="hidden md:table-cell px-6 py-4 text-sm text-gray-500">{{ item.catatan || '-' }}</td>
                  </tr>
                  <!-- Mobile Expanded Row -->
                  <tr v-if="expandedRows.includes(item.id)" class="md:hidden bg-gray-50/80">
                    <td colspan="4" class="px-6 py-4">
                      <div class="space-y-3">
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                          <span class="px-2.5 py-1 text-xs font-medium rounded-full inline-block" 
                            :class="item.jenis_transaksi === 'mengembalikan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                            {{ item.jenis_transaksi === 'mengembalikan' ? 'Kembali' : 'Pinjam' }}
                          </span>
                        </div>
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Oleh</p>
                          <div class="text-sm text-gray-900">{{ item.receiver?.name || item.sender?.name || '-' }}</div>
                        </div>
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keterangan</p>
                          <div class="text-sm text-gray-500">{{ item.catatan || '-' }}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div v-if="totalPages > 0" class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-500">
              Menampilkan <span class="font-bold text-gray-900">{{ (page - 1) * perPage + (paginatedHistories.length > 0 ? 1 : 0) }}</span> sampai <span class="font-bold text-gray-900">{{ (page - 1) * perPage + paginatedHistories.length }}</span> dari <span class="font-bold text-gray-900">{{ filteredAndSortedHistories.length }}</span> data
            </div>
            <div class="inline-flex items-center gap-1 bg-white p-1 rounded-md shadow-sm border border-gray-200">
              <button 
                @click="page > 1 ? page-- : null" 
                :disabled="page === 1" 
                class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              
              <template v-for="(p, i) in paginationLinks" :key="i">
                <span v-if="p === '...'" class="flex items-center justify-center w-8 h-8 text-gray-400 font-medium">...</span>
                <button 
                  v-else 
                  @click="page = p" 
                  class="flex items-center justify-center w-8 h-8 rounded text-sm font-bold transition-all"
                  :class="p === page ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
                >
                  {{ p }}
                </button>
              </template>

              <button 
                @click="page < totalPages ? page++ : null" 
                :disabled="page === totalPages" 
                class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>

      </div>

    <!-- MODAL CETAK & DOWNLOAD QR CODE (3CM X 3CM) -->
    <div v-if="isQrModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center text-brand-dark">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">Cetak & Unduh QR Stiker</h3>
              <p class="text-xs text-gray-500 font-medium">Format presisi 3cm × 3cm (30mm × 30mm)</p>
            </div>
          </div>
          <button @click="isQrModalOpen = false" class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-5">
          <!-- 1. Barcode Format Switcher: Micro QR vs Standard QR -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Format Barcode</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button"
                @click="qrType = 'micro'" 
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between"
                :class="qrType === 'micro' ? 'border-brand-dark bg-brand-dark/5 ring-2 ring-brand-dark/20 text-brand-dark' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Micro QR (1 Finder)
                  </span>
                  <span v-if="qrType === 'micro'" class="w-2 h-2 rounded-full bg-brand-dark"></span>
                </div>
                <p class="text-[11px] text-gray-500 leading-snug">1 Kotak pojok kiri atas. 15×15 modul renggang, optimal untuk stiker fisik mini 3cm × 3cm.</p>
              </button>

              <button 
                type="button"
                @click="qrType = 'standard_qr'" 
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between"
                :class="qrType === 'standard_qr' ? 'border-brand-dark bg-brand-dark/5 ring-2 ring-brand-dark/20 text-brand-dark' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold">Standar QR (3 Finder)</span>
                  <span v-if="qrType === 'standard_qr'" class="w-2 h-2 rounded-full bg-brand-dark"></span>
                </div>
                <p class="text-[11px] text-gray-500 leading-snug">3 Kotak di sudut. Memuat link URL web lengkap untuk kamera smartphone umum.</p>
              </button>
            </div>
          </div>

          <!-- 2. Sticker Layout Switcher -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Layout Stiker</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button"
                @click="qrOptionMode = 'standard'" 
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between"
                :class="qrOptionMode === 'standard' ? 'border-brand-dark bg-brand-dark/5 ring-2 ring-brand-dark/20 text-brand-dark' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold">QR + ID Aset</span>
                  <span v-if="qrOptionMode === 'standard'" class="w-2 h-2 rounded-full bg-brand-dark"></span>
                </div>
                <p class="text-[11px] text-gray-500 leading-snug">Ada kode aset ({{ product?.full_nomor_unik || 'ID' }}) di bawah QR.</p>
              </button>

              <button 
                type="button"
                @click="qrOptionMode = 'qr_only'" 
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between"
                :class="qrOptionMode === 'qr_only' ? 'border-brand-dark bg-brand-dark/5 ring-2 ring-brand-dark/20 text-brand-dark' : 'border-gray-200 hover:border-gray-300 text-gray-700'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold">Hanya QR Code</span>
                  <span v-if="qrOptionMode === 'qr_only'" class="w-2 h-2 rounded-full bg-brand-dark"></span>
                </div>
                <p class="text-[11px] text-gray-500 leading-snug">QR ukuran penuh dengan border tepi sesuai referensi.</p>
              </button>
            </div>
          </div>

          <!-- Live Sticker Preview -->
          <div class="flex flex-col items-center">
            <div class="text-[11px] text-gray-400 font-medium mb-2 flex items-center gap-1.5">
              <span>Preview Fisik Stiker: 30 mm × 30 mm</span>
              <span class="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[10px]">1:1 Square</span>
            </div>

            <!-- Square 3cm x 3cm sticker preview frame -->
            <div class="relative w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-xl p-3 shadow-md flex flex-col items-center justify-between">
              <!-- Ruler Corner Marks -->
              <div class="absolute -top-2 -left-2 text-[9px] font-mono text-gray-400 bg-white px-1">0mm</div>
              <div class="absolute -bottom-2 -right-2 text-[9px] font-mono text-gray-400 bg-white px-1">30mm</div>

              <div class="w-full flex-1 flex items-center justify-center overflow-hidden">
                <img 
                  :src="'data:image/svg+xml;base64,' + activeQrSvg" 
                  alt="QR Code" 
                  class="object-contain transition-all"
                  :class="qrOptionMode === 'qr_only' ? 'w-40 h-40' : 'w-32 h-32'"
                />
              </div>

              <div v-if="qrOptionMode !== 'qr_only'" class="w-full text-center pt-1 font-mono font-bold text-xs text-gray-900 truncate">
                {{ product?.full_nomor_unik || qrData?.full_nomor_unik || product?.nomor_unik || '-' }}
              </div>
            </div>
          </div>

          <!-- Feature / Readability Notice -->
          <div class="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
            <div class="font-bold flex items-center gap-1.5 text-emerald-800">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span>Optimasi Keterbacaan Cetak 3cm × 3cm:</span>
            </div>
            <p class="text-[11px] text-emerald-800 pl-5">
              Resolusi ekspor <b>1200×1200 px (400 DPI)</b> menghasilkan cetakan tajam bebas blur. Margin 1 modul dan Error Correction Level M memastikan QR terbaca cepat dari jarak 15–40 cm.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-1">
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="downloadQR(qrOptionMode)" 
                class="w-full py-2.5 px-4 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-brand-light transition shadow-sm flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Unduh PNG (3×3 cm)</span>
              </button>

              <button 
                @click="downloadSvg" 
                class="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
                title="Format vektor tak terbatas untuk BarTender, CorelDRAW, Illustrator"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                <span>Unduh Vektor SVG</span>
              </button>
            </div>

            <button 
              @click="printQrDirect(qrOptionMode)" 
              class="w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-brand-dark text-gray-700 hover:text-brand-dark rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              <span>Cetak Langsung (Printer 30mm × 30mm)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Dedicated Printable Container for 30mm x 30mm Label Printers -->
    <div id="print-area-3cm" class="hidden">
      <div class="print-sticker">
        <img 
          :src="'data:image/svg+xml;base64,' + activeQrSvg" 
          alt="QR Code" 
          class="print-qr-img" 
          :class="qrOptionMode === 'qr_only' ? 'full-qr' : ''" 
        />
        <div v-if="qrOptionMode !== 'qr_only'" class="print-asset-id">
          {{ product?.full_nomor_unik || qrData?.full_nomor_unik || product?.nomor_unik || '-' }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: prodData, pending: prodPending, error: prodError } = await useApiFetch(`/products/${route.params.id}`)
const { data: qrData } = await useApiFetch(`/products/${route.params.id}/qr`)

const product = computed(() => prodData.value)
const qrType = ref('micro') // 'micro' | 'standard_qr'
const qrSvg = computed(() => qrData.value?.qr_svg || '')
const microQrSvg = computed(() => qrData.value?.micro_qr_svg || qrSvg.value)
const activeQrSvg = computed(() => {
  if (qrType.value === 'micro') {
    return microQrSvg.value || qrSvg.value
  }
  return qrSvg.value || microQrSvg.value
})
const pending = computed(() => prodPending.value)

const searchQuery = ref('')
const perPage = ref(10)
const page = ref(1)
const sortCol = ref('created_at')
const sortDir = ref('desc')
const expandedRows = ref([])

const getClassificationColor = (name) => {
  if (!name) return 'bg-gray-100 text-gray-700 border-gray-200'
  const lower = name.toLowerCase().trim()
  
  if (lower.includes('laptop') || lower.includes('notebook')) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  if (lower.includes('hp') || lower.includes('handphone') || lower.includes('phone') || lower.includes('smartphone')) {
    return 'bg-purple-50 text-purple-700 border-purple-200'
  }
  if (lower.includes('pc') || lower.includes('komputer') || lower.includes('desktop') || lower.includes('all in one') || lower.includes('aio')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (lower.includes('monitor') || lower.includes('display') || lower.includes('screen') || lower.includes('layar')) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  if (lower.includes('printer') || lower.includes('scanner') || lower.includes('fotocopy')) {
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }
  if (lower.includes('tablet') || lower.includes('ipad')) {
    return 'bg-pink-50 text-pink-700 border-pink-200'
  }
  if (lower.includes('server') || lower.includes('network') || lower.includes('switch') || lower.includes('router')) {
    return 'bg-cyan-50 text-cyan-700 border-cyan-200'
  }
  if (lower.includes('aksesoris') || lower.includes('headset') || lower.includes('mouse') || lower.includes('keyboard')) {
    return 'bg-teal-50 text-teal-700 border-teal-200'
  }
  
  const palettes = [
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-orange-50 text-orange-700 border-orange-200',
    'bg-lime-50 text-lime-800 border-lime-200',
    'bg-violet-50 text-violet-700 border-violet-200',
    'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
  ]
  let hash = 0
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palettes[Math.abs(hash) % palettes.length]
}

const isHp = computed(() => {
  const cat = (product.value?.classification?.nama_klasifikasi || '').toLowerCase()
  const desc = (product.value?.description || '').toLowerCase()
  return cat.includes('hp') || cat.includes('phone') || cat.includes('handphone') || desc.includes('hp ') || desc.includes('handphone')
})

const imei1 = computed(() => {
  if (!product.value?.imei) return '-'
  const parts = product.value.imei.split(' / ')
  return parts[0]?.trim() || '-'
})

const imei2 = computed(() => {
  if (!product.value?.imei) return '-'
  const parts = product.value.imei.split(' / ')
  return parts[1]?.trim() || '-'
})

const isReady = computed(() => {
  if (!product.value) return true;
  if (!product.value.histories || product.value.histories.length === 0) return true;
  return product.value.histories[0].receiver == null;
})

const histories = computed(() => product.value?.histories || [])

const filteredAndSortedHistories = computed(() => {
  let list = [...histories.value]

  // Filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(item => {
      const name = (item.receiver?.name || item.sender?.name || '').toLowerCase()
      const notes = (item.catatan || '').toLowerCase()
      return name.includes(q) || notes.includes(q)
    })
  }

  // Sort
  list.sort((a, b) => {
    let valA, valB
    if (sortCol.value === 'created_at') {
      valA = new Date(a.created_at).getTime()
      valB = new Date(b.created_at).getTime()
    } else if (sortCol.value === 'jenis_transaksi') {
      valA = a.jenis_transaksi
      valB = b.jenis_transaksi
    } else if (sortCol.value === 'oleh') {
      valA = a.receiver?.name || a.sender?.name || ''
      valB = b.receiver?.name || b.sender?.name || ''
    } else {
      valA = a[sortCol.value]
      valB = b[sortCol.value]
    }

    if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

const totalPages = computed(() => Math.ceil(filteredAndSortedHistories.value.length / perPage.value))

const paginatedHistories = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredAndSortedHistories.value.slice(start, start + perPage.value)
})

const paginationLinks = computed(() => {
  const current = page.value
  const last = totalPages.value
  if (last <= 7) return Array.from({length: last}, (_, i) => i + 1)
  
  if (current <= 3) return [1, 2, 3, 4, '...', last]
  if (current >= last - 2) return [1, '...', last - 3, last - 2, last - 1, last]
  return [1, '...', current - 1, current, current + 1, '...', last]
})

const toggleRow = (id) => {
  const idx = expandedRows.value.indexOf(id)
  if (idx > -1) expandedRows.value.splice(idx, 1)
  else expandedRows.value.push(id)
}

const sortBy = (col) => {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
}

const isQrModalOpen = ref(false)
const qrOptionMode = ref('standard')

const downloadQR = (mode = 'standard') => {
  const assetId = product.value?.full_nomor_unik || qrData.value?.full_nomor_unik || product.value?.nomor_unik || 'Asset'
  const svgData = activeQrSvg.value
  if (!svgData) return
  
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const size = 1200 // 1200 x 1200 px (400 DPI equivalent for 3cm x 3cm print)
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    // 1. Latar belakang putih bersih
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    
    if (mode === 'qr_only') {
      // Mode Hanya QR Code: Maksimalkan ukuran QR ke ~1080px (2.7 cm dari 3.0 cm)
      const qrSize = 1080
      const offset = (size - qrSize) / 2
      ctx.drawImage(img, offset, offset, qrSize, qrSize)
    } else {
      // Mode Standar (QR + ID Aset)
      // QR Code di bagian atas: 940 x 940 px (~2.35 cm dari 3.0 cm)
      const qrSize = 940
      const qrX = (size - qrSize) / 2
      const qrY = 40
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize)
      
      // Tulisan ID Aset di bawah QR (hitam pekat, bold, font monospace)
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 74px "Courier New", Courier, monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const textY = 1085
      ctx.fillText(assetId, size / 2, textY)
    }
    
    // Convert to PNG blob & download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const prefix = qrType.value === 'micro' ? 'MicroQR' : 'QR'
      a.download = `${prefix}-${assetId}-3x3cm${mode === 'qr_only' ? '-qronly' : ''}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }
  img.src = 'data:image/svg+xml;base64,' + svgData
}

const downloadSvg = () => {
  const svgData = activeQrSvg.value
  if (!svgData) return
  const assetId = product.value?.full_nomor_unik || qrData.value?.full_nomor_unik || product.value?.nomor_unik || 'Asset'
  
  try {
    const svgString = atob(svgData)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const prefix = qrType.value === 'micro' ? 'MicroQR' : 'QR'
    a.download = `${prefix}-${assetId}-3x3cm.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Failed to download SVG:', e)
  }
}

const printQrDirect = (mode = 'standard') => {
  qrOptionMode.value = mode
  setTimeout(() => {
    window.print()
  }, 100)
}
</script>

<style scoped>
@media print {
  @page {
    size: 30mm 30mm;
    margin: 0;
  }
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
  }
  body * {
    visibility: hidden !important;
  }
  #print-area-3cm, #print-area-3cm * {
    visibility: visible !important;
  }
  #print-area-3cm {
    display: flex !important;
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 30mm !important;
    height: 30mm !important;
    margin: 0 !important;
    padding: 1.5mm !important;
    box-sizing: border-box !important;
    align-items: center !important;
    justify-content: center !important;
    background: #ffffff !important;
    z-index: 999999 !important;
  }
  .print-sticker {
    width: 27mm;
    height: 27mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }
  .print-qr-img {
    width: 22mm;
    height: 22mm;
    object-fit: contain;
  }
  .print-qr-img.full-qr {
    width: 26mm;
    height: 26mm;
  }
  .print-asset-id {
    font-family: 'Courier New', Courier, monospace;
    font-size: 7pt;
    font-weight: 900;
    line-height: 1;
    color: #000000;
    margin-top: 1mm;
    letter-spacing: 0.3px;
  }
}
</style>

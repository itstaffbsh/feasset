<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manajemen Inventaris Aset</h1>
          <p class="text-sm text-gray-500">Kelola master inventaris aset, spesifikasi, riwayat peminjaman, dan ekspor/impor data.</p>
        </div>

        <!-- Tambah Aset (Tetap di sebelah kanan) -->
        <NuxtLink 
          to="/products/create" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand-light text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition whitespace-nowrap self-start sm:self-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Aset
        </NuxtLink>
      </div>

      <!-- Action Buttons (Export PDF, Excel, Import) di sebelah kiri di bawah deskripsi judul -->
      <div class="flex flex-wrap items-center gap-2 mt-4">
        <!-- Export PDF -->
        <button 
          @click="exportPdf" 
          :disabled="isExportingPdf"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition disabled:opacity-50"
          title="Ekspor data inventaris ke file PDF"
        >
          <div v-if="isExportingPdf" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          Export PDF
        </button>

        <!-- Export Excel -->
        <button 
          @click="exportExcel" 
          :disabled="isExportingExcel"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition disabled:opacity-50"
          title="Ekspor data inventaris ke file Excel (.xlsx)"
        >
          <div v-if="isExportingExcel" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Export Excel
        </button>

        <!-- Import Excel -->
        <button 
          @click="openImportModal" 
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition"
          title="Impor data inventaris dari Excel / CSV"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Import Excel
        </button>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Tampilkan</label>
        <select v-model="perPage" @change="fetchProducts" class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-brand-dark focus:border-brand-dark outline-none bg-gray-50">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span class="text-sm text-gray-600">data</span>
      </div>
      <div class="relative w-full sm:w-80">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Cari aset, ID, SN, pemegang..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" @input="debounceSearch" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/60">
            <tr>
              <th @click="sortBy('nomor_unik')" class="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">ID Barang <span v-if="sortCol === 'nomor_unik'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th @click="sortBy('description')" class="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Deskripsi & Kategori <span v-if="sortCol === 'description'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th @click="sortBy('serial_number')" class="hidden md:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Serial Number (SN) <span v-if="sortCol === 'serial_number'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th class="hidden sm:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Pemegang / Status
              </th>
              <th class="hidden xl:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <th class="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="6" class="px-6 py-10 text-center text-gray-400 font-medium">
                <div class="flex justify-center items-center gap-2">
                  <div class="animate-spin w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full"></div>
                  <span>Memuat data inventaris aset...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="products?.data?.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-gray-400 font-medium">
                Data aset tidak ditemukan.
              </td>
            </tr>
            <template v-else v-for="product in products.data" :key="product.id">
              <tr class="hover:bg-gray-50/50 transition-colors">
                <!-- ID Barang -->
                <td class="px-5 py-3.5 whitespace-nowrap">
                  <div class="flex justify-between items-center gap-2">
                    <div>
                      <div class="text-sm font-bold text-brand-dark font-mono">
                        {{ product.full_nomor_unik || ((product.department?.kode_asset ? product.department.kode_asset + '-' : '') + product.nomor_unik) }}
                      </div>
                      <div v-if="product.device_name" class="text-xs text-gray-500 font-mono mt-0.5">
                        {{ product.device_name }}
                      </div>
                    </div>
                    <!-- Mobile Toggle Button -->
                    <button @click="toggleRow(product.id)" class="md:hidden p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-lg">
                      <svg v-if="!expandedRows.includes(product.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                  </div>
                </td>

                <!-- Deskripsi & Kategori -->
                <td class="px-5 py-3.5">
                  <div class="font-bold text-gray-900 text-sm line-clamp-2">{{ product.description }}</div>
                  <div class="flex flex-wrap items-center gap-1.5 mt-1">
                    <span v-if="product.classification?.nama_klasifikasi" :class="getClassificationColor(product.classification.nama_klasifikasi)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border">
                      {{ product.classification.nama_klasifikasi }}
                    </span>
                  </div>
                </td>

                <!-- Serial Number (SN) - Menggantikan Spesifikasi -->
                <td class="hidden md:table-cell px-5 py-3.5 whitespace-nowrap">
                  <span v-if="product.serial_number" class="inline-flex items-center font-mono text-xs font-bold px-2 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded">
                    {{ product.serial_number }}
                  </span>
                  <span v-else class="text-gray-400 italic text-xs">-</span>
                </td>

                <!-- Pemegang / Status -->
                <td class="hidden sm:table-cell px-5 py-3.5 whitespace-nowrap">
                  <div v-if="getCurrentBorrower(product)">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Dipinjam
                    </span>
                    <div class="text-xs font-bold text-gray-900 mt-1 truncate max-w-[150px]">
                      {{ getCurrentBorrower(product)?.name }}
                    </div>
                    <div v-if="getBorrowDate(product)" class="text-[10px] text-gray-400">
                      {{ formatDate(getBorrowDate(product)) }}
                    </div>
                  </div>
                  <div v-else>
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ready
                    </span>
                  </div>
                </td>

                <!-- Remarks -->
                <td class="hidden xl:table-cell px-5 py-3.5 text-xs text-gray-500 max-w-xs">
                  <span class="line-clamp-2">{{ product.remarks || '-' }}</span>
                </td>

                <!-- Aksi -->
                <td class="px-5 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-1">
                    <NuxtLink :to="`/products/${product.id}`" class="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail & Spesifikasi">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </NuxtLink>
                    <NuxtLink :to="`/products/${product.id}/edit`" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Aset">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button @click="deleteProduct(product.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Aset">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Mobile Expanded Row -->
              <tr v-if="expandedRows.includes(product.id)" class="md:hidden bg-gray-50/80">
                <td colspan="6" class="px-5 py-4">
                  <div class="space-y-3 text-xs">
                    <div>
                      <p class="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Serial Number & Device</p>
                      <div class="bg-white p-3 rounded-lg border border-gray-100 space-y-1">
                        <div><span class="text-gray-400">SN:</span> <span class="font-mono font-bold text-gray-800">{{ product.serial_number || '-' }}</span></div>
                        <div v-if="product.device_name"><span class="text-gray-400">Device Name:</span> <span class="font-medium text-gray-800">{{ product.device_name }}</span></div>
                      </div>
                    </div>

                    <div>
                      <p class="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Status & Pemegang</p>
                      <div class="bg-white p-3 rounded-lg border border-gray-100">
                        <div v-if="getCurrentBorrower(product)" class="flex items-center justify-between">
                          <div>
                            <span class="font-bold text-gray-900">{{ getCurrentBorrower(product)?.name }}</span>
                            <div class="text-[11px] text-gray-500">Dipinjam sejak: {{ formatDate(getBorrowDate(product)) }}</div>
                          </div>
                          <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">Dipinjam</span>
                        </div>
                        <div v-else class="text-green-700 font-bold flex items-center gap-1.5">
                          <span class="w-2 h-2 rounded-full bg-green-500"></span> Ready di IT
                        </div>
                      </div>
                    </div>

                    <div v-if="product.remarks">
                      <p class="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Remarks</p>
                      <div class="bg-white p-3 rounded-lg border border-gray-100 text-gray-700">
                        {{ product.remarks }}
                      </div>
                    </div>

                    <div class="pt-2 flex gap-2 border-t border-gray-200">
                      <NuxtLink :to="`/products/${product.id}`" class="flex-1 text-center py-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-700 shadow-sm">Detail</NuxtLink>
                      <NuxtLink :to="`/products/${product.id}/edit`" class="flex-1 text-center py-2 bg-white border border-gray-200 rounded-lg font-bold text-blue-600 shadow-sm">Edit</NuxtLink>
                      <button @click="deleteProduct(product.id)" class="flex-1 text-center py-2 bg-white border border-gray-200 rounded-lg font-bold text-red-600 shadow-sm">Hapus</button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.total > 0" class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-500">
          Menampilkan <span class="font-bold text-gray-900">{{ meta.from || 0 }}</span> sampai <span class="font-bold text-gray-900">{{ meta.to || 0 }}</span> dari <span class="font-bold text-gray-900">{{ meta.total || 0 }}</span> data aset
        </div>
        <div class="inline-flex items-center gap-1 bg-white p-1 rounded-md shadow-sm border border-gray-200">
          <button 
            @click="changePage(meta.current_page - 1)" 
            :disabled="meta.current_page === 1" 
            class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <template v-for="(p, i) in paginationLinks" :key="i">
            <span v-if="p === '...'" class="flex items-center justify-center w-8 h-8 text-gray-400 font-medium">...</span>
            <button 
              v-else 
              @click="changePage(p)" 
              class="flex items-center justify-center w-8 h-8 rounded text-sm font-bold transition-all"
              :class="p === meta.current_page ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
            >
              {{ p }}
            </button>
          </template>

          <button 
            @click="changePage(meta.current_page + 1)" 
            :disabled="meta.current_page === meta.last_page" 
            class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Import Excel -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 transition-all transform animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Import Data Inventaris</h3>
              <p class="text-xs text-gray-500">Unggah file Excel (.xlsx, .xls) atau CSV (.csv)</p>
            </div>
          </div>
          <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="submitImport" class="mt-4 space-y-4">
          <!-- Template Download Notice -->
          <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start justify-between gap-3">
            <div>
              <span class="font-bold">Format Kolom Sesuai:</span>
              <p class="mt-0.5 text-amber-800">
                Name, Asset Category, ID Barang, Lend Date, Returned Date, Screen ID, Description, Proccessor, RAM, SSD, OS, Device Name, Serial Number, Remarks, MAC ADDRESS.
              </p>
              <p class="mt-1 text-[11px] text-amber-700 italic">
                *Hanya Nama Barang (Description), ID Barang, dan Jenis Barang (Asset Category) yang wajib diisi; kolom lainnya bebas dikosongkan.
              </p>
            </div>
            <button 
              type="button" 
              @click="downloadSampleTemplate" 
              class="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-white border border-amber-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Template
            </button>
          </div>

          <!-- File Upload Dropzone -->
          <div class="border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-xl p-6 text-center transition-colors bg-gray-50/50">
            <input 
              ref="importFileInput" 
              type="file" 
              accept=".xlsx,.xls,.csv,.txt" 
              @change="onImportFileSelected" 
              class="hidden" 
              id="fileImportProductInput"
            />
            <label for="fileImportProductInput" class="cursor-pointer block">
              <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <span class="text-sm font-semibold text-gray-700 block">Klik untuk memilih file</span>
              <span class="text-xs text-gray-400 block mt-1">Mendukung format .xlsx, .xls, .csv</span>
            </label>
            <div v-if="selectedImportFile" class="mt-3 p-2 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-700 flex items-center justify-between">
              <span class="truncate">{{ selectedImportFile.name }} ({{ (selectedImportFile.size / 1024).toFixed(1) }} KB)</span>
              <button type="button" @click="selectedImportFile = null" class="text-red-500 hover:text-red-700 ml-2">×</button>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              @click="showImportModal = false" 
              class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="!selectedImportFile || isImporting" 
              class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div v-if="isImporting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isImporting ? 'Mengimpor Data...' : 'Mulai Import' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Verifikasi & Pencocokan Peminjam Aset -->
    <div v-if="showHolderMatchingModal" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] transition-all transform animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 leading-tight">Pencocokan Peminjam Aset</h3>
              <p class="text-xs text-gray-500 mt-0.5">
                Ditemukan <span class="font-semibold text-gray-800">{{ matchingHolders.length }}</span> aset dengan nama pemegang. Tentukan apakah nama pemegang sama dengan karyawan terdaftar atau tidak.
              </p>
            </div>
          </div>
          <button @click="cancelHolderMatching" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Toolbar / Filter & Batch Actions -->
        <div class="px-5 py-3 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div class="relative flex-1 min-w-[240px]">
            <input 
              v-model="holderFilterQuery" 
              type="text" 
              placeholder="Cari ID barang, nama aset, atau nama di Excel..." 
              class="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 shadow-sm"
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button 
              v-if="holderFilterQuery" 
              @click="holderFilterQuery = ''" 
              class="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              ×
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button 
              type="button" 
              @click="setAllMatching(true)" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Set Semua Sama
            </button>
            <button 
              type="button" 
              @click="setAllMatching(false)" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Set Semua Tidak Sama
            </button>
          </div>
        </div>

        <!-- Scrollable List of Asset Holders -->
        <div class="p-5 overflow-y-auto space-y-3.5 flex-1 bg-gray-50/40">
          <div v-if="filteredHolders.length === 0" class="text-center py-12 text-gray-400 text-sm">
            Tidak ada data pemegang aset yang cocok dengan filter pencarian.
          </div>

          <div 
            v-for="item in filteredHolders" 
            :key="'holder-' + item.row_index" 
            class="bg-white rounded-xl p-4 border transition-all duration-150 shadow-sm"
            :class="item.is_match ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-gray-200 hover:border-gray-300'"
          >
            <!-- Card Top: Asset Info & Action Buttons -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {{ item.id_barang }}
                </span>
                <span v-if="item.category" class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {{ item.category }}
                </span>
                <span class="text-sm font-semibold text-gray-800 line-clamp-1">
                  {{ item.description }}
                </span>
              </div>

              <!-- Buttons Sama / Tidak Sama -->
              <div class="inline-flex rounded-lg shadow-sm border border-gray-200 p-0.5 bg-gray-100 shrink-0">
                <button 
                  type="button" 
                  @click="item.is_match = true; if (!item.selected_user_id && item.candidates?.length) item.selected_user_id = item.candidates[0].id" 
                  class="px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
                  :class="item.is_match ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-700 hover:bg-white/80'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  Sama
                </button>
                <button 
                  type="button" 
                  @click="item.is_match = false" 
                  class="px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
                  :class="!item.is_match ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:text-rose-700 hover:bg-white/80'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  Tidak Sama
                </button>
              </div>
            </div>

            <!-- Card Bottom: Matching Detail -->
            <div class="pt-3">
              <div class="flex items-center gap-2 mb-2 text-xs">
                <span class="text-gray-500 font-medium">Nama Pemegang di Excel:</span>
                <span class="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-900 border border-amber-200/70 inline-flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  {{ item.holder_name }}
                </span>
              </div>

              <!-- When 'Sama': Show User Selection -->
              <div v-if="item.is_match" class="space-y-1.5 animate-in fade-in duration-150">
                <label class="block text-xs font-bold text-gray-700">
                  Pilih Karyawan Peminjam:
                </label>
                <div class="relative">
                  <select 
                    v-model="item.selected_user_id" 
                    class="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-800"
                  >
                    <option value="" disabled>-- Pilih Karyawan --</option>
                    <optgroup v-if="item.candidates && item.candidates.length > 0" label="Saran Kecocokan Nama (Paling Mirip)">
                      <option v-for="cand in item.candidates" :key="'cand-' + cand.id" :value="cand.id">
                        ★ {{ cand.name }} ({{ cand.score }}% mirip) - NIK: {{ cand.employee_id }} | {{ cand.job_position }} ({{ cand.department }})
                      </option>
                    </optgroup>
                    <optgroup label="Semua Karyawan Terdaftar">
                      <option v-for="u in allUsersList" :key="'user-' + u.id" :value="u.id">
                        {{ u.name }} - NIK: {{ u.employee_id }} ({{ u.job_position }})
                      </option>
                    </optgroup>
                  </select>
                </div>
                <p class="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 mt-1">
                  <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  Aset ini akan dicatat berstatus <strong>DIPINJAM</strong> oleh karyawan tersebut.
                </p>
              </div>

              <!-- When 'Tidak Sama': Inform Asset has No Borrower -->
              <div v-else class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2 animate-in fade-in duration-150">
                <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Aset ini dianggap <strong>tidak ada peminjamnya</strong>. Status aset akan dicatat sebagai <strong>Ready / Di Kantor</strong> tanpa riwayat peminjaman.
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0 rounded-b-2xl">
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ matchCount }} Dipinjam
            </span>
            <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold border border-gray-200 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              {{ noMatchCount }} Tanpa Peminjam
            </span>
          </div>

          <div class="flex items-center gap-3 justify-end">
            <button 
              type="button" 
              @click="cancelHolderMatching" 
              class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button 
              type="button" 
              @click="confirmHolderMatchingImport" 
              :disabled="isSubmittingMatching" 
              class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div v-if="isSubmittingMatching" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isSubmittingMatching ? 'Menyimpan & Mengimpor...' : 'Simpan & Selesaikan Import' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'

const { $swal: swal } = useNuxtApp()
const searchQuery = ref('')
const products = ref({ data: [] })
const pending = ref(true)

const meta = ref(null)
const perPage = ref(10)
const page = ref(1)
const sortCol = ref('id')
const sortDir = ref('desc')

const expandedRows = ref([])
const showImportModal = ref(false)
const selectedImportFile = ref(null)
const isImporting = ref(false)
const isExportingExcel = ref(false)
const isExportingPdf = ref(false)
const importFileInput = ref(null)

// State untuk modal verifikasi peminjam saat import aset
const showHolderMatchingModal = ref(false)
const matchingHolders = ref([])
const allUsersList = ref([])
const holderFilterQuery = ref('')
const isSubmittingMatching = ref(false)

const filteredHolders = computed(() => {
  if (!holderFilterQuery.value.trim()) return matchingHolders.value
  const q = holderFilterQuery.value.toLowerCase().trim()
  return matchingHolders.value.filter(h => 
    (h.id_barang && h.id_barang.toLowerCase().includes(q)) ||
    (h.description && h.description.toLowerCase().includes(q)) ||
    (h.holder_name && h.holder_name.toLowerCase().includes(q)) ||
    (h.category && h.category.toLowerCase().includes(q))
  )
})

const matchCount = computed(() => matchingHolders.value.filter(h => h.is_match).length)
const noMatchCount = computed(() => matchingHolders.value.filter(h => !h.is_match).length)

const setAllMatching = (matchStatus) => {
  matchingHolders.value.forEach(h => {
    h.is_match = matchStatus
    if (matchStatus && !h.selected_user_id && h.candidates?.length > 0) {
      h.selected_user_id = h.candidates[0].id
    }
  })
}

const cancelHolderMatching = () => {
  showHolderMatchingModal.value = false
  matchingHolders.value = []
  selectedImportFile.value = null
  if (importFileInput.value) importFileInput.value.value = ''
}

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
  page.value = 1
  fetchProducts()
}

const changePage = (p) => {
  if (p < 1 || p > (meta.value?.last_page || 1)) return
  page.value = p
  fetchProducts()
}

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchProducts()
  }, 300)
}

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

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch(e) {
    return dateStr
  }
}

const getCurrentBorrower = (product) => {
  if (product.histories && product.histories.length > 0 && product.histories[0].receiver) {
    return product.histories[0].receiver
  }
  return null
}

const getBorrowDate = (product) => {
  if (product.histories && product.histories.length > 0) {
    return product.histories[0].tanggal_pinjam || product.histories[0].created_at
  }
  return null
}

const paginationLinks = computed(() => {
  if (!meta.value) return []
  const current = meta.value.current_page
  const last = meta.value.last_page
  
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', last]
  }
  
  if (current >= last - 3) {
    return [1, '...', last - 4, last - 3, last - 2, last - 1, last]
  }
  
  return [1, '...', current - 1, current, current + 1, '...', last]
})

const fetchProducts = async () => {
  pending.value = true
  try {
    const data = await $api(`/products?q=${searchQuery.value}&per_page=${perPage.value}&page=${page.value}&sort_by=${sortCol.value}&sort_dir=${sortDir.value}`)
    products.value = data || { data: [] }
    meta.value = data?.meta || data || null
  } catch (err) {
    console.error('Failed to fetch products', err)
  } finally {
    pending.value = false
  }
}

// Export Excel (.xlsx)
const exportExcel = async () => {
  isExportingExcel.value = true
  try {
    const res = await $api('/products-export', {
      responseType: 'blob'
    })
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `data-inventaris-aset-${new Date().toISOString().slice(0, 10)}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch(e) {
    console.error('Gagal export excel:', e)
    swal.fire('Error', 'Gagal mengunduh file Excel.', 'error')
  } finally {
    isExportingExcel.value = false
  }
}

// Export PDF (.pdf)
const exportPdf = async () => {
  isExportingPdf.value = true
  try {
    const res = await $api('/products-export-pdf', {
      responseType: 'blob'
    })
    const blob = new Blob([res], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `data-inventaris-aset-${new Date().toISOString().slice(0, 10)}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch(e) {
    console.error('Gagal export PDF:', e)
    swal.fire('Error', 'Gagal mengunduh file PDF.', 'error')
  } finally {
    isExportingPdf.value = false
  }
}

// Import Modal & Handlers
const openImportModal = () => {
  selectedImportFile.value = null
  if (importFileInput.value) importFileInput.value.value = ''
  showImportModal.value = true
}

const onImportFileSelected = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedImportFile.value = file
  }
}

const downloadSampleTemplate = () => {
  const csvContent = ",Name,Asset Category,ID Barang,Lend Date,Returned Date,Screen ID,Description,Proccessor,NEW RAM,RAM,New SSD,SSD,OS,Device Name,Serial Number,IMEI,Remaks,MAC ADDRESS\n,Indah Estrelita Dewi,Laptop,AC-00001,2023-10-30,,\"External Display AC-00002...\",\"1 Unit Laptop Lenovo Thinkpad...\",Astina,16.00 GB,16.00 GB,,512 GB,Win 11 HSL V23H2,BSH-ACCT-001,PW07J8ZV,,Ex Baskoro,\n,Wayan Ariestiani,Monitor,AC-00002,2023-10-30,,,\"Monitor HP M24fwa...\",,,,,,,3CM3190YM3,,,";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'template-import-inventaris.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const submitImport = async () => {
  if (!selectedImportFile.value) return

  isImporting.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedImportFile.value)

    const res = await $api('/products-import', {
      method: 'POST',
      body: formData
    })

    if (res?.status === 'requires_holder_matching') {
      matchingHolders.value = (res.holders || []).map(h => ({
        ...h,
        is_match: h.is_match !== undefined ? h.is_match : (h.candidates && h.candidates.length > 0 && h.candidates[0].score >= 70),
        selected_user_id: h.selected_user_id || (h.candidates && h.candidates[0] ? h.candidates[0].id : (res.all_users?.[0]?.id || ''))
      }))
      allUsersList.value = res.all_users || []
      holderFilterQuery.value = ''
      showImportModal.value = false
      showHolderMatchingModal.value = true
      return
    }

    showImportModal.value = false
    selectedImportFile.value = null
    if (importFileInput.value) importFileInput.value.value = ''
    swal.fire({
      title: 'Berhasil!',
      text: res?.message || 'Data inventaris aset berhasil diimpor.',
      icon: 'success',
      confirmButtonColor: '#2d3e50'
    })
    fetchProducts()
  } catch(e) {
    console.error('Gagal import:', e)
    swal.fire({
      title: 'Import Gagal',
      text: e?.data?.message || 'Terjadi kesalahan saat memproses file import.',
      icon: 'error',
      confirmButtonColor: '#2d3e50'
    })
  } finally {
    isImporting.value = false
  }
}

const confirmHolderMatchingImport = async () => {
  if (!selectedImportFile.value) return

  // Validasi jika ada yang dipilih 'Sama' tapi belum memilih user
  const unselectedMatch = matchingHolders.value.find(h => h.is_match && !h.selected_user_id)
  if (unselectedMatch) {
    swal.fire({
      title: 'Pilih Karyawan',
      text: `Harap tentukan karyawan peminjam untuk aset ${unselectedMatch.id_barang || unselectedMatch.description}, atau pilih tombol 'Tidak Sama'.`,
      icon: 'warning',
      confirmButtonColor: '#2d3e50'
    })
    return
  }

  isSubmittingMatching.value = true
  try {
    const mappings = {}
    matchingHolders.value.forEach(h => {
      const matchObj = {
        is_match: !!h.is_match,
        user_id: h.is_match ? h.selected_user_id : null
      }
      mappings[h.row_index] = matchObj
      if (h.id_barang) {
        mappings[h.id_barang] = matchObj
      }
    })

    const formData = new FormData()
    formData.append('file', selectedImportFile.value)
    formData.append('holder_mappings', JSON.stringify(mappings))

    const res = await $api('/products-import', {
      method: 'POST',
      body: formData
    })

    showHolderMatchingModal.value = false
    selectedImportFile.value = null
    matchingHolders.value = []
    if (importFileInput.value) importFileInput.value.value = ''

    swal.fire({
      title: 'Berhasil!',
      text: res?.message || 'Data aset berhasil diimpor dengan data peminjam yang disesuaikan.',
      icon: 'success',
      confirmButtonColor: '#2d3e50'
    })
    fetchProducts()
  } catch(e) {
    console.error('Gagal import dengan verifikasi peminjam:', e)
    swal.fire({
      title: 'Import Gagal',
      text: e?.data?.message || 'Terjadi kesalahan saat memproses data peminjam.',
      icon: 'error',
      confirmButtonColor: '#2d3e50'
    })
  } finally {
    isSubmittingMatching.value = false
  }
}

const deleteProduct = async (id) => {
  const result = await swal.fire({
    title: 'Yakin hapus aset ini?',
    text: "Aset akan dipindahkan ke Trash (Soft Delete).",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/products/${id}`, { method: 'DELETE' })
      swal.fire({ title: 'Terhapus!', text: 'Aset berhasil dihapus.', icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchProducts()
    } catch (err) {
      swal.fire('Error', err.data?.message || err.message || 'Gagal menghapus produk', 'error')
    }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manajemen Karyawan</h1>
          <p class="text-sm text-gray-500">Kelola master data karyawan, organisasi, hak akses, dan ekspor/impor data.</p>
        </div>

        <!-- Tambah Karyawan (Tetap di sebelah kanan) -->
        <NuxtLink 
          v-if="can('users', 'tambah')"
          to="/users/create" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand-light text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition whitespace-nowrap self-start sm:self-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Karyawan
        </NuxtLink>
      </div>

      <!-- Action Buttons (Export PDF, Excel, Import) di sebelah kiri di bawah deskripsi judul -->
      <div v-if="can('users', 'export') || can('users', 'import')" class="flex flex-wrap items-center gap-2 mt-4">
        <!-- Export PDF -->
        <button 
          v-if="can('users', 'export')"
          @click="exportPdf" 
          :disabled="isExportingPdf"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition disabled:opacity-50"
          title="Ekspor data ke file PDF"
        >
          <div v-if="isExportingPdf" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          Export PDF
        </button>

        <!-- Export Excel -->
        <button 
          v-if="can('users', 'export')"
          @click="exportExcel" 
          :disabled="isExportingExcel"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition disabled:opacity-50"
          title="Ekspor data ke file Excel (.xlsx)"
        >
          <div v-if="isExportingExcel" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Export Excel
        </button>

        <!-- Import Excel -->
        <button 
          v-if="can('users', 'import')"
          @click="openImportModal" 
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition"
          title="Impor data karyawan dari Excel / CSV"
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
        <select v-model="perPage" @change="fetchItems" class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-brand-dark focus:border-brand-dark outline-none bg-gray-50">
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
        <input v-model="searchQuery" type="text" placeholder="Cari nama, ID, email, posisi..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" @input="debounceSearch" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100 text-sm">
          <thead class="bg-gray-50/60">
            <tr>
              <th @click="sortBy('employee_id')" class="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Karyawan <span v-if="sortCol === 'employee_id'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th @click="sortBy('email')" class="hidden md:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center gap-1">Email <span v-if="sortCol === 'email'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th class="hidden lg:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Organisasi & Area
              </th>
              <th @click="sortBy('role')" class="hidden sm:table-cell px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                <div class="flex items-center justify-center gap-1">Role <span v-if="sortCol === 'role'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></div>
              </th>
              <th class="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="5" class="px-6 py-10 text-center text-gray-400 font-medium">
                <div class="flex justify-center items-center gap-2">
                  <div class="animate-spin w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full"></div>
                  <span>Memuat data karyawan...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-400 font-medium">
                Data karyawan tidak ditemukan.
              </td>
            </tr>
            <template v-else v-for="item in items" :key="item.id">
              <tr class="hover:bg-gray-50/60 transition-colors">
                <!-- Karyawan (Foto, Nama, ID) -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <!-- Avatar Thumbnail -->
                    <div class="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-gray-200">
                      <img v-if="getUserPhoto(item)" :src="getUserPhoto(item)" class="w-full h-full object-cover" />
                      <span v-else>{{ item.name ? item.name.substring(0, 1).toUpperCase() : 'K' }}</span>
                    </div>

                    <div class="min-w-0">
                      <div class="font-bold text-gray-900 truncate flex items-center gap-2">
                        <span>{{ item.name }}</span>
                        <!-- Mobile Toggle Button -->
                        <button @click="toggleRow(item.id)" class="md:hidden p-1 text-gray-400 hover:text-gray-600 bg-gray-100 rounded">
                          <svg v-if="!expandedRows.includes(item.id)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                        </button>
                      </div>
                      <div class="text-xs text-gray-500 font-mono mt-0.5">
                        <span class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">ID: {{ item.employee_id || '-' }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Email (BSH & Pribadi) -->
                <td class="hidden md:table-cell px-5 py-3.5">
                  <div class="space-y-0.5">
                    <div class="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                      <span class="px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">BSH</span>
                      <span class="truncate max-w-[200px]" :title="item.email_bsh || item.email">{{ item.email_bsh || item.email }}</span>
                    </div>
                    <div v-if="item.personal_email && item.personal_email !== (item.email_bsh || item.email)" class="text-xs text-gray-500 flex items-center gap-1.5">
                      <span class="px-1.5 py-0.2 bg-gray-100 text-gray-600 text-[10px] rounded">Pribadi</span>
                      <span class="truncate max-w-[200px]" :title="item.personal_email">{{ item.personal_email }}</span>
                    </div>
                  </div>
                </td>

                <!-- Organisasi & Area -->
                <td class="hidden lg:table-cell px-5 py-3.5">
                  <div class="font-medium text-gray-900">{{ item.department?.nama_departemen || '-' }}</div>
                  <div class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span>{{ item.office?.nama_kantor || '-' }}</span>
                  </div>
                </td>

                <!-- Role -->
                <td class="hidden sm:table-cell px-5 py-3.5 text-center">
                  <span class="px-2.5 py-1 text-xs font-bold rounded-full" 
                    :class="item.role === 'super_admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : (item.role === 'admin' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200')">
                    {{ item.role === 'super_admin' ? 'Super Admin' : (item.role === 'admin' ? 'Admin' : 'User') }}
                  </span>
                </td>

                <!-- Aksi -->
                <td class="px-5 py-3.5 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1">
                    <button 
                      v-if="can('users', 'make_admin') && item.role !== 'admin' && item.role !== 'super_admin'" 
                      @click="makeAdmin(item.id, item.name)" 
                      title="Jadikan Admin" 
                      class="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </button>
                    <button 
                      v-if="can('users', 'reset_password')" 
                      @click="resetPassword(item.id)" 
                      title="Reset Password" 
                      class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    </button>
                    <NuxtLink v-if="can('users', 'edit')" :to="`/users/${item.id}/edit`" title="Edit Karyawan" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </NuxtLink>
                    <button v-if="can('users', 'delete')" @click="deleteItem(item.id)" title="Hapus Karyawan" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Mobile Expanded Row -->
              <tr v-if="expandedRows.includes(item.id)" class="md:hidden bg-gray-50/90 border-b border-gray-100">
                <td colspan="5" class="px-5 py-4">
                  <div class="space-y-3 text-xs">
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Email BSH</span>
                        <span class="font-medium text-gray-800 break-all">{{ item.email_bsh || item.email || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Email Pribadi</span>
                        <span class="font-medium text-gray-800 break-all">{{ item.personal_email || '-' }}</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Organisasi / Dept</span>
                        <span class="font-medium text-gray-800">{{ item.department?.nama_departemen || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Area / Kantor</span>
                        <span class="font-medium text-gray-800">{{ item.office?.nama_kantor || '-' }}</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Jabatan</span>
                        <span class="font-medium text-gray-800">{{ item.job_position || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Level</span>
                        <span class="font-medium text-gray-800">{{ item.job_level || '-' }}</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">No. HP</span>
                        <span class="font-medium text-gray-800">{{ item.phone || item.phone_number || '-' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-400 font-bold uppercase block mb-0.5">Tgl Bergabung</span>
                        <span class="font-medium text-gray-800">{{ formatDate(item.join_date) }}</span>
                      </div>
                    </div>

                    <div v-if="item.address">
                      <span class="text-gray-400 font-bold uppercase block mb-0.5">Alamat</span>
                      <span class="font-medium text-gray-800">{{ item.address }}</span>
                    </div>

                    <div>
                      <span class="text-gray-400 font-bold uppercase block mb-0.5">Role</span>
                      <span class="px-2 py-0.5 text-[11px] font-bold rounded-full inline-block"
                        :class="item.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : (item.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700')">
                        {{ item.role }}
                      </span>
                    </div>

                    <div class="pt-2 flex flex-wrap gap-2 border-t border-gray-200">
                      <button v-if="can('users', 'make_admin') && item.role !== 'admin' && item.role !== 'super_admin'" @click="makeAdmin(item.id, item.name)" class="flex-1 py-1.5 bg-white border border-gray-200 rounded text-green-600 font-semibold shadow-sm text-center">Jadikan Admin</button>
                      <button v-if="can('users', 'reset_password')" @click="resetPassword(item.id)" class="flex-1 py-1.5 bg-white border border-gray-200 rounded text-purple-600 font-semibold shadow-sm text-center">Reset Pwd</button>
                      <NuxtLink v-if="can('users', 'edit')" :to="`/users/${item.id}/edit`" class="flex-1 py-1.5 bg-white border border-gray-200 rounded text-blue-600 font-semibold shadow-sm text-center">Edit</NuxtLink>
                      <button v-if="can('users', 'delete')" @click="deleteItem(item.id)" class="flex-1 py-1.5 bg-white border border-gray-200 rounded text-red-600 font-semibold shadow-sm text-center">Hapus</button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.total > 0" class="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-500">
          Menampilkan <span class="font-bold text-gray-900">{{ meta.from || 0 }}</span> sampai <span class="font-bold text-gray-900">{{ meta.to || 0 }}</span> dari <span class="font-bold text-gray-900">{{ meta.total || 0 }}</span> data
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
              :class="p === meta.current_page ? 'bg-brand-dark text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
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

    <!-- Modal Import Excel / CSV -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Import Data Karyawan</h3>
              <p class="text-xs text-gray-500">Unggah file Excel (.xlsx / .xls) atau CSV</p>
            </div>
          </div>
          <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="submitImport" class="p-6 space-y-4">
          <!-- Format Info Card -->
          <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 space-y-2">
            <p class="font-bold flex items-center gap-1.5 text-blue-800">
              <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Format Kolom Header yang Didukung:
            </p>
            <div class="font-mono bg-white p-2 rounded border border-blue-200 overflow-x-auto text-[11px] leading-relaxed text-gray-700">
              No, Full Name, Email BSH, Email, Organization, Job Position, Job Level, Join Date, Nomor HP, Area
            </div>
            <p class="text-blue-700 text-[11px]">
              * <em>Kolom <strong>Alamat</strong> dan <strong>Foto</strong> opsional (boleh diisi atau dikosongkan).</em>
            </p>
          </div>

          <!-- Download Template Button -->
          <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
            <span class="text-gray-600 font-medium">Belum punya template file?</span>
            <button 
              type="button" 
              @click="downloadSampleTemplate" 
              class="inline-flex items-center gap-1.5 text-brand-dark hover:underline font-bold"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Unduh Template Contoh (.csv)
            </button>
          </div>

          <!-- File Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Pilih File (.xlsx, .xls, .csv)</label>
            <div 
              @click="$refs.importFileInput.click()" 
              class="border-2 border-dashed border-gray-300 hover:border-brand-dark rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50"
            >
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p v-if="!selectedImportFile" class="text-sm text-gray-600 font-medium">Klik untuk memilih file dari komputer</p>
              <p v-else class="text-sm font-bold text-brand-dark flex items-center justify-center gap-2">
                <span>📄 {{ selectedImportFile.name }}</span>
                <span class="text-xs text-gray-400 font-normal">({{ (selectedImportFile.size / 1024).toFixed(1) }} KB)</span>
              </p>
              <p class="text-xs text-gray-400 mt-1">Maksimal ukuran file: 10MB</p>
            </div>
            <input 
              ref="importFileInput" 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              class="hidden" 
              @change="onImportFileSelected" 
            />
          </div>

          <!-- Opsi Penanganan Duplikat User -->
          <div class="bg-gray-50/80 p-4 rounded-xl border border-gray-200 text-xs space-y-2.5">
            <label class="font-bold text-gray-800 block flex items-center gap-1.5">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Jika Ditemukan Data User / Email yang Sudah Ada:
            </label>
            <div class="space-y-2">
              <label class="flex items-start gap-2 cursor-pointer">
                <input type="radio" v-model="importDuplicateAction" value="check" class="mt-0.5 text-brand-dark focus:ring-brand-dark">
                <div>
                  <span class="text-gray-900 font-semibold block">Validasi Otomatis (Tanyakan jika ada duplikat)</span>
                  <span class="text-gray-500 text-[11px]">Sistem akan menampilkan pop-up konfirmasi untuk memilih tindakan saat ada data yang sama.</span>
                </div>
              </label>
              <label class="flex items-start gap-2 cursor-pointer">
                <input type="radio" v-model="importDuplicateAction" value="use_existing" class="mt-0.5 text-brand-dark focus:ring-brand-dark">
                <div>
                  <span class="text-gray-900 font-medium block">Gunakan / Update data yang ada</span>
                  <span class="text-gray-500 text-[11px]">Memperbarui data karyawan yang sudah terdaftar tanpa membuat user duplikat.</span>
                </div>
              </label>
              <label class="flex items-start gap-2 cursor-pointer">
                <input type="radio" v-model="importDuplicateAction" value="create_new" class="mt-0.5 text-brand-dark focus:ring-brand-dark">
                <div>
                  <span class="text-gray-900 font-medium block">Tambahkan sebagai user baru</span>
                  <span class="text-gray-500 text-[11px]">Tetap membuat akun user baru (sistem otomatis menyesuaikan email unik).</span>
                </div>
              </label>
              <label class="flex items-start gap-2 cursor-pointer">
                <input type="radio" v-model="importDuplicateAction" value="cancel" class="mt-0.5 text-brand-dark focus:ring-brand-dark">
                <div>
                  <span class="text-gray-900 font-medium block">Batalkan import jika ada data sama (Cancel)</span>
                  <span class="text-gray-500 text-[11px]">Batalkan proses import secara otomatis jika ditemukan data duplikat.</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              @click="showImportModal = false" 
              class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import { usePermissions } from '~/composables/usePermissions'

const { can } = usePermissions()
const swal = inject('swal')
const config = useRuntimeConfig()

const items = ref([])
const meta = ref(null)
const pending = ref(true)

const searchQuery = ref('')
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
const importDuplicateAction = ref('check')

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
  fetchItems()
}

const changePage = (p) => {
  if (p < 1 || p > (meta.value?.last_page || 1)) return
  page.value = p
  fetchItems()
}

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchItems()
  }, 300)
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

const getUserPhoto = (user) => {
  const photo = user?.photo_url || user?.photo || user?.avatar
  if (!photo) return null
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo
  const backendBase = config.public.apiBase.replace(/\/api\/?$/, '')
  return `${backendBase}/storage/${photo}`
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

const fetchItems = async () => {
  pending.value = true
  try {
    const data = await $api(`/users?q=${encodeURIComponent(searchQuery.value)}&per_page=${perPage.value}&page=${page.value}&sort_by=${sortCol.value}&sort_dir=${sortDir.value}`)
    items.value = data?.data || []
    meta.value = data?.meta || data || null
  } catch(e) {
    console.error('Gagal mengambil data karyawan:', e)
  } finally {
    pending.value = false
  }
}

// Export Excel
const exportExcel = async () => {
  isExportingExcel.value = true
  try {
    const res = await $api('/users-export', {
      responseType: 'blob'
    })
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `data-karyawan-${new Date().toISOString().slice(0, 10)}.xlsx`)
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

// Export PDF
const exportPdf = async () => {
  isExportingPdf.value = true
  try {
    const res = await $api('/users-export-pdf', {
      responseType: 'blob'
    })
    const blob = new Blob([res], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `data-karyawan-${new Date().toISOString().slice(0, 10)}.pdf`)
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
  const csvContent = "No,Full Name,Email BSH,Email,Organization,Job Position,Job Level,Join Date,Nomor HP,Area,Alamat,Foto\n00357,Ni Wayan Yantiari,wayan.yantiari@balibsh.com,yantiariyantiari02@gmail.com,Human Resources,Office Attendant,7 - Staff,2022-05-21,,Bali,Jl. Bypass Ngurah Rai No. 123,\n00358,Budi Santoso,budi.santoso@balibsh.com,budisantoso@gmail.com,Information Technology,IT Support,7 - Staff,2023-01-15,081234567890,Jakarta,Jl. Sudirman Kav 25,"
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'template-import-karyawan.csv')
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
    if (importDuplicateAction.value !== 'check') {
      formData.append('duplicate_action', importDuplicateAction.value)
    }

    const res = await $api('/users-import', {
      method: 'POST',
      body: formData
    })

    if (res?.status === 'duplicate_found') {
      isImporting.value = false

      let duplicateListHtml = res.duplicates.map(d => `
        <div class="py-1.5 border-b border-gray-100 last:border-0 flex items-center justify-between text-xs text-left">
          <div class="pr-2">
            <span class="font-bold text-gray-900 block">${d.name}</span>
            <span class="text-gray-500 font-mono text-[11px]">${d.email}</span>
          </div>
          <span class="shrink-0 text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md">
            Sudah terdaftar: ${d.existing_name}
          </span>
        </div>
      `).join('')

      if (res.total_duplicates > 10) {
        duplicateListHtml += `<p class="text-[11px] text-gray-400 italic pt-1 text-center">... dan ${res.total_duplicates - 10} data lainnya.</p>`
      }

      const result = await swal.fire({
        title: 'Validasi User Duplikat',
        html: `
          <div class="text-left space-y-3">
            <p class="text-xs text-gray-600">
              Ditemukan <strong>${res.total_duplicates} data user/karyawan</strong> yang sudah terdaftar di sistem:
            </p>
            <div class="max-h-44 overflow-y-auto bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              ${duplicateListHtml}
            </div>
            <p class="text-xs font-bold text-gray-800 pt-1">
              Silakan tentukan tindakan untuk data user tersebut:
            </p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#2d3e50',
        denyButtonColor: '#059669',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Gunakan Data yang Ada',
        denyButtonText: 'Tambahkan User Baru',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        await executeImportWithAction('use_existing')
      } else if (result.isDenied) {
        await executeImportWithAction('create_new')
      } else {
        swal.fire({
          title: 'Import Dibatalkan',
          text: 'Proses import data karyawan dibatalkan.',
          icon: 'info',
          confirmButtonColor: '#2d3e50'
        })
      }
      return
    }

    if (res?.status === 'cancelled') {
      showImportModal.value = false
      selectedImportFile.value = null
      swal.fire({
        title: 'Import Dibatalkan',
        text: res?.message || 'Proses import dibatalkan.',
        icon: 'info',
        confirmButtonColor: '#2d3e50'
      })
      return
    }

    showImportModal.value = false
    selectedImportFile.value = null
    swal.fire({
      title: 'Berhasil!',
      text: res?.message || 'Data karyawan berhasil diimpor.',
      icon: 'success',
      confirmButtonColor: '#2d3e50'
    })
    fetchItems()
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

const executeImportWithAction = async (action) => {
  if (!selectedImportFile.value) return
  isImporting.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedImportFile.value)
    formData.append('duplicate_action', action)

    const res = await $api('/users-import', {
      method: 'POST',
      body: formData
    })

    showImportModal.value = false
    selectedImportFile.value = null
    swal.fire({
      title: 'Berhasil!',
      text: res?.message || 'Data karyawan berhasil diimpor.',
      icon: 'success',
      confirmButtonColor: '#2d3e50'
    })
    fetchItems()
  } catch(e) {
    swal.fire({
      title: 'Import Gagal',
      text: e?.data?.message || 'Terjadi kesalahan saat memproses import.',
      icon: 'error',
      confirmButtonColor: '#2d3e50'
    })
  } finally {
    isImporting.value = false
  }
}

const resetPassword = async (id) => {
  if (!can('users', 'reset_password')) {
    swal.fire('Akses Ditolak', 'Anda tidak memiliki hak akses untuk mereset password.', 'warning')
    return
  }

  const { value: formValues } = await swal.fire({
    title: 'Reset Password',
    html: `
      <div class="text-left space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
          <input id="swal-pw1" type="password" placeholder="Minimal 8 karakter..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
          <input id="swal-pw2" type="password" placeholder="Ulangi password..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors">
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: '#2d3e50',
    preConfirm: () => {
      const p1 = document.getElementById('swal-pw1').value
      const p2 = document.getElementById('swal-pw2').value
      if (!p1 || p1.length < 8) {
        swal.showValidationMessage('Password minimal 8 karakter')
        return false
      }
      if (p1 !== p2) {
        swal.showValidationMessage('Password konfirmasi tidak cocok')
        return false
      }
      return { password: p1, password_confirmation: p2 }
    }
  })

  if (formValues) {
    try {
      await $api(`/users/${id}/reset-password`, { method: 'POST', body: formValues })
      swal.fire({ title: 'Berhasil!', text: 'Password telah direset.', icon: 'success', confirmButtonColor: '#2d3e50' })
    } catch (e) {
      swal.fire('Error', e.data?.message || 'Gagal mereset password.', 'error')
    }
  }
}

const makeAdmin = async (id, name) => {
  if (!can('users', 'make_admin')) {
    swal.fire('Akses Ditolak', 'Anda tidak memiliki hak akses untuk mengubah role menjadi Admin.', 'warning')
    return
  }

  const result = await swal.fire({
    title: 'Jadikan Admin?',
    text: `Apakah Anda yakin ingin menjadikan ${name} sebagai Admin?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2d3e50',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Jadikan Admin!'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/users/${id}/make-admin`, { method: 'POST' })
      swal.fire({ title: 'Berhasil!', text: `${name} sekarang adalah Admin.`, icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchItems()
    } catch (e) {
      swal.fire('Error', e.data?.message || 'Gagal mengubah role.', 'error')
    }
  }
}

const deleteItem = async (id) => {
  const result = await swal.fire({
    title: 'Yakin hapus?',
    text: "Data karyawan akan dihapus dari sistem!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/users/${id}`, { method: 'DELETE' })
      swal.fire({ title: 'Terhapus!', text: 'Data telah dihapus.', icon: 'success', confirmButtonColor: '#2d3e50' })
      fetchItems()
    } catch (e) {
      swal.fire('Error', e.data?.message || 'Gagal menghapus.', 'error')
    }
  }
}

onMounted(() => fetchItems())
</script>

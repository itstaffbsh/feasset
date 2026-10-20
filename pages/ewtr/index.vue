<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Status EWTR</h1>
        <p class="text-xs sm:text-sm text-gray-500">Kelola dan pantau progres checklist Electronic Work / Tool Request.</p>
      </div>
      <button 
        v-if="can('ewtr', 'tambah')"
        @click="showAddModal" 
        class="w-full sm:w-auto bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-dark/20 hover:bg-brand-light flex items-center justify-center gap-2 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Tambah EWTR</span>
      </button>
    </div>

    <!-- 2 Tabs: EWTR Belum Sukses & EWTR Sukses (Responsive Grid on Mobile, Underline Tabs on Desktop) -->
    <div class="grid grid-cols-2 sm:flex border-b border-gray-200 mb-6 bg-white rounded-xl sm:rounded-t-xl sm:rounded-b-none p-1.5 sm:p-0 sm:px-4 sm:pt-2 shadow-sm gap-1.5 sm:gap-2">
      <button
        @click="switchTab('belum_sukses')"
        class="py-2.5 sm:pb-3 sm:pt-2 px-2 sm:px-4 text-xs sm:text-sm font-bold rounded-lg sm:rounded-none sm:border-b-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center"
        :class="activeTab === 'belum_sukses' 
          ? 'bg-amber-50 sm:bg-transparent text-amber-900 sm:text-brand-dark sm:border-brand-dark font-extrabold shadow-sm sm:shadow-none' 
          : 'text-gray-500 hover:text-gray-700 sm:border-transparent hover:bg-gray-50 sm:hover:bg-transparent'"
      >
        <span class="truncate">EWTR Belum Sukses</span>
        <span 
          class="text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-bold transition-colors shrink-0"
          :class="activeTab === 'belum_sukses' ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-gray-100 text-gray-600'"
        >
          {{ countBelumSukses }}
        </span>
      </button>

      <button
        @click="switchTab('sukses')"
        class="py-2.5 sm:pb-3 sm:pt-2 px-2 sm:px-4 text-xs sm:text-sm font-bold rounded-lg sm:rounded-none sm:border-b-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center"
        :class="activeTab === 'sukses' 
          ? 'bg-emerald-50 sm:bg-transparent text-emerald-900 sm:text-emerald-600 sm:border-emerald-600 font-extrabold shadow-sm sm:shadow-none' 
          : 'text-gray-500 hover:text-gray-700 sm:border-transparent hover:bg-gray-50 sm:hover:bg-transparent'"
      >
        <span class="truncate">EWTR Sukses</span>
        <span 
          class="text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-bold transition-colors shrink-0"
          :class="activeTab === 'sukses' ? 'bg-emerald-200 text-emerald-900 font-bold' : 'bg-gray-100 text-gray-600'"
        >
          {{ countSukses }}
        </span>
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-white p-3.5 sm:p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center justify-between">
      <div class="relative w-full sm:w-80 order-1 sm:order-2">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nomor, keterangan, file..." 
          class="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-brand-dark focus:border-brand-dark bg-gray-50 focus:bg-white transition-colors" 
          @input="debounceSearch" 
        />
      </div>

      <div class="flex items-center gap-2 order-2 sm:order-1 text-xs sm:text-sm text-gray-600">
        <label>Tampilkan</label>
        <select 
          v-model="perPage" 
          @change="fetchEwtrs" 
          class="border border-gray-200 rounded-lg text-xs sm:text-sm px-2.5 py-1.5 focus:ring-brand-dark focus:border-brand-dark outline-none bg-gray-50"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <span>data</span>
      </div>
    </div>

    <!-- EWTR List Container -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- 1. Desktop Table View (Hidden on mobile < md) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor EWTR</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">File PDF</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progres Checklist</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="pending">
              <td colspan="6" class="px-6 py-10 text-center text-gray-400 font-medium">Memuat data EWTR...</td>
            </tr>
            <tr v-else-if="ewtrs.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-gray-400 font-medium">
                Tidak ada data pada tab {{ activeTab === 'belum_sukses' ? 'EWTR Belum Sukses' : 'EWTR Sukses' }}.
              </td>
            </tr>
            <tr v-else v-for="item in ewtrs" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
              <!-- Nomor EWTR -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-bold text-gray-900 text-sm font-mono">{{ item.nomor_ewtr }}</div>
                <div class="text-[11px] text-gray-400">{{ formatDate(item.created_at) }}</div>
              </td>

              <!-- File PDF -->
              <td class="px-6 py-4">
                <a 
                  :href="getPdfUrl(item)" 
                  target="_blank" 
                  class="inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline max-w-[220px] truncate"
                  title="Buka PDF di tab baru"
                >
                  <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                  <span class="truncate">{{ item.pdf_name || 'Dokumen EWTR.pdf' }}</span>
                </a>
              </td>

              <!-- Progres Checklist -->
              <td class="px-6 py-4 min-w-[200px]">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-bold text-gray-700">
                    {{ item.completed_items_count }} / {{ item.total_items_count }} Selesai
                  </span>
                  <span class="text-[11px] text-gray-500 font-semibold">
                    {{ calculatePercent(item) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="item.status === 'sukses' ? 'bg-emerald-500' : 'bg-amber-500'"
                    :style="{ width: calculatePercent(item) + '%' }"
                  ></div>
                </div>
              </td>

              <!-- Keterangan -->
              <td class="px-6 py-4 text-xs text-gray-600 max-w-xs">
                <span class="line-clamp-2">{{ item.keterangan || '-' }}</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  v-if="item.status === 'sukses'"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Sukses
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Belum Sukses
                </span>
              </td>

              <!-- Aksi: Detail EWTR, Edit, Delete -->
              <td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Detail EWTR (Opens in a NEW tab) -->
                  <NuxtLink 
                    :to="`/ewtr/${item.id}`" 
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark/10 hover:bg-brand-dark text-brand-dark hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    title="Buka Detail EWTR di Tab Baru"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Detail</span>
                  </NuxtLink>

                  <!-- Edit (Only for belum_sukses) -->
                  <button 
                    v-if="item.status !== 'sukses' && can('ewtr', 'edit')"
                    @click="showEditModal(item)" 
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit EWTR"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  <!-- Delete (Only for belum_sukses) -->
                  <button 
                    v-if="item.status !== 'sukses' && can('ewtr', 'delete')"
                    @click="deleteEwtr(item.id)" 
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus EWTR"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 2. Mobile Cards View (Shown only on mobile < md) -->
      <div class="block md:hidden">
        <div v-if="pending" class="p-8 text-center text-gray-400 font-medium text-sm">
          Memuat data EWTR...
        </div>
        <div v-else-if="ewtrs.length === 0" class="p-8 text-center text-gray-400 font-medium text-sm">
          Tidak ada data pada tab {{ activeTab === 'belum_sukses' ? 'EWTR Belum Sukses' : 'EWTR Sukses' }}.
        </div>
        <div v-else class="divide-y divide-gray-100">
          <div 
            v-for="item in ewtrs" 
            :key="'mobile-' + item.id"
            class="p-4 space-y-3 hover:bg-gray-50/60 transition-colors"
          >
            <!-- Card Header: Nomor EWTR & Status Badge -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="font-bold text-gray-900 text-sm font-mono tracking-tight">
                  {{ item.nomor_ewtr }}
                </div>
                <div class="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(item.created_at) }}</span>
                </div>
              </div>

              <!-- Status Badge -->
              <span 
                v-if="item.status === 'sukses'"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sukses
              </span>
              <span 
                v-else
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Belum Sukses
              </span>
            </div>

            <!-- Progres Checklist -->
            <div class="bg-gray-50/90 rounded-xl p-3 border border-gray-100 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-gray-700 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Progres Checklist</span>
                </span>
                <span class="font-bold" :class="item.status === 'sukses' ? 'text-emerald-700' : 'text-brand-dark'">
                  {{ item.completed_items_count }} / {{ item.total_items_count }} ({{ calculatePercent(item) }}%)
                </span>
              </div>
              <div class="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="item.status === 'sukses' ? 'bg-emerald-500' : 'bg-brand-dark'"
                  :style="{ width: calculatePercent(item) + '%' }"
                ></div>
              </div>
            </div>

            <!-- File PDF -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400 font-medium shrink-0">File:</span>
              <a 
                :href="getPdfUrl(item)" 
                target="_blank" 
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-lg truncate max-w-full transition hover:bg-blue-100"
                title="Buka PDF di tab baru"
              >
                <svg class="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
                <span class="truncate">{{ item.pdf_name || 'Dokumen EWTR.pdf' }}</span>
                <svg class="w-3 h-3 text-gray-400 shrink-0 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <!-- Keterangan (if present) -->
            <div v-if="item.keterangan" class="text-xs text-gray-600 bg-gray-50/90 p-2.5 rounded-lg border border-gray-100 flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span class="line-clamp-2">{{ item.keterangan }}</span>
            </div>

            <!-- Card Actions Footer -->
            <div class="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <!-- Edit & Delete (Only for belum_sukses) -->
                <template v-if="item.status !== 'sukses'">
                  <button 
                    v-if="can('ewtr', 'edit')"
                    @click="showEditModal(item)" 
                    class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    title="Edit EWTR"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span class="text-[11px] font-semibold">Edit</span>
                  </button>

                  <button 
                    v-if="can('ewtr', 'delete')"
                    @click="deleteEwtr(item.id)" 
                    class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    title="Hapus EWTR"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span class="text-[11px] font-semibold">Hapus</span>
                  </button>
                </template>
                <span v-else class="text-[11px] text-gray-400 italic">
                  Terkunci (Sukses)
                </span>
              </div>

              <!-- Detail Button -->
              <NuxtLink 
                :to="`/ewtr/${item.id}`" 
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-dark hover:bg-brand-light text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                <span>Lihat Detail</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.total > 0" class="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Menampilkan <span class="font-bold text-gray-900">{{ meta.from || 0 }}</span> sampai <span class="font-bold text-gray-900">{{ meta.to || 0 }}</span> dari <span class="font-bold text-gray-900">{{ meta.total || 0 }}</span> data
        </div>
        <div class="inline-flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 overflow-x-auto max-w-full">
          <button 
            @click="changePage(meta.current_page - 1)" 
            :disabled="meta.current_page === 1" 
            class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <template v-for="(p, i) in paginationLinks" :key="i">
            <span v-if="p === '...'" class="flex items-center justify-center w-8 h-8 text-gray-400 font-medium shrink-0">...</span>
            <button 
              v-else 
              @click="changePage(p)" 
              class="flex items-center justify-center w-8 h-8 rounded text-xs sm:text-sm font-bold transition-all shrink-0"
              :class="p === meta.current_page ? 'bg-brand-dark text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
            >
              {{ p }}
            </button>
          </template>

          <button 
            @click="changePage(meta.current_page + 1)" 
            :disabled="meta.current_page === meta.last_page" 
            class="flex items-center justify-center w-8 h-8 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form (Tambah & Edit EWTR) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-gray-100 my-4 sm:my-8">
        <div class="flex justify-between items-center mb-4 sm:mb-5 pb-3 border-b border-gray-100">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ isEditMode ? 'Edit EWTR' : 'Tambah Dokumen EWTR' }}</h3>
            <p class="text-xs text-gray-500">Unggah file PDF dan tentukan item checklist tools.</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Upload PDF Input -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              File PDF EWTR <span v-if="!isEditMode" class="text-red-500">*</span>
            </label>
            <div 
              class="border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer hover:border-brand-dark transition-colors bg-gray-50/50"
              :class="formErrors.pdf ? 'border-red-400 bg-red-50/30' : 'border-gray-200'"
              @click="$refs.fileInput.click()"
            >
              <input 
                ref="fileInput" 
                type="file" 
                accept="application/pdf" 
                class="hidden" 
                @change="onFileSelected" 
              />
              <div v-if="selectedFileName" class="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-gray-800">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
                <span class="truncate max-w-[200px] sm:max-w-xs">{{ selectedFileName }}</span>
                <span class="text-[11px] text-emerald-600 font-bold shrink-0">(Terpilih)</span>
              </div>
              <div v-else class="text-gray-500">
                <svg class="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs font-semibold text-gray-700">Klik untuk upload file PDF EWTR</p>
                <p class="text-[10px] sm:text-[11px] text-gray-400">Format: .pdf (Maksimal 25MB)</p>
              </div>
            </div>
            <p v-if="formErrors.pdf" class="text-xs text-red-500 mt-1">File PDF EWTR wajib diunggah.</p>
          </div>

          <!-- Section: 2 inputs (Item Checklist & Keterangan) -->
          <div v-if="selectedFileName || isEditMode" class="space-y-4 pt-2 border-t border-gray-100">
            <!-- 1. Input Item (Kumpulan Checklist dari Kategori Tools EWTR) -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700">
                  Item Checklist Tools <span class="text-red-500">*</span>
                </label>
                <div class="flex items-center gap-2 text-xs">
                  <button 
                    type="button" 
                    @click="selectAllCategories" 
                    class="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Pilih Semua
                  </button>
                  <span class="text-gray-300">|</span>
                  <button 
                    type="button" 
                    @click="clearAllCategories" 
                    class="text-gray-500 hover:text-gray-700 font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <!-- Available Categories Checklist Container -->
              <div 
                class="border rounded-xl p-2.5 sm:p-3 max-h-56 overflow-y-auto space-y-2 bg-gray-50/50"
                :class="formErrors.items ? 'border-red-400 bg-red-50/20' : 'border-gray-200'"
              >
                <div v-if="loadingCategories" class="text-center py-4 text-xs text-gray-400">
                  Memuat daftar kategori tools...
                </div>
                <div v-else-if="availableCategories.length === 0" class="text-center py-4 text-xs text-gray-400">
                  Belum ada kategori tools di master data. Silakan tambahkan di menu <NuxtLink to="/ewtr-categories" class="text-blue-600 font-bold underline">Kategori Tools EWTR</NuxtLink> terlebih dahulu.
                </div>
                <div 
                  v-else 
                  v-for="cat in availableCategories" 
                  :key="cat.id" 
                  class="flex items-center gap-2.5 bg-white p-2 sm:p-2.5 rounded-lg border border-gray-100 hover:border-brand-dark/40 cursor-pointer transition select-none"
                  @click="toggleCategory(cat.id)"
                >
                  <input 
                    type="checkbox" 
                    :value="cat.id" 
                    :checked="form.items.includes(cat.id)" 
                    class="w-4 h-4 text-brand-dark rounded border-gray-300 focus:ring-brand-dark cursor-pointer"
                    @click.stop
                    @change="toggleCategory(cat.id)"
                  />
                  <span class="text-xs font-semibold text-gray-800 flex-1">{{ cat.name }}</span>
                </div>
              </div>
              <p v-if="formErrors.items" class="text-xs text-red-500 mt-1">Pilih minimal 1 item checklist tools.</p>
              <p class="text-[11px] text-gray-400 mt-1">Terpilih: {{ form.items.length }} item</p>
            </div>

            <!-- 2. Input Keterangan -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Keterangan / Catatan</label>
              <textarea 
                v-model="form.keterangan" 
                rows="3" 
                placeholder="Masukkan keterangan tambahan perihal dokumen EWTR ini..." 
                class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-brand-dark focus:border-brand-dark outline-none transition"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-gray-100">
            <button 
              type="button" 
              @click="closeModal" 
              class="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition text-center"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="w-full sm:w-auto px-5 py-2.5 bg-brand-dark hover:bg-brand-light text-white rounded-lg text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50 text-center"
            >
              {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan EWTR') }}
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
const config = useRuntimeConfig()
const swal = inject('swal')

const ewtrs = ref([])
const meta = ref(null)
const pending = ref(true)
const saving = ref(false)

const activeTab = ref('belum_sukses')
const countBelumSukses = ref(0)
const countSukses = ref(0)

const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

// Master categories for checklist input
const availableCategories = ref([])
const loadingCategories = ref(false)

// Modal state
const isModalOpen = ref(false)
const isEditMode = ref(false)
const selectedEwtr = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const fileInput = ref(null)

const form = ref({
  items: [],
  keterangan: ''
})

const formErrors = ref({
  pdf: false,
  items: false
})

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchEwtrs()
  }, 350)
}

const switchTab = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
  fetchEwtrs()
}

const fetchEwtrs = async () => {
  pending.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage.value,
      status: activeTab.value,
      q: searchQuery.value
    })
    const res = await $api(`/ewtrs?${params.toString()}`)
    ewtrs.value = res.data || []
    meta.value = res.meta || {
      current_page: res.current_page,
      last_page: res.last_page,
      total: res.total,
      from: (res.current_page - 1) * res.per_page + 1,
      to: Math.min(res.current_page * res.per_page, res.total)
    }
    if (res.meta) {
      countBelumSukses.value = res.meta.count_belum_sukses || 0
      countSukses.value = res.meta.count_sukses || 0
    }
  } catch (e) {
    console.error('Failed fetching EWTRs:', e)
  } finally {
    pending.value = false
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const res = await $api('/ewtr-categories?all=true')
    availableCategories.value = Array.isArray(res) ? res : (res.data || [])
  } catch (e) {
    console.error('Failed fetching EWTR categories:', e)
  } finally {
    loadingCategories.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || (meta.value && page > meta.value.last_page)) return
  currentPage.value = page
  fetchEwtrs()
}

const paginationLinks = computed(() => {
  if (!meta.value) return []
  const current = meta.value.current_page
  const last = meta.value.last_page
  const delta = 2
  const range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }
  if (current - delta > 2) range.unshift('...')
  if (current + delta < last - 1) range.push('...')
  range.unshift(1)
  if (last > 1) range.push(last)
  return range
})

const calculatePercent = (item) => {
  if (!item.total_items_count || item.total_items_count === 0) return 0
  return Math.round((item.completed_items_count / item.total_items_count) * 100)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getPdfUrl = (item) => {
  if (item.pdf_url) return item.pdf_url
  if (!item.pdf_path) return '#'
  const backendBase = config.public.apiBase.replace(/\/api\/?$/, '')
  return `${backendBase}/storage/${item.pdf_path}`
}

// Modal Handlers
const showAddModal = () => {
  isEditMode.value = false
  selectedEwtr.value = null
  selectedFile.value = null
  selectedFileName.value = ''
  form.value = {
    items: [],
    keterangan: ''
  }
  formErrors.value = { pdf: false, items: false }
  isModalOpen.value = true
  fetchCategories()
}

const showEditModal = (item) => {
  isEditMode.value = true
  selectedEwtr.value = item
  selectedFile.value = null
  selectedFileName.value = item.pdf_name || 'File PDF Terlampir'
  // Pre-fill selected category IDs
  const itemCatIds = (item.items || []).map(i => i.ewtr_tool_category_id).filter(Boolean)
  form.value = {
    items: itemCatIds,
    keterangan: item.keterangan || ''
  }
  formErrors.value = { pdf: false, items: false }
  isModalOpen.value = true
  fetchCategories()
}

const closeModal = () => {
  isModalOpen.value = false
}

const onFileSelected = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    swal.fire('File Tidak Sesuai', 'Harap pilih file dokumen berformat PDF asli (.pdf).', 'warning')
    e.target.value = ''
    return
  }

  // Validasi magic bytes header %PDF- langsung di browser
  try {
    const slice = file.slice(0, 1024)
    const buffer = await slice.arrayBuffer()
    const header = new TextDecoder('utf-8').decode(buffer)
    if (!header.includes('%PDF-')) {
      swal.fire('Dokumen Tidak Sah', 'File yang dipilih bukan merupakan dokumen PDF asli atau file mengalami kerusakan (header identitas %PDF- tidak ditemukan).', 'error')
      e.target.value = ''
      selectedFile.value = null
      selectedFileName.value = ''
      return
    }
  } catch (err) {
    console.warn('Gagal memeriksa header file:', err)
  }

  selectedFile.value = file
  selectedFileName.value = file.name
  formErrors.value.pdf = false
}

const toggleCategory = (catId) => {
  const idx = form.value.items.indexOf(catId)
  if (idx > -1) {
    form.value.items.splice(idx, 1)
  } else {
    form.value.items.push(catId)
  }
  if (form.value.items.length > 0) {
    formErrors.value.items = false
  }
}

const selectAllCategories = () => {
  form.value.items = availableCategories.value.map(c => c.id)
  formErrors.value.items = false
}

const clearAllCategories = () => {
  form.value.items = []
}

const submitForm = async () => {
  // Validate
  let hasError = false
  if (!isEditMode.value && !selectedFile.value) {
    formErrors.value.pdf = true
    hasError = true
  }
  if (form.value.items.length === 0) {
    formErrors.value.items = true
    hasError = true
  }
  if (hasError) return

  saving.value = true
  try {
    const formData = new FormData()
    if (selectedFile.value) {
      formData.append('pdf', selectedFile.value)
    }
    formData.append('keterangan', form.value.keterangan || '')
    form.value.items.forEach((id, index) => {
      formData.append(`items[${index}]`, id)
    })

    if (isEditMode.value) {
      formData.append('_method', 'PUT')
      await $api(`/ewtrs/${selectedEwtr.value.id}`, {
        method: 'POST',
        body: formData
      })
      swal.fire({
        title: 'Berhasil!',
        text: 'Dokumen EWTR berhasil diperbarui.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      await $api('/ewtrs', {
        method: 'POST',
        body: formData
      })
      swal.fire({
        title: 'Berhasil!',
        text: 'Dokumen EWTR berhasil ditambahkan.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    }

    closeModal()
    fetchEwtrs()
  } catch (error) {
    const msg = error.response?._data?.message || error.data?.message || 'Gagal menyimpan dokumen EWTR.'
    swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const deleteEwtr = async (id) => {
  const result = await swal.fire({
    title: 'Hapus Dokumen EWTR?',
    text: 'Seluruh data dan progres checklist pada EWTR ini akan dihapus secara permanen.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/ewtrs/${id}`, { method: 'DELETE' })
      swal.fire({
        title: 'Terhapus!',
        text: 'Dokumen EWTR berhasil dihapus.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      fetchEwtrs()
    } catch (e) {
      swal.fire('Error', 'Gagal menghapus dokumen EWTR.', 'error')
    }
  }
}

onMounted(() => {
  fetchEwtrs()
})
</script>

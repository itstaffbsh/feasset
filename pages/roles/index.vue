<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">Manajemen Hak Akses Role</h1>
          <p class="text-xs text-gray-500 mt-0.5">Konfigurasi hak akses menu, tombol tindakan (tambah, edit, hapus, import, export) untuk setiap role.</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          v-if="can('roles', 'tambah')"
          @click="openCreateModal"
          class="w-full sm:w-auto bg-brand-dark hover:bg-brand-light text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Tambah Role Baru
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards (with Skeleton Loading) -->
    <div v-if="loadingRoles" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-3">
        <div class="h-3 bg-gray-200 rounded w-28"></div>
        <div class="h-7 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Role Terdaftar</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ roles.length }}</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          {{ roles.length }}
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Karyawan Terasosiasi</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalAssignedUsers }}</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Menu Sistem</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ menuDefinitions.length }}</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Search & Filters -->
      <div class="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-2.5">
        <div class="relative flex-1 sm:max-w-sm">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama role..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition"
          >
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <button 
          @click="fetchRoles"
          title="Segarkan data"
          class="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition shrink-0"
        >
          <svg class="w-4 h-4" :class="loadingRoles ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      <!-- Skeleton Loading for Table -->
      <div v-if="loadingRoles" class="p-6 space-y-4 animate-pulse">
        <div v-for="i in 4" :key="i" class="h-14 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
      </div>

      <!-- Roles Table (Desktop / Tablet: md:block) -->
      <div v-else class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500 tracking-wider">
            <tr>
              <th class="px-6 py-4">Role & Identitas</th>
              <th class="px-6 py-4">Deskripsi</th>
              <th class="px-6 py-4 text-center">Pengguna</th>
              <th class="px-6 py-4">Hak Akses Menu</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="filteredRoles.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400">
                <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Tidak ditemukan role yang sesuai kriteria.
              </td>
            </tr>
            <tr 
              v-for="role in filteredRoles" 
              :key="role.id" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <!-- Role Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs" :class="getRoleBadgeClass(role.name)">
                    {{ (role.display_name || role.name).substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-gray-900 text-sm">{{ role.display_name || role.name }}</span>
                      <span v-if="role.is_system" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        System
                      </span>
                    </div>
                    <span class="text-xs text-gray-400 font-mono">slug: {{ role.name }}</span>
                  </div>
                </div>
              </td>

              <!-- Description -->
              <td class="px-6 py-4 max-w-xs text-xs text-gray-500">
                {{ role.description || '-' }}
              </td>

              <!-- Users Count -->
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {{ role.users_count || 0 }} user
                </span>
              </td>

              <!-- Permissions Summary -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-brand-dark h-2 rounded-full transition-all" 
                      :style="{ width: `${getPermsPercentage(role)}%` }"
                    ></div>
                  </div>
                  <span class="text-xs font-medium text-gray-600">
                    {{ countActiveMenus(role) }}/{{ menuDefinitions.length }} Menu
                  </span>
                </div>
                <div class="text-[11px] text-gray-400 mt-1 flex flex-wrap gap-1">
                  <span 
                    v-for="(acts, mKey) in (role.permissions || {})" 
                    :key="mKey" 
                    v-show="acts && acts.length > 0"
                    class="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600"
                  >
                    {{ getMenuLabel(mKey) }}: {{ acts.map(formatActionLabel).join(', ') }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button 
                    v-if="can('roles', 'edit')"
                    @click="openEditModal(role)" 
                    title="Edit Role" 
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>

                  <button 
                    v-if="can('roles', 'delete')"
                    @click="deleteRole(role)" 
                    :disabled="role.is_system || role.name === 'super_admin' || role.name === 'admin' || role.name === 'user'"
                    title="Hapus Role" 
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Roles Card List (Mobile: md:hidden) -->
      <div v-if="!loadingRoles" class="md:hidden divide-y divide-gray-100">
        <div v-if="filteredRoles.length === 0" class="p-8 text-center text-gray-400">
          <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p class="text-sm">Tidak ditemukan role yang sesuai kriteria.</p>
        </div>

        <div 
          v-for="role in filteredRoles" 
          :key="'mobile-' + role.id" 
          class="p-4 space-y-3.5 hover:bg-gray-50/50 transition-colors"
        >
          <!-- Card Header: Badge + Name + Action Buttons -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm" :class="getRoleBadgeClass(role.name)">
                {{ (role.display_name || role.name).substring(0, 2).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h3 class="font-bold text-gray-900 text-sm truncate">{{ role.display_name || role.name }}</h3>
                  <span v-if="role.is_system" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    System
                  </span>
                </div>
                <p class="text-xs text-gray-400 font-mono truncate">slug: {{ role.name }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-1 shrink-0">
              <button 
                v-if="can('roles', 'edit')"
                @click="openEditModal(role)" 
                title="Edit Role" 
                class="p-2 text-blue-600 hover:bg-blue-50 bg-blue-50/50 border border-blue-100 rounded-lg transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>

              <button 
                v-if="can('roles', 'delete')"
                @click="deleteRole(role)" 
                :disabled="role.is_system || role.name === 'super_admin' || role.name === 'admin' || role.name === 'user'"
                title="Hapus Role" 
                class="p-2 text-red-600 hover:bg-red-50 bg-red-50/50 border border-red-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          <!-- Description (if present) -->
          <p v-if="role.description" class="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
            {{ role.description }}
          </p>

          <!-- Quick Stats: Users & Menus Count -->
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {{ role.users_count || 0 }} User Karyawan
            </span>

            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-700">
                {{ countActiveMenus(role) }}/{{ menuDefinitions.length }} Menu
              </span>
              <div class="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  class="bg-brand-dark h-1.5 rounded-full transition-all" 
                  :style="{ width: `${getPermsPercentage(role)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Permissions Badges Accordion -->
          <div class="pt-1">
            <button 
              type="button" 
              @click="toggleMobileDetails(role.id)" 
              class="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition"
            >
              <span>Rincian Hak Akses ({{ countActiveMenus(role) }} Menu Aktif)</span>
              <svg class="w-4 h-4 transform transition-transform" :class="expandedMobileRoles.includes(role.id) ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            <!-- Expanded Permissions List -->
            <div v-show="expandedMobileRoles.includes(role.id)" class="mt-2 space-y-1.5 pt-1">
              <div 
                v-for="(acts, mKey) in (role.permissions || {})" 
                :key="mKey" 
                v-show="acts && acts.length > 0"
                class="p-2.5 bg-gray-50/70 border border-gray-200/80 rounded-lg text-xs"
              >
                <div class="font-bold text-gray-800 text-[11px] mb-1.5 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-brand-dark"></span>
                  {{ getMenuLabel(mKey) }}
                </div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="act in acts" 
                    :key="act"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-gray-200 text-gray-700 shadow-2xs"
                  >
                    {{ formatActionLabel(act) }}
                  </span>
                </div>
              </div>
              <div v-if="countActiveMenus(role) === 0" class="text-xs text-gray-400 italic p-2 text-center">
                Belum ada hak akses yang diaktifkan untuk role ini.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Role -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
    >
      <div 
        class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Modal Header -->
        <div class="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {{ isEditing ? 'Edit Konfigurasi Hak Akses Role' : 'Tambah Role Baru & Hak Akses' }}
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">Tentukan nama role dan centang izin tombol serta menu yang dapat diakses.</p>
          </div>
          <button 
            @click="closeModal" 
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <form @submit.prevent="saveRole" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Role Details Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Nama Role <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.display_name" 
                type="text" 
                required 
                placeholder="Contoh: Staff Gudang, Admin Cabang, Finance..." 
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark transition"
              >
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Deskripsi Singkat (Opsional)
              </label>
              <input 
                v-model="form.description" 
                type="text" 
                placeholder="Deskripsi tugas dan tanggung jawab role..." 
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark transition"
              >
            </div>
          </div>

          <!-- Permissions Section Header with Bulk Actions -->
          <div class="pt-3 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
              <div>
                <h3 class="text-sm font-bold text-gray-900">Pengaturan Checklist Hak Akses Per Menu</h3>
                <p class="text-xs text-gray-500">Pilih aksi (view, tambah, edit, delete, import, export) yang diperbolehkan untuk role ini.</p>
              </div>

              <!-- BULK ACTION BUTTONS: All Checklist & All Unchecklist -->
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  type="button" 
                  @click="checkAllPermissions"
                  class="flex-1 sm:flex-none justify-center px-3.5 py-1.5 bg-brand-dark hover:bg-brand-light text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  All Checklist
                </button>
                <button 
                  type="button" 
                  @click="uncheckAllPermissions"
                  class="flex-1 sm:flex-none justify-center px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  All Unchecklist
                </button>
              </div>
            </div>

            <!-- Menus Checklist Grid / Table -->
            <div class="space-y-3">
              <div 
                v-for="menu in menuDefinitions" 
                :key="menu.key"
                class="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all bg-white shadow-sm"
              >
                <!-- Menu Row Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                  <div class="flex items-center gap-2.5">
                    <span class="w-2.5 h-2.5 rounded-full" :class="isMenuPartiallyOrFullyChecked(menu.key) ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-gray-300'"></span>
                    <span class="font-bold text-gray-900 text-sm">{{ menu.label }}</span>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {{ menu.category }}
                    </span>
                  </div>

                  <!-- Quick toggle for this single menu -->
                  <button 
                    type="button" 
                    @click="toggleMenuAll(menu)"
                    class="text-xs text-brand-dark font-semibold hover:underline self-start sm:self-auto"
                  >
                    {{ isMenuFullyChecked(menu) ? 'Batal Pilih Semua' : 'Pilih Semua di Menu Ini' }}
                  </button>
                </div>

                <!-- Checkbox Actions Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 text-xs">
                  <!-- View Checkbox -->
                  <label 
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'view') ? 'bg-blue-50/50 border-blue-200 text-blue-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'view')" 
                      @change="toggleAction(menu.key, 'view')" 
                      class="rounded text-brand-dark focus:ring-brand-dark w-4 h-4"
                    >
                    <span>View / Lihat</span>
                  </label>

                  <!-- Tambah Checkbox (if menu supports tambah) -->
                  <label 
                    v-if="menu.actions.includes('tambah')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'tambah') ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'tambah')" 
                      @change="toggleAction(menu.key, 'tambah')" 
                      class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    >
                    <span>Tambah Data</span>
                  </label>

                  <!-- Edit Checkbox (if menu supports edit) -->
                  <label 
                    v-if="menu.actions.includes('edit')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'edit') ? 'bg-amber-50/50 border-amber-200 text-amber-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'edit')" 
                      @change="toggleAction(menu.key, 'edit')" 
                      class="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    >
                    <span>Edit Data</span>
                  </label>

                  <!-- Delete Checkbox (if menu supports delete) -->
                  <label 
                    v-if="menu.actions.includes('delete')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'delete') ? 'bg-red-50/50 border-red-200 text-red-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'delete')" 
                      @change="toggleAction(menu.key, 'delete')" 
                      class="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    >
                    <span>Hapus Data</span>
                  </label>

                  <!-- Import Checkbox (Only if menu has import & export) -->
                  <label 
                    v-if="menu.has_import_export && menu.actions.includes('import')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'import') ? 'bg-purple-50/50 border-purple-200 text-purple-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'import')" 
                      @change="toggleAction(menu.key, 'import')" 
                      class="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    >
                    <span>Import File</span>
                  </label>

                  <!-- Export Checkbox (Only if menu has import & export) -->
                  <label 
                    v-if="menu.has_import_export && menu.actions.includes('export')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'export') ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'export')" 
                      @change="toggleAction(menu.key, 'export')" 
                      class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    >
                    <span>Export Excel/PDF</span>
                  </label>

                  <!-- Jadikan Admin Checkbox (Only if menu supports make_admin) -->
                  <label 
                    v-if="menu.actions.includes('make_admin')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'make_admin') ? 'bg-teal-50/60 border-teal-200 text-teal-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'make_admin')" 
                      @change="toggleAction(menu.key, 'make_admin')" 
                      class="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    >
                    <span>Jadikan Admin</span>
                  </label>

                  <!-- Reset Password Checkbox (Only if menu supports reset_password) -->
                  <label 
                    v-if="menu.actions.includes('reset_password')"
                    class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition select-none"
                    :class="hasAction(menu.key, 'reset_password') ? 'bg-rose-50/60 border-rose-200 text-rose-900 font-semibold' : 'bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50'"
                  >
                    <input 
                      type="checkbox" 
                      :checked="hasAction(menu.key, 'reset_password')" 
                      @change="toggleAction(menu.key, 'reset_password')" 
                      class="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    >
                    <span>Reset Password</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5 sm:gap-3 sticky bottom-0 bg-white px-4 sm:px-6 py-3">
            <button 
              type="button" 
              @click="closeModal" 
              class="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="isSaving" 
              class="flex-1 sm:flex-none justify-center px-5 sm:px-6 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-light text-white text-sm font-bold shadow-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              <div v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isSaving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Role') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissions } from '~/composables/usePermissions'

const router = useRouter()
const swal = inject('swal')
const { user, isAuthLoaded, can, isAdminOrSuperAdmin, initAuth } = usePermissions()

// Access guard: only admin and superadmin
onMounted(async () => {
  await initAuth()
  if (!isAdminOrSuperAdmin.value) {
    router.replace('/dashboard')
    return
  }
  fetchRoles()
})

const roles = ref([])
const menuDefinitions = ref([])
const loadingRoles = ref(true)
const searchQuery = ref('')
const expandedMobileRoles = ref([])

const toggleMobileDetails = (id) => {
  const idx = expandedMobileRoles.value.indexOf(id)
  if (idx > -1) {
    expandedMobileRoles.value.splice(idx, 1)
  } else {
    expandedMobileRoles.value.push(id)
  }
}

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const isSaving = ref(false)

const form = ref({
  display_name: '',
  description: '',
  permissions: {},
})

const fetchRoles = async () => {
  loadingRoles.value = true
  try {
    const res = await $api('/roles')
    roles.value = res.roles || []
    menuDefinitions.value = res.menus || []
  } catch (err) {
    console.error('Gagal mengambil daftar role:', err)
    if (swal) {
      swal.fire('Error', err.data?.message || 'Gagal mengambil data role.', 'error')
    }
  } finally {
    loadingRoles.value = false
  }
}

const totalAssignedUsers = computed(() => {
  return roles.value.reduce((acc, r) => acc + (r.users_count || 0), 0)
})

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value
  const q = searchQuery.value.toLowerCase()
  return roles.value.filter(r => 
    (r.display_name && r.display_name.toLowerCase().includes(q)) ||
    (r.name && r.name.toLowerCase().includes(q)) ||
    (r.description && r.description.toLowerCase().includes(q))
  )
})

const getRoleBadgeClass = (name) => {
  if (name === 'super_admin') return 'bg-purple-100 text-purple-700 border border-purple-200'
  if (name === 'admin') return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (name === 'user') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  return 'bg-amber-100 text-amber-700 border border-amber-200'
}

const getMenuLabel = (key) => {
  const m = menuDefinitions.value.find(item => item.key === key)
  return m ? m.label : key
}

const formatActionLabel = (act) => {
  const map = {
    view: 'View',
    tambah: 'Tambah',
    edit: 'Edit',
    delete: 'Hapus',
    import: 'Import',
    export: 'Export',
    make_admin: 'Jadikan Admin',
    reset_password: 'Reset Password'
  }
  return map[act] || act
}

const countActiveMenus = (role) => {
  if (!role.permissions) return 0
  return Object.keys(role.permissions).filter(k => role.permissions[k] && role.permissions[k].length > 0).length
}

const getPermsPercentage = (role) => {
  if (menuDefinitions.value.length === 0) return 0
  const active = countActiveMenus(role)
  return Math.round((active / menuDefinitions.value.length) * 100)
}

// Modal open/close
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    display_name: '',
    description: '',
    permissions: {},
  }
  showModal.value = true
}

const openEditModal = (role) => {
  isEditing.value = true
  editingId.value = role.id
  form.value = {
    display_name: role.display_name || role.name,
    description: role.description || '',
    permissions: JSON.parse(JSON.stringify(role.permissions || {})),
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Checklist Helpers
const hasAction = (menuKey, action) => {
  const perms = form.value.permissions[menuKey]
  return Array.isArray(perms) && perms.includes(action)
}

const toggleAction = (menuKey, action) => {
  if (!form.value.permissions[menuKey]) {
    form.value.permissions[menuKey] = []
  }
  const perms = form.value.permissions[menuKey]
  const idx = perms.indexOf(action)
  if (idx > -1) {
    perms.splice(idx, 1)
  } else {
    perms.push(action)
    // If adding an action like tambah, edit, delete, automatically also ensure view is checked
    if (!perms.includes('view')) {
      perms.push('view')
    }
  }
}

const isMenuFullyChecked = (menu) => {
  const current = form.value.permissions[menu.key] || []
  return menu.actions.every(act => current.includes(act))
}

const isMenuPartiallyOrFullyChecked = (menuKey) => {
  const perms = form.value.permissions[menuKey]
  return Array.isArray(perms) && perms.length > 0
}

const toggleMenuAll = (menu) => {
  if (isMenuFullyChecked(menu)) {
    form.value.permissions[menu.key] = []
  } else {
    form.value.permissions[menu.key] = [...menu.actions]
  }
}

// BULK CHECKLIST ACTIONS: All Checklist & All Unchecklist
const checkAllPermissions = () => {
  const newPerms = {}
  for (const menu of menuDefinitions.value) {
    newPerms[menu.key] = [...menu.actions]
  }
  form.value.permissions = newPerms
}

const uncheckAllPermissions = () => {
  form.value.permissions = {}
}

// Save Role
const saveRole = async () => {
  if (!form.value.display_name.trim()) {
    if (swal) swal.fire('Validasi', 'Nama role wajib diisi.', 'warning')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value) {
      await $api(`/roles/${editingId.value}`, {
        method: 'PUT',
        body: {
          display_name: form.value.display_name,
          description: form.value.description,
          permissions: form.value.permissions,
        }
      })
      if (swal) {
        swal.fire({
          title: 'Berhasil!',
          text: 'Konfigurasi role berhasil diperbarui.',
          icon: 'success',
          confirmButtonColor: '#2d3e50'
        })
      }
    } else {
      await $api('/roles', {
        method: 'POST',
        body: {
          name: form.value.display_name,
          display_name: form.value.display_name,
          description: form.value.description,
          permissions: form.value.permissions,
        }
      })
      if (swal) {
        swal.fire({
          title: 'Berhasil!',
          text: 'Role baru berhasil ditambahkan.',
          icon: 'success',
          confirmButtonColor: '#2d3e50'
        })
      }
    }

    closeModal()
    fetchRoles()
    // Refresh current user's permissions in case current user's role was modified
    initAuth(true)
  } catch (err) {
    console.error('Gagal menyimpan role:', err)
    if (swal) {
      swal.fire('Error', err.data?.message || 'Gagal menyimpan data role.', 'error')
    }
  } finally {
    isSaving.value = false
  }
}

// Delete Role
const deleteRole = async (role) => {
  if (!swal) return
  const result = await swal.fire({
    title: `Hapus role "${role.display_name || role.name}"?`,
    text: 'Role yang sudah dihapus tidak dapat dipulihkan kembali.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus Role',
    cancelButtonText: 'Batal'
  })

  if (result.isConfirmed) {
    try {
      await $api(`/roles/${role.id}`, { method: 'DELETE' })
      swal.fire({
        title: 'Terhapus!',
        text: 'Role berhasil dihapus dari sistem.',
        icon: 'success',
        confirmButtonColor: '#2d3e50'
      })
      fetchRoles()
    } catch (err) {
      swal.fire('Gagal Menghapus', err.data?.message || 'Role tidak dapat dihapus.', 'error')
    }
  }
}
</script>

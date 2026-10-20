<template>
  <div class="min-h-screen bg-brand-bg flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out lg:translate-x-0" :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="h-16 flex items-center px-6 border-b border-gray-50">
        <div class="flex items-center gap-2 text-brand-dark font-bold text-xl">
          <div class="w-8 h-8 bg-brand-dark rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div class="leading-tight">
            AssetCore<br><span class="text-[10px] font-normal text-gray-400 block -mt-1">Enterprise</span>
          </div>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto py-6 px-4">
        <!-- Skeleton Loading State for Sidebar (hanya muncul sebentar saat initial reload) -->
        <div v-if="!isAuthLoaded || isAuthLoading" class="space-y-6 animate-pulse px-2">
          <div>
            <div class="h-3 bg-gray-200 rounded w-20 mb-3"></div>
            <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
          </div>
          <div>
            <div class="h-3 bg-gray-200 rounded w-24 mb-3"></div>
            <div class="space-y-2">
              <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
              <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
              <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
            </div>
          </div>
          <div>
            <div class="h-3 bg-gray-200 rounded w-28 mb-3"></div>
            <div class="space-y-2">
              <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
              <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
              <div class="h-9 bg-gray-100 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        <!-- Authorized Menus -->
        <div v-else>
          <!-- Dashboard Section -->
          <div v-if="canView('dashboard')" class="mb-6">
            <p class="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">Dashboard</p>
            <nav class="space-y-1">
              <NuxtLink to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/dashboard') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Dashboard
              </NuxtLink>
            </nav>
          </div>

          <!-- Master Data Section -->
          <div v-if="hasMasterDataMenu" class="mb-6">
            <p class="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">Master Data</p>
            <nav class="space-y-1">
              <NuxtLink v-if="canView('users')" to="/users" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/users') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Karyawan
              </NuxtLink>
              <NuxtLink v-if="canView('offices')" to="/offices" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/offices') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Kantor & Lokasi
              </NuxtLink>
              <NuxtLink v-if="canView('classifications')" to="/classifications" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/classifications') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                Kategori Aset
              </NuxtLink>
              <NuxtLink v-if="canView('departments')" to="/departments" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/departments') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Departemen
              </NuxtLink>
              <NuxtLink v-if="canView('ewtr-categories')" to="/ewtr-categories" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/ewtr-categories') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Kategori Tools EWTR
              </NuxtLink>
            </nav>
          </div>

          <!-- Aset & Transaksi Section -->
          <div v-if="hasAssetTransaksiMenu" class="mb-6">
            <p class="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">Aset & Transaksi</p>
            <nav class="space-y-1 mb-6">
              <!-- Daftar Inventaris (Visible on mobile and desktop sidebar) -->
              <NuxtLink v-if="canView('products')" to="/products" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/products') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                Daftar Inventaris
              </NuxtLink>
              <!-- Pinjam / Kembali Aset -->
              <NuxtLink v-if="canView('transfer')" to="/products/transfer" class="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/products/transfer') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                Pinjam / Kembali Aset
              </NuxtLink>
              <NuxtLink v-if="canView('history')" to="/history" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/history') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                Riwayat Mutasi
              </NuxtLink>
              <NuxtLink v-if="canView('borrow-status')" to="/borrow-status" class="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/borrow-status') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Status Peminjaman
              </NuxtLink>
              <NuxtLink v-if="canView('ewtr')" to="/ewtr" class="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/ewtr') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Status EWTR
              </NuxtLink>
            </nav>
          </div>

          <!-- Pengaturan & Role Management (Hanya muncul di akun Admin & Superadmin) -->
          <div v-if="isAdminOrSuperAdmin && canView('roles')" class="mb-6">
            <p class="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">Pengaturan</p>
            <nav class="space-y-1">
              <NuxtLink to="/roles" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="isActive('/roles') ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Manajemen Role
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t border-gray-100">
        <button @click="logout" class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"></div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all duration-300">
      <!-- Top Navbar -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
        <!-- Mobile Menu Button -->
        <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 mr-4 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-dark">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        
        <!-- Search -->
        <div class="flex-1 max-w-2xl flex items-center">
        </div>

        <!-- Right Menu -->
        <div class="flex items-center gap-4">
          <!-- Scan QR button in header is hidden on mobile screens -->
          <NuxtLink to="/scanner" class="hidden lg:flex bg-brand-dark text-white px-4 py-2 rounded-full text-sm font-medium items-center gap-2 hover:bg-brand-light transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            Scan QR
          </NuxtLink>
          
          <!-- User Profile Pill or Skeleton -->
          <div v-if="!isAuthLoaded || isAuthLoading" class="flex items-center gap-3 lg:pl-4 lg:border-l border-gray-200 animate-pulse">
            <div class="text-right hidden md:block space-y-1">
              <div class="h-3.5 bg-gray-200 rounded w-24"></div>
              <div class="h-2.5 bg-gray-200 rounded w-14 ml-auto"></div>
            </div>
            <div class="w-9 h-9 rounded-full bg-gray-200"></div>
          </div>

          <NuxtLink v-else to="/profile" class="flex items-center gap-3 lg:pl-4 lg:border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors group">
            <div class="text-right hidden md:block">
              <p class="text-sm font-semibold text-gray-900 leading-tight group-hover:text-brand-dark transition-colors">{{ user?.name || 'User' }}</p>
              <p class="text-xs text-gray-500 font-medium">{{ user?.role_display_name || (user?.role === 'super_admin' ? 'Super Admin' : (user?.role === 'admin' ? 'Admin' : 'User')) }}</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold shadow-sm overflow-hidden border-2 border-white ring-2 ring-transparent group-hover:ring-brand-light transition-all">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" />
                <span v-else>{{ user?.name ? user.name.substring(0,1).toUpperCase() : 'U' }}</span>
            </div>
          </NuxtLink>
        </div>
      </header>

      <!-- Page Content (extra pb on mobile for bottom navbar) -->
      <main class="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
        <slot />
      </main>

      <!-- Mobile Bottom Navigation Bar (Stays fixed at the bottom on mobile) -->
      <nav class="fixed bottom-0 inset-x-0 z-30 lg:hidden pointer-events-none select-none">
        <!-- Background Layer with Smooth Center Notch and Drop Shadow -->
        <div class="relative w-full filter drop-shadow-[0_-3px_12px_rgba(0,0,0,0.08)]">
          <div class="flex items-end w-full">
            <!-- Left flat bar -->
            <div class="flex-1 h-16 bg-white border-t border-gray-100"></div>

            <!-- Center Notch Scoop SVG (Smooth curved dip cradling the floating circular button) -->
            <div class="w-24 h-[72px] relative -mx-[1px] flex-shrink-0">
              <svg class="w-full h-full block text-white fill-current" viewBox="0 0 96 72" preserveAspectRatio="none">
                <path d="M0 8 C 18 8, 22 44, 48 44 C 74 44, 78 8, 96 8 L96 72 L0 72 Z" />
                <path d="M0 8 C 18 8, 22 44, 48 44 C 74 44, 78 8, 96 8" fill="none" stroke="#f3f4f6" stroke-width="1.2" />
              </svg>
            </div>

            <!-- Right flat bar -->
            <div class="flex-1 h-16 bg-white border-t border-gray-100"></div>
          </div>
          <!-- Safe area bottom filler -->
          <div class="w-full bg-white h-[env(safe-area-inset-bottom)]"></div>
        </div>

        <!-- Foreground Interactive Menu Items -->
        <div class="absolute inset-x-0 bottom-0 pointer-events-auto pb-[env(safe-area-inset-bottom)]">
          <div class="flex items-center w-full h-16 max-w-lg mx-auto">
            <!-- Left Side: Home & EWTR / Assets -->
            <div class="flex-1 flex items-center justify-around">
              <!-- Home -->
              <NuxtLink 
                to="/dashboard" 
                class="flex-1 flex flex-col items-center justify-center py-1 transition-colors group"
                :class="isActive('/dashboard') ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'"
              >
                <svg class="w-6 h-6 mb-1 transition-transform group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 10.5l7.5-6.5a2 2 0 012.6 0L21 10.5M5 9v10a2 2 0 002 2h10a2 2 0 002-2V9" />
                </svg>
                <span class="text-[11px] font-medium leading-none" :class="isActive('/dashboard') ? 'font-bold' : ''">Home</span>
              </NuxtLink>

              <!-- EWTR (Status EWTR) -->
              <NuxtLink 
                v-if="canView('ewtr')"
                to="/ewtr" 
                class="flex-1 flex flex-col items-center justify-center py-1 transition-colors group"
                :class="isActive('/ewtr') ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'"
              >
                <svg class="w-6 h-6 mb-1 transition-transform group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span class="text-[11px] font-medium leading-none" :class="isActive('/ewtr') ? 'font-bold' : ''">EWTR</span>
              </NuxtLink>
            </div>

            <!-- Center Notch: Scan QR Button -->
            <div class="w-24 flex-shrink-0 relative flex items-center justify-center">
              <!-- Halo / Recessed Dish Effect -->
              <div class="absolute -top-6 w-[62px] h-[62px] rounded-full bg-slate-100/80 shadow-inner flex items-center justify-center pointer-events-none"></div>

              <!-- Elevated Circular Button using Primary Color (brand-dark) -->
              <NuxtLink 
                to="/scanner" 
                class="absolute -top-5 w-14 h-14 rounded-full bg-brand-dark text-white flex items-center justify-center shadow-lg shadow-brand-dark/30 hover:bg-brand-light active:scale-95 transition-all duration-200 z-10"
                :class="isActive('/scanner') ? 'ring-2 ring-offset-2 ring-brand-dark' : ''"
                aria-label="Scan QR"
                title="Scan QR"
              >
                <!-- Viewfinder / Scanner Icon matching the reference image -->
                <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 8V6a2 2 0 012-2h2" />
                  <path d="M4 16v2a2 2 0 002 2h2" />
                  <path d="M16 4h2a2 2 0 012 2v2" />
                  <path d="M16 20h2a2 2 0 002-2v-2" />
                  <rect x="8" y="8" width="8" height="8" rx="1.5" />
                </svg>
              </NuxtLink>
            </div>

            <!-- Right Side: Pinjam & Status -->
            <div class="flex-1 flex items-center justify-around">
              <!-- Pinjam (Pinjam / Kembali Aset) -->
              <NuxtLink 
                v-if="canView('transfer')"
                to="/products/transfer" 
                class="flex-1 flex flex-col items-center justify-center py-1 transition-colors group"
                :class="isActive('/products/transfer') ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'"
              >
                <svg class="w-6 h-6 mb-1 transition-transform group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span class="text-[11px] font-medium leading-none" :class="isActive('/products/transfer') ? 'font-bold' : ''">Pinjam</span>
              </NuxtLink>

              <!-- Status (Status Peminjaman) -->
              <NuxtLink 
                v-if="canView('borrow-status')"
                to="/borrow-status" 
                class="flex-1 flex flex-col items-center justify-center py-1 transition-colors group"
                :class="isActive('/borrow-status') ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'"
              >
                <svg class="w-6 h-6 mb-1 transition-transform group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-[11px] font-medium leading-none" :class="isActive('/borrow-status') ? 'font-bold' : ''">Status</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissions } from '~/composables/usePermissions'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const isSidebarOpen = ref(false)

watch(() => route.path, () => { isSidebarOpen.value = false })

const { user, isAuthLoaded, isAuthLoading, initAuth, canView, isAdminOrSuperAdmin, clearAuth } = usePermissions()

const isActive = (path) => {
  if (path === '/products') {
    return route.path === '/products' || (route.path.startsWith('/products/') && 
      !route.path.startsWith('/products/transfer') && !route.path.startsWith('/products/trash'))
  }
  return route.path === path || route.path.startsWith(path + '/')
}

const hasMasterDataMenu = computed(() => {
  return canView('users') || canView('offices') || canView('classifications') || canView('departments') || canView('ewtr-categories')
})

const hasAssetTransaksiMenu = computed(() => {
  return canView('products') || canView('transfer') || canView('history') || canView('borrow-status') || canView('ewtr')
})

const userPhotoUrl = computed(() => {
  const photo = user.value?.photo_url || user.value?.photo || user.value?.avatar
  if (!photo) return null
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo
  const backendBase = config.public.apiBase.replace(/\/api\/?$/, '')
  return `${backendBase}/storage/${photo}`
})

onMounted(() => {
  // Hanya fetch data profile/permissions sekali saja saat reload atau initial mount
  initAuth()
})

const logout = async () => {
  try {
    await $api('/logout', { method: 'POST' })
  } catch (e) {}
  clearAuth()
  router.push('/login')
}
</script>

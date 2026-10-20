import { ref, computed } from 'vue'

export interface MenuDefinition {
  key: string
  label: string
  category: string
  has_import_export: boolean
  actions: string[]
}

export const usePermissions = () => {
  const user = useState<any>('auth_user', () => null)
  const permissions = useState<Record<string, string[]>>('auth_permissions', () => ({}))
  const isAuthLoaded = useState<boolean>('auth_is_loaded', () => false)
  const isAuthLoading = useState<boolean>('auth_is_loading', () => false)
  const tokenCookie = useCookie('auth_token')

  /**
   * Mengambil data user dan permission sekali saja saat reload / initial load.
   * Saat pindah halaman (SPA navigation), fungsi ini tidak memanggil API ulang.
   */
  const initAuth = async (force = false) => {
    if (!tokenCookie.value) {
      user.value = null
      permissions.value = {}
      isAuthLoaded.value = true
      isAuthLoading.value = false
      return null
    }

    // Jika sudah pernah dimuat dan tidak dipaksa refresh, gunakan cache in-memory
    if (isAuthLoaded.value && user.value && !force) {
      return user.value
    }

    try {
      isAuthLoading.value = true
      const res: any = await $api('/me')
      const userData = res?.user || res

      if (userData) {
        user.value = userData
        permissions.value = userData.permissions || {}
      }
    } catch (err) {
      console.error('[usePermissions] Gagal memuat profil pengguna:', err)
      user.value = null
      permissions.value = {}
    } finally {
      isAuthLoaded.value = true
      isAuthLoading.value = false
    }

    return user.value
  }

  /**
   * Helper pengecekan hak akses (O(1) memory lookup)
   * Tidak ada overhead komputasi berat saat ganti page.
   */
  const can = (menuKey: string, action: string): boolean => {
    if (!user.value) return false
    // Super Admin selalu memiliki akses penuh ke seluruh menu dan tombol
    if (user.value.role === 'super_admin') return true

    const menuPerms = permissions.value[menuKey]
    if (!menuPerms || !Array.isArray(menuPerms)) return false

    return menuPerms.includes(action)
  }

  /**
   * Helper pengecekan apakah menu boleh dilihat (view)
   */
  const canView = (menuKey: string): boolean => {
    if (!user.value) return false
    if (user.value.role === 'super_admin') return true

    // Menu role management khusus hanya untuk superadmin dan admin
    if (menuKey === 'roles') {
      const isRoleAdmin = user.value.role === 'admin' || user.value.role === 'super_admin'
      return isRoleAdmin && (permissions.value['roles']?.includes('view') ?? true)
    }

    return can(menuKey, 'view')
  }

  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isAdminOrSuperAdmin = computed(() => isSuperAdmin.value || isAdmin.value)

  const clearAuth = () => {
    user.value = null
    permissions.value = {}
    isAuthLoaded.value = false
    tokenCookie.value = null
  }

  return {
    user,
    permissions,
    isAuthLoaded,
    isAuthLoading,
    initAuth,
    can,
    canView,
    isSuperAdmin,
    isAdmin,
    isAdminOrSuperAdmin,
    clearAuth,
  }
}

<script setup>
const tokenCookie = useCookie('auth_token')

if (tokenCookie.value) {
  navigateTo('/dashboard')
} else {
  navigateTo('/login')
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-gray-500 font-medium">Memuat aplikasi...</div>
  </div>
</template>

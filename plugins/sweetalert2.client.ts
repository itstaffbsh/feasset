import Swal from 'sweetalert2'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('swal', Swal)
  nuxtApp.vueApp.provide('swal', Swal)
})

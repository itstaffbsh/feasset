import { useRuntimeConfig, useCookie } from '#app'

export const useApiFetch = <T>(request: string, opts?: any) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  return useFetch<T>(request, {
    baseURL: config.public.apiBase,
    ...opts,
    headers: {
      'Accept': 'application/json',
      'Authorization': token.value ? `Bearer ${token.value}` : '',
      ...opts?.headers,
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const token = useCookie('auth_token')
        token.value = null
        if (process.client) {
          window.location.href = '/login'
        }
      }
    }
  })
}

export const $api = <T>(request: string, opts?: any) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')
  
  return $fetch<T>(request, {
    baseURL: config.public.apiBase,
    ...opts,
    headers: {
      'Accept': 'application/json',
      'Authorization': token.value ? `Bearer ${token.value}` : '',
      ...opts?.headers,
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        const token = useCookie('auth_token')
        token.value = null
        if (process.client) {
          window.location.href = '/login'
        }
      }
    }
  })
}

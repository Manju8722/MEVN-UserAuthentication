import { axiosInstance, axiosPrivateInstance } from '../utils/axios'
import { useAuthStore } from '../stores/auth'
import { watchEffect } from 'vue'
export function useApiPrivate() {
  const authStore = useAuthStore()
  watchEffect(() => {
    axiosPrivateInstance.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers.Authorization = `Bearer ${authStore.access_token}`
        }
        return config
      },
      async (err) => {
        return Promise.reject(err)
      }
    )

    axiosPrivateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (
          (error?.response?.status === 403 || error?.response?.status === 401) &&
          !prevRequest.sent
        ) {
          prevRequest.sent = true
          try {
            await authStore.refresh()
            prevRequest.headers['Authorization'] = authStore.access_token
            return axiosPrivateInstance(prevRequest)
          } catch (error) {
            return Promise.reject(error)
          }
        }
      }
    )
  })
  return axiosPrivateInstance
}

export function useApi(){
  return axiosInstance
}

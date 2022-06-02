import { getCurrentInstance } from '@vue/composition-api'

export const useRoute = () => {
  const vm = getCurrentInstance()
  const route = vm?.proxy.$route
  const router = vm?.proxy.$router

  return {
    route,
    router
  }
}

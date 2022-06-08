<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import { useRoute, useCrypto, useI18n } from '@/hooks'
  import { StoreVueToken } from '@/types'
  import { useAppStore } from '@/stores'

  // 登录页面，主要功能为：解析 URL、设置多语言、登录、获取用户和权限信息
  export default defineComponent({
    async setup() {
      /**
       * 对 URL 中的参数进行解码校验
       */
      const checkURL = (query: string | (string | null)[] | undefined) =>
        typeof query === 'string' ? decodeURIComponent(query) : ''
      // 获取 URL 中的 lang 字段，并设置为网站的多语言
      const { route, router } = useRoute()
      const { setLang } = useI18n()
      const lang = checkURL(route?.query?.lang) // 获取 URL 中的 lang 字段
      setLang(lang) // 设置多语言
      // 获取 URL 中的 t 字段，解密获得 token，登录并且判断用户是否有权限
      const t = checkURL(route?.query?.t) // 获取 URL 中的 t 字段
      if (t !== '') {
        const { aesDecrypt } = useCrypto()
        const token: StoreVueToken = JSON.parse(aesDecrypt(t)) // 解密为 storevue 中的 token、user_id、acc_id
        const appStore = useAppStore()
        const { login, getOwner, getRole } = useAppStore()
        await login(token) // 登录
        if (appStore.token.token) {
          await getOwner() // 获取登录用户信息
          if (appStore.owner.role_id) {
            await getRole() // 获取登录用户权限信息
            if (appStore.role.auth_info) {
              router?.push('main') // 跳转到 main 页面
            }
          }
        }
        //const login: LoginResponse = await post('/api/ccm/account/redirect', token) // 登录
        //if (login.status === 1) {
        //  const { setToken } = useCookie()
        //  setToken(aesEncrypt(JSON.stringify({ ...token, ...login }))) // 将 ccm 的 token 加密放入 cookie 中
        //  const user: UserInfoResponse = await post('/api/ccm/user/info', login) // 获取用户信息
        //  if (user.status === 1) {
        //    const role = await post('/api/ccm/role/authority_info', {
        //      role_id: user.user?.role_id,
        //      token: login.token
        //    }) // 获取权限信息
        //    console.log(role, user, login, token)
        //  }

        //}
      }
    }
  })
</script>

<template>
  <div></div>
</template>

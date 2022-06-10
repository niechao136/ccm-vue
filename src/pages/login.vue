<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import { useRoute, useCrypto, useI18n, useDialog } from '@/hooks'
  import { StoreVueToken } from '@/types'
  import { useAppStore } from '@/stores'
  import { checkURL } from '@/utils'

  // 登录页面，主要功能为：解析 URL、设置多语言、登录、获取用户和权限信息
  export default defineComponent({
    async setup() {
      //#region 获取 URL 中的 lang 字段，并设置为网站的多语言
      const { route, router } = useRoute()
      const { setLang } = useI18n()
      const lang = checkURL(route?.query?.lang) // 获取 URL 中的 lang 字段
      setLang(lang) // 设置多语言
      //#endregion
      //#region 获取 URL 中的 t 字段，解密获得 token，登录并且判断用户是否有权限
      const t = checkURL(route?.query?.t) // 获取 URL 中的 t 字段
      if (t === '') {
        const { confirm } = useDialog()
        confirm({
          title: '登录异常',
          message: '頁面地址錯誤，缺失驗證密鑰',
          confirm: '回到首页',
          beforeClose: (action, _, done) => {
            if (action === 'confirm') {
              window.location.href = import.meta.env.VITE_HOMEPAGE + '/homepage'
            }
            done()
          }
        })
      }
      else {
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
      }
      //#endregion
    }
  })
</script>

<template>
  <div></div>
</template>

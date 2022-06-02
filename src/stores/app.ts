import { defineStore } from 'pinia'
import { reactive } from '@vue/composition-api'
import { useCookie, useCrypto } from '@/hooks'
import {
  CCMToken, User, Role, StoreVueToken,
  LoginResponse, UserInfoResponse, RoleInfoResponse
} from '@/types'
import { copyObject } from '@/utils'
import { post } from '@/api'


export const useAppStore = defineStore('app', () => {
  const token = reactive<CCMToken>({})
  const owner = reactive<User>({})
  const role = reactive<Role>({})
  const { setToken, getToken } = useCookie()
  const { aesDecrypt, aesEncrypt } = useCrypto()

  const login = async (data: StoreVueToken) => {
    const res: LoginResponse = await post('/api/ccm/account/redirect', {
      token: data.token,
      user_id: data.user_id,
      acc_id: data.acc_id
    })
    if (res.status === 1) {
      token.acc_id = data.acc_id
      token.token = res.token
      token.user_id = res.user_id
      setToken(aesEncrypt(JSON.stringify(token)))
    }
  }

  const getOwner = async () => {
    const res: UserInfoResponse = await post('/api/ccm/user/info', {
      token: token.token,
      user_id: token.user_id
    })
    if (res.status === 1) {
      copyObject(owner, res.user)
    }
  }

  const getRole = async () => {
    const res: RoleInfoResponse = await post('/api/ccm/role/authority_info', {
      role_id: owner.role_id,
      token: token.token
    })
    if (res.status === 1) {
      copyObject(role, res.role)
    }
  }

  const checkCookie = () => {
    const cookie = getToken()
    if (cookie !== '') {
      const ccm_token: CCMToken = JSON.parse(aesDecrypt(cookie))
      copyObject(token, ccm_token)
      //token.key = ccm_token.token?.key
      //token.token_id = ccm_token.token?.token_id
    }
  }

  return {
    login,
    checkCookie,
    getOwner,
    getRole,
    owner,
    role,
    token
  }
})

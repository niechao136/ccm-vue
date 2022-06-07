import { defineStore } from 'pinia'
import { reactive } from '@vue/composition-api'
import { useAppStore } from './app'
import { Account, AccListResponse } from '@/types'
import { post } from '@/api'

export const useAccountStore = defineStore('account', () => {
  const accounts = reactive<Record<string, Account>>({})

  const appStore = useAppStore()

  const getAccounts = async () => {
    const res: AccListResponse = await post('/api/ccm/user/accountlist', {
      token: appStore.token.token
    })
    res.accs?.forEach(acc => accounts[acc.id ?? ''] = acc)
    //console.log(accounts)
  }

  return {
    accounts,
    getAccounts
  }
})

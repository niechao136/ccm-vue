import { defineStore } from 'pinia'
import { reactive } from '@vue/composition-api'
import { useAppStore } from './app'
import { Branch, BranchListResponse } from '@/types'
import { post } from '@/api'

export const useBranchStore = defineStore('branch', () => {
  const branchs = reactive<Record<string, Branch>>({})

  const appStore = useAppStore()

  const getBranchs = async () => {
    const res: BranchListResponse = await post('/api/ccm/branch/list', {
      token: appStore.token.token,
      user_id: appStore.token.user_id
    })
    res.branchs?.forEach(branch => branchs[branch.branch_id ?? ''] = branch)
  }

  return {
    branchs,
    getBranchs
  }
})

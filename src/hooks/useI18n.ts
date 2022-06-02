import { getCurrentInstance } from '@vue/composition-api'
import VueI18n from 'vue-i18n'

export const useI18n = () => {
  const vm = getCurrentInstance()
  const i18n: VueI18n = vm?.proxy.$i18n ?? new VueI18n()

  const setLang = (lang: string) => {
    const language = formatLang(lang) ?? 'en'
    i18n.locale = language
    localStorage.setItem('ccm_lang', language)
  }

  const t = (key: string) => i18n.t(key)

  const formatLang = (lang: string) => {
    switch (lang) {
      case "zh-TW":
        return 'zht'
      case "zh-CN":
        return 'zhs'
      case "en-US":
        return 'en'
      case "ja-JP":
        return 'ja'
      case "ko-KR":
        return 'ko'
      case "vi-VN":
        return 'vi'
      case "id-ID":
        return 'id'
      case "th-TH":
        return 'th'
      default:
        return 'en'
    }
  }

  return {
    setLang,
    t
  }
} 

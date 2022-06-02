import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhs from './zhs.json'
import zht from './zht.json'
import en from './en.json'
import ja from './ja.json'
import ko from './ko.json'
import vi from './vi.json'
import th from './th.json'
import id from './id.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('ccm_lang') ?? 'en',
  fallbackLocale: localStorage.getItem('ccm_lang') ?? 'en',
  messages: {
    zhs,
    zht,
    en,
    ja,
    ko,
    vi,
    th,
    id
  }
})

export default i18n

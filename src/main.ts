import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import VueCompositionApi from '@vue/composition-api'
import 'virtual:svg-icons-register'
import {
  // @ts-ignore
  Scrollbar,
  Menu, MenuItem, Submenu,
  Select, Option,
  Dropdown, DropdownItem, DropdownMenu
} from 'element-ui'
import i18n from '@/locales'
import router from '@/router'
import App from '@/App.vue'
import { setDomFontSize } from '@/utils'
import '@/assets/theme/index.css'
import '@/styles/index.scss'

setDomFontSize()

Vue.use(Scrollbar)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.use(PiniaVuePlugin)
Vue.use(VueCompositionApi)

const pinia = createPinia()

new Vue({
  i18n,
  pinia,
  router,
  render: h => h(App)
}).$mount('#app')

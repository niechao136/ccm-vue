import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
//import { useAppStore } from '@/stores'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/login.vue')
  },
  {
    path: '/main',
    component: () => import('@/pages/main/index.vue'),
    children: [
      {
        path: '/',
        components: {
          overview: () => import('@/pages/main/overview.vue'),
          temp: () => import('@/pages/main/temp.vue'),
          sensor: () => import('@/pages/main/sensor.vue'),
          abnormal: () => import('@/pages/main/abnormal.vue'),
          report: () => import('@/pages/main/report.vue'),
          freezer_setting: () => import('@/pages/main/freezer_setting.vue'),
          sensor_setting: () => import('@/pages/main/sensor_setting.vue'),
          alert_setting: () => import('@/pages/main/alert_setting.vue'),
          temp_alert: () => import('@/pages/main/temp_alert.vue'),
          elec_alert: () => import('@/pages/main/elec_alert.vue')
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, _, next) => {
  document.title = to.meta?.title ?? '冷鏈管理'
  next()
})

export default router

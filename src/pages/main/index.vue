<script lang="ts">
  import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'
  import { SvgIcon } from '@/components'
  import { useAppStore } from '@/stores'
  import { scrollbarWidth } from '@/utils'

  export default defineComponent({
    components: {
      SvgIcon
    },
    setup() {
      const page = ref('overview')
      const collapse = ref(false)
      const menu = computed(() => collapse.value ? 'menu_close' : 'menu_open')
      const pages = [
        'overview',
        'temp',
        'sensor',
        'abnormal',
        'report',
        'freezer_setting',
        'sensor_setting',
        'alert_setting',
        'temp_alert',
        'elec_alert'
      ]
      const appStore = useAppStore()
      onMounted(async () => {
        const { getOwner, getRole, checkCookie } = useAppStore()
        if (!appStore.token.token) {
          checkCookie()
        }
        if (!appStore.owner.role_id) {
          await getOwner()
        }
        if (!appStore.role.auth_info) {
          await getRole()
        }
      })
      const gutter = scrollbarWidth()
      const sideStyle = `height: calc(100vh - 8.64583rem + ${gutter}px);width:calc(15.625rem + ${gutter}px);`
      return {
        appStore,
        collapse,
        sideStyle,
        menu,
        page,
        pages
      }
    }
  })
</script>

<template>
  <div class="main-page">
    <div class="page-header">
      <div class="page-logo">
        <svg-icon class="menu-switch" :name="menu"></svg-icon>
        <svg-icon class="home-logo" name="logo"></svg-icon>
      </div>
      <div class="page-top">
        <div class="page-title">Cold Chain Management</div>
        <el-dropdown class="user-info" trigger="click">
          <div class="toggle-btn">
            <div class="user-name">username</div>
            <svg-icon class="arrow" name="arrow_down_black"></svg-icon>
          </div>
          <el-dropdown-menu slot="dropdown" :visibleArrow="false">
            <el-dropdown-item>回到首頁</el-dropdown-item>
            <el-dropdown-item>登出系統</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="page-main">
      <div class="page-side">
        <div class="brand-area" v-show="!collapse">
          <div class="brand-id">品牌ID : d1YS6CFd9uju</div>
          <div class="brand-select"></div>
        </div>
        <el-scrollbar class="page-menu" :wrapStyle="sideStyle"
                      wrap-class="full-menu" view-class="view-menu">
          <el-menu :router="false" ref="side"
                   :collapse="collapse">
            <el-menu-item index="overview" name="overview">
              <svg-icon class="menu-overview" name="menu_overview"></svg-icon>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="page-content">
        <router-view :name="page"></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .main-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .page-header {
      width: 100%;
      height: 70px;
      display: flex;
      box-shadow: 0px 4px 4px -4px #b9b9b9bf;

      .page-logo {
        width: 300px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;

        .menu-switch {
          width: 28px;
          height: 26px;
          margin-right: 20px;
          cursor: pointer;
        }

        .home-logo {
          width: 170px;
          height: 27px;
          cursor: pointer;
        }
      }

      .page-top {
        width: calc(100% - 300px);
        height: 70px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .page-title {
          font-size: 30px;
          color: #131F4F;
          line-height: 70px;
        }

        .user-info {
          height: 30px;
          margin-top: 20px;
          margin-right: 50px;

          .toggle-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 30px;
            cursor: pointer;

            .user-name {
              margin-right: 10px;
              color: #363636;
              font-size: 14px;
            }

            .arrow {
              height: 5px;
              width: 10px;
            }
          }
        }
      }
    }

    .page-main {
      display: flex;
      height: calc(100vh - 70px);

      .page-side {
        height: calc(100vh - 70px);

        .brand-area {
          height: calc(5rem - 1px);
          display: flex;
          flex-direction: column;
          background-color: #1E2234;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);

          .brand-id {
            color: #A0A4AD;
            margin-left: 50px;
            line-height: 50px;
            height: 50px;
          }

          .brand-select {
            margin-left: 50px;
            height: 36px;
          }
        }

        .page-menu {
          background-color: #1E2234;

          .el-menu {
            background-color: #1E2234;
            border: none;
          }
        }
      }
    }
  }
</style>

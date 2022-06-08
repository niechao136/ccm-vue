<script lang="ts">
  import { defineComponent, ref, reactive, onMounted, computed } from '@vue/composition-api'
  import { SvgIcon } from '@/components'
  import { useAppStore, useAccountStore, useBranchStore } from '@/stores'
  import { useScroll, useCookie } from '@/hooks'
  import { Account } from '@/types'

  // 主页面 layout 部分，包括品牌切换、侧边栏、回到首页和登出、底部版号信息
  export default defineComponent({
    components: {
      SvgIcon
    },
    setup() {
      const appStore = useAppStore()

      // head 部分
      /** 登录用户的用户名 */
      const fullname = ref(appStore.owner.name)
      /** menu 切换按钮图标 */
      const menu = computed(() => collapse.value ? 'menu_close' : 'menu_open')
      /**
       * 用户 dropdown 选择事件
       * @param command homepage - 回到首页 logout - 登出
       */
      const handleCommand = (command: string) => {
        switch (command) {
          case 'homepage':
            window.location.href = import.meta.env.VITE_HOMEPAGE + '/homepage'
            break;
          case 'logout':
            const { clearToken } = useCookie()
            clearToken()
            window.location.href = import.meta.env.VITE_HOMEPAGE
            break;
        }
      }

      // side 部分
      /** menu 选中的子页面 */
      const page = ref('overview')
      /** menu 是否展开 */
      const collapse = ref(false)
      /**
       * menu 选择事件
       * @param index
       */
      const menuSelect = (index: string) => page.value = index
      /** 当前品牌 ID */
      const acc_id = ref(appStore.owner.acc_id)
      /** 可供切换的品牌列表 */
      const accs = reactive<Array<Account>>([])
      /** 数据是否获取完成 */
      const loading = ref(true)

      // 滚动条样式
      const { buildStyle } = useScroll()
      /** 侧边栏展开时，side 位置滚动条的样式 */
      const showSide = buildStyle({ min: true, top: 166, width: 300 })
      /** 侧边栏收起时，side 位置滚动条的样式 */
      const hideSide = buildStyle({ min: true, top: 80, width: 105 })
      /** side 位置滚动条的样式 */
      const sideStyle = computed(() => collapse.value ? hideSide : showSide)
      /** 侧边栏展开时，content 位置滚动条的样式 */
      const showMain = buildStyle({ min: true, top: 70, width: 1620 })
      /** 侧边栏收起时，content 位置滚动条的样式 */
      const hideMain = buildStyle({ min: true, top: 70, width: 1815 })
      /** content 位置滚动条的样式 */
      const mainStyle = computed(() => collapse.value ? hideMain : showMain)

      // foot 部分
      /** 配置的版本号 */
      const version = import.meta.env.VITE_VERSION

      // 获取数据
      onMounted(async () => {
        const { getOwner, getRole, checkCookie } = useAppStore()
        const accStore = useAccountStore()
        const { getAccounts } = useAccountStore()
        const { getBranchs } = useBranchStore()
        // store 中是否存有 token, 没有则从 Cookie 中解析
        if (!appStore.token.token) {
          checkCookie()
        }
        // store 中是否存有用户信息, 没有则重新获取
        if (!appStore.owner.role_id) {
          await getOwner()
          fullname.value = appStore.owner.name
          acc_id.value = appStore.owner.acc_id
        }
        // store 中是否存有权限信息, 没有则重新获取
        if (!appStore.role.auth_info) {
          await getRole()
        }
        // 获取品牌列表
        await getAccounts()
        // 获取门店列表
        await getBranchs()
        Object.values(accStore.accounts).forEach((acc, key) => accs[key] = acc)
        loading.value = false
      })

      return {
        fullname,
        acc_id,
        accs,
        loading,
        collapse,
        sideStyle,
        mainStyle,
        menu,
        menuSelect,
        handleCommand,
        version,
        page
      }
    }
  })
</script>

<template>
  <div class="main-page">
    <div class="page-header">
      <div class="page-logo">
        <button class="switch-btn" @click="collapse = !collapse">
          <svg-icon class="menu-switch" :name="menu"></svg-icon>
        </button>
        <svg-icon class="home-logo" name="logo"></svg-icon>
      </div>
      <div class="page-top">
        <div class="page-title">Cold Chain Management</div>
        <el-dropdown class="user-info" trigger="click" @command="handleCommand">
          <div class="toggle-btn">
            <div class="user-name">{{ fullname }}</div>
            <svg-icon class="arrow" name="arrow_down_black"></svg-icon>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown" :visibleArrow="false">
            <el-dropdown-item command="homepage">回到首頁</el-dropdown-item>
            <el-dropdown-item command="logout">登出系統</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div :class="['page-main', {'is-collapse': collapse}]">
      <div class="page-side">
        <div class="brand-area" v-show="!collapse">
          <div class="brand-id">品牌ID : {{ acc_id }}</div>
          <div class="brand-select">
            <el-select v-if="!loading" v-model="acc_id" popper-class="brand-dropdowm">
              <el-option v-for="(item, key) in accs" :key="key" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <svg-icon v-if="!loading" class="select-arrow" name="arrow_down"></svg-icon>
          </div>
        </div>
        <div class="border-bottom"></div>
        <el-scrollbar :wrapStyle="sideStyle" :class="[{'is-collapse': collapse}, 'page-menu']"
                      wrap-class="full-menu" view-class="view-menu">
          <el-menu :router="false" ref="side" class="side-menu"
                   :collapse="collapse" @select="menuSelect" :default-active="page" :collapse-transition="false">
            <el-menu-item index="overview" name="overview">
              <svg-icon class="menu-icon" name="menu_overview"></svg-icon>
              <span v-show="!collapse" class="title">總覽</span>
            </el-menu-item>
            <el-menu-item index="abnormal" name="abnormal">
              <svg-icon class="menu-icon" name="menu_abnormal"></svg-icon>
              <span v-show="!collapse" class="title">異常狀態</span>
            </el-menu-item>
            <el-menu-item index="temp" name="temp">
              <svg-icon class="menu-icon" name="menu_temp"></svg-icon>
              <span v-show="!collapse" class="title">溫度監測</span>
            </el-menu-item>
            <el-menu-item index="sensor" name="sensor">
              <svg-icon class="menu-icon" name="menu_sensor"></svg-icon>
              <span v-show="!collapse" class="title">裝置監測</span>
            </el-menu-item>
            <el-menu-item index="report" name="report">
              <svg-icon class="menu-icon" name="menu_report"></svg-icon>
              <span v-show="!collapse" class="title">匯出報表</span>
            </el-menu-item>
            <el-submenu index="settings" name="settings" popper-class="menu-settings">
              <template slot="title">
                <svg-icon class="menu-icon" name="menu_settings"></svg-icon>
                <span v-show="!collapse" class="title">一般設定</span>
                <svg-icon v-show="!collapse" class="menu-arrow" name="arrow_down"></svg-icon>
              </template>
              <el-menu-item index="freezer_setting" name="freezer_setting">
                <div class="dot-icon"></div>
                <span class="title">冰箱設定</span>
              </el-menu-item>
              <el-menu-item index="sensor_setting" name="sensor_setting">
                <div class="dot-icon"></div>
                <span class="title">測溫裝置設定</span>
              </el-menu-item>
              <el-submenu index="temp_setting" name="temp_setting" popper-class="menu-alerts">
                <template slot="title">
                  <div class="dot-icon"></div>
                  <span class="title">溫度警報設定</span>
                  <svg-icon class="menu-arrow" name="arrow_down"></svg-icon>
                </template>
                <el-menu-item index="temp_alert" name="temp_alert">
                  <div class="dot-icon"></div>
                  <span class="title">警報條件</span>
                </el-menu-item>
                <el-menu-item index="alert_setting" name="alert_setting">
                  <div class="dot-icon"></div>
                  <span class="title">發報設定</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item index="elec_alert" name="elec_alert">
                <div class="dot-icon"></div>
                <span class="title">電量警報設定</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="page-content">
        <el-scrollbar :wrapStyle="mainStyle" :class="[{'is-collapse': collapse}, 'content-main']"
                      wrap-class="full-content" view-class="view-content">
          <div class="main-content">
            <keep-alive>
              <router-view :name="page"></router-view>
            </keep-alive>
          </div>
          <div class="main-footer">
            {{version}} © 2021 Advantech Intelligent City Services Co., Ltd. (AiCS) All Rights Reserved.
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .main-page {
    width: 100%;
    height: 100vh;
    min-height: 600px;
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

        .switch-btn {
          width: 28px;
          height: 26px;
          border: none;
          background-color: transparent;
          margin-right: 20px;
          padding: 0;
        }

        .menu-switch {
          width: 28px;
          height: 26px;
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
      min-height: calc(600px - 3.64583rem);

      .page-side {
        height: calc(100vh - 70px);
        min-height: calc(600px - 3.64583rem);

        .brand-area {
          height: 86px;
          display: flex;
          flex-direction: column;
          background-color: #1E2234;

          .brand-id {
            color: #A0A4AD;
            margin-left: 50px;
            line-height: 50px;
            height: 50px;
          }

          .brand-select {
            margin-left: 45px;
            height: 36px;
            display: flex;
            align-items: center;

            .el-select {
              width: 220px;

              ::v-deep {
                .el-input__inner {
                  height: 36px;
                  width: 220px;
                  padding: 0 15px 0 5px;
                  background-color: #1E2234;
                  color: #fff;
                  border: none;
                  font-size: 24px;
                }

                .el-input__suffix {
                  display: none;
                }
              }
            }

            .select-arrow {
              height: 7px;
              width: 14px;
              -webkit-transform: rotateZ(-90deg);
              transform: rotateZ(-90deg);
            }
          }
        }

        .border-bottom {
          height: calc(0.52083rem - 1px);
          background-color: #1E2234;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .page-menu {
          background-color: #1E2234;

          .el-menu {
            background-color: #1E2234;
            border: none;
            padding-bottom: 20px;

            ::v-deep .el-submenu__title, .el-menu-item {
              padding: 0 50px !important;
              height: 70px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid rgba(255, 255, 255, .05);

              .menu-icon {
                height: 24px;
                width: 24px;
                margin-right: 30px;
              }

              .dot-icon {
                height: 8px;
                width: 8px;
                background-color: #fff;
                margin-right: 30px;
                border-radius: 50%;
              }

              .title {
                color: #fff;
                height: 70px;
                line-height: 70px;
                font-size: 16px;
              }

              .menu-arrow {
                height: 7px;
                width: 14px;
                position: absolute;
                right: 50px;
                transition: transform .3s,-webkit-transform .3s;
                /*top: 50%;
                margin-top: -3.5px;*/
              }

              .el-submenu__icon-arrow {
                display: none;
              }

              &:hover, &:focus {
                background-color: #F54A84;
              }

              &.is-active {
                background-color: #F31D65;
              }
            }

            .el-submenu {
              ::v-deep .el-menu--inline {
                background-color: #1E2234;
              }

              &[name="temp_setting"] {
                .el-menu-item {
                  padding-left: 70px !important;
                }
              }
            }

            .el-submenu.is-opened {
              > ::v-deep .el-submenu__title {
                /*background-color: #F54A84;*/

                .menu-arrow {
                  -webkit-transform: rotateZ(180deg);
                  transform: rotateZ(180deg);
                }
              }
            }

            .el-submenu.is-active {
              > ::v-deep .el-submenu__title {
                background-color: #F31D65;
              }
            }

            &.el-menu--collapse {
              width: 105px;

              ::v-deep .el-submenu__title, .el-menu-item {
                padding: 0 20px !important;
                justify-content: center;

                .menu-icon {
                  margin-right: 0;
                }
              }
            }
          }
        }
      }

      .page-content {
        ::v-deep .view-content {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          justify-content: space-between;

          .main-content {
            /*height: 2000px;*/
          }

          .main-footer {
            padding: 20px 30px;
            color: #4B5262;
            font-size: 14px;
            line-height: 20px;
            height: 20px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .menu-settings {
    width: 300px;

    .el-menu--popup {
      background-color: #1E2234;

      .el-submenu__title, .el-menu-item {
        padding: 0 50px !important;
        height: 70px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, .05);

        .dot-icon {
          height: 8px;
          width: 8px;
          background-color: #fff;
          margin-right: 30px;
          border-radius: 50%;
        }

        .title {
          color: #fff;
          height: 70px;
          line-height: 70px;
          font-size: 16px;
        }

        .menu-arrow {
          height: 7px;
          width: 14px;
          position: absolute;
          right: 50px;
          transition: transform .3s,-webkit-transform .3s;
          -webkit-transform: rotateZ(-90deg);
          transform: rotateZ(-90deg);
        }

        .el-submenu__icon-arrow {
          display: none;
        }

        &:hover, &:focus {
          background-color: #F54A84;
        }

        &.is-active {
          background-color: #F31D65;
        }
      }

      .el-submenu.is-opened {
        > .el-submenu__title {
          /*background-color: #F54A84;*/

          .menu-arrow {
            -webkit-transform: rotateZ(90deg);
            transform: rotateZ(90deg);
          }
        }
      }

      .el-submenu.is-active {
        > .el-submenu__title {
          background-color: #F31D65;
        }
      }
    }

    .menu-alerts {
      width: 300px;
    }
  }

  .brand-dropdowm {
    background-color: #1E2234;
    border: none;

    .el-select-dropdown__item {
      color: #fff;
      height: 48px;
      font-size: 16px;
      line-height: 48px;

      &.hover, &.selected {
        background-color: #362f49 !important;
        color: #f31d65;
        font-weight: 400;
      }
    }

    .popper__arrow {
      display: none;
    }
  }

  .user-dropdown {
    .el-dropdown-menu__item {
      &:hover, &:focus {
        background-color: #fee8f0;
        color: #f54a84;
      }
    }
  }
</style>

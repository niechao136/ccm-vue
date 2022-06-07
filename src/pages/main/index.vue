<script lang="ts">
  import { defineComponent, ref, reactive, onMounted, computed } from '@vue/composition-api'
  import { SvgIcon } from '@/components'
  import { useAppStore, useAccountStore, useBranchStore } from '@/stores'
  import { scrollbarWidth } from '@/utils'
  import { Account } from '@/types'

  export default defineComponent({
    components: {
      SvgIcon
    },
    setup() {
      const page = ref('overview')
      const collapse = ref(false)
      const menu = computed(() => collapse.value ? 'menu_close' : 'menu_open')
      const menuSelect = (index: string) => page.value = index
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
      const fullname = ref(appStore.owner.name)
      const acc_id = ref(appStore.owner.acc_id)
      const accStore = useAccountStore()
      const accs = reactive<Array<Account>>([])
      onMounted(async () => {
        const { getOwner, getRole, checkCookie } = useAppStore()
        const { getAccounts } = useAccountStore()
        const { getBranchs } = useBranchStore()
        if (!appStore.token.token) {
          checkCookie()
        }
        if (!appStore.owner.role_id) {
          await getOwner()
          fullname.value = appStore.owner.name
          acc_id.value = appStore.owner.acc_id
        }
        if (!appStore.role.auth_info) {
          await getRole()
        }
        await getAccounts()
        await getBranchs()
        Object.values(accStore.accounts).forEach((acc, key) => accs[key] = acc)
      })
      const gutter = scrollbarWidth()
      const showStyle = `min-height: calc(600px - 8.64583rem + ${gutter}px);height: calc(100vh - 8.64583rem + ${gutter}px);width:calc(15.625rem + ${gutter}px);`
      const hideStyle = `min-height: calc(600px - 8.64583rem + ${gutter}px);height: calc(100vh - 4.166667rem + ${gutter}px);width:calc(5.46875rem + ${gutter}px);`
      const sideStyle = computed(() => collapse.value ? hideStyle : showStyle)
      return {
        fullname,
        acc_id,
        accs,
        collapse,
        sideStyle,
        menu,
        menuSelect,
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
        <button class="switch-btn" @click="collapse = !collapse">
          <svg-icon class="menu-switch" :name="menu"></svg-icon>
        </button>
        <svg-icon class="home-logo" name="logo"></svg-icon>
      </div>
      <div class="page-top">
        <div class="page-title">Cold Chain Management</div>
        <el-dropdown class="user-info" trigger="click">
          <div class="toggle-btn">
            <div class="user-name">{{ fullname }}</div>
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
          <div class="brand-id">品牌ID : {{ acc_id }}</div>
          <div class="brand-select">
            <el-select v-model="acc_id" popper-class="brand-dropdowm">
              <el-option v-for="(item, key) in accs" :key="key" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <svg-icon class="select-arrow" name="arrow_down"></svg-icon>
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
        <keep-alive>
          <router-view :name="page"></router-view>
        </keep-alive>
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
</style>

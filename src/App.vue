<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import { useScroll } from '@/hooks'

  export default defineComponent({
    setup() {
      const { buildStyle } = useScroll()
      const wrapStyle = buildStyle()
      //console.log(wrapStyle)
      return {
        wrapStyle
      }
    }
  })
</script>

<template>
  <el-scrollbar class="screen-scrollbar" :wrapStyle="wrapStyle"
                wrap-class="full-screen" view-class="view-box">
    <router-view></router-view>
  </el-scrollbar>
</template>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
  }

  .screen-scrollbar {
    height: 100vh !important;

    .full-screen {

      .view-box {
        min-width: 1200px;
        min-height: 600px;
      }
    }
  }
</style>

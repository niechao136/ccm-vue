<!--<script lang="ts">
  import { defineComponent, computed } from '@vue/composition-api'

  export default defineComponent({
    props: {
      name: {
        type: String
      }
    },
    setup(props) {
      const iconName = computed(() => `#icon-${props.name}`)
      return {
        iconName
      }
    }
  })
</script>-->

<template functional>
  <svg aria-hidden="true" :class="[data.class, data.staticClass, 'svg-icon']">
    <use :xlink:href="`#icon-${props.name}`"></use>
  </svg>
</template>
